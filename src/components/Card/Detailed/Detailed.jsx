import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setTitleCard, setDescriptionCard, addTask } from "@/store/main/mainSlice";
import Popover from "@/components/Popover";
import Button from "@/components/Button";
import TaskList from "@/components/TaskList";
import Input from "@/components/Input";

export const Detailed = ({ card, boardId, setIsCardOpenned }) => {
  const dispatch = useDispatch();
  const titleCardRef = useRef();
  const titleTaskRef = useRef();
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const textareaRows = newDescription.split("\n").length;
  const [isEditTitleCard, setIsEditTitleCard] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddTaskList, setIsAddTaskList] = useState(false);

  useEffect(() => {
    setCardTitle(card.title);
    setNewDescription(card.description);
  }, []);

  useEffect(() => {
    if (isEditTitleCard) {
      titleCardRef.current.focus();
    }
    if (isAddTaskList) {
      titleTaskRef.current.focus();
    }
  }, [isEditTitleCard, isAddTaskList]);

  const editDescriptionHandler = () => {
    setIsEditDescription(true);
  };

  const saveDescriptionHandler = () => {
    setIsEditDescription(false);
    dispatch(setDescriptionCard({ cardId: card.id, boardId, newDescription }));
  };

  const onEditTitleHandler = (e) => {
    e.stopPropagation();
    setIsEditTitleCard(true);
  };

  const editTasksHandler = () => {
    setNewTaskTitle('');
    setIsAddTaskList(true);
  };

  const saveCardTitle = () => {
    // console.log("saveCardTitle cardTitle::", cardTitle);
    // console.log("saveCardTitle card.title::", card.title);
    setIsEditTitleCard(false);

    if (cardTitle !== card.title) {
      dispatch(setTitleCard({ cardId: card.id, boardId, cardTitle }));
    }
  };

  const onChangeTitleCardHandler = (title) => {
    setCardTitle(title);
  };

  const onChangeTitleTaskHandler = (title) => {
    setNewTaskTitle(title);
  };

  const saveTaskTitleHandler = () => {
    if (newTaskTitle) {
      setIsAddTaskList(false);
      dispatch(addTask({ boardId, cardId: card.id, title: newTaskTitle }));
    }
  };

  return (
    <Popover clickOut={() => setIsCardOpenned(false)}>
      {isEditTitleCard ? (
        <Input
          inputRef={titleCardRef}
          value={cardTitle}
          onChangeHandler={onChangeTitleCardHandler}
          onBlurHandler={saveCardTitle}
        />
      ) : (
        <div
          className='w-full text-center mb-4 font-semibold hover:cursor-pointer hover:bg-slate-100 whitespace-pre-wrap break-all'
          onClick={(e) => onEditTitleHandler(e)}
        >
          {card.title}
        </div>
      )}

      <div className='w-full text-left font-semibold'>Описание:</div>

      {isEditDescription ? (
        <>
          <textarea
            className='w-full h-fit text-left mb-4 border border-2 border-sky-400 rounded p-2'
            rows={textareaRows}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          ></textarea>
          <div className='flex'>
            <Button text={'Сохранить'} clickHandler={saveDescriptionHandler} />
            <Button text={'Отменить'} clickHandler={() => setIsEditDescription(false)} />
          </div>
        </>
      ) : card.description === "" ? (
        <div
          className='w-full text-center text-gray-400  hover:text-gray-600 border p-2 hover:cursor-pointer mb-4'
          onClick={editDescriptionHandler}
        >
          Добавить описание
        </div>
      ) : (
        <div
          className='w-full text-left p-3 mb-4 mt-1 overflow-y-auto whitespace-pre-wrap break-all'
          onClick={editDescriptionHandler}
        >
          {card.description}
        </div>
      )}

      <div className='w-full text-left font-semibold'>Задачи:</div>

      {isAddTaskList && (
        <Popover clickOut={() => setIsAddTaskList(false)}>
          <div className='w-full text-center my-4 font-semibold'>
            <div className='w-full text-center font-bold mb-6'>Создание нового списка задач</div>
            <div className='w-full text-left font-semibold mb-2'>Заголовок списка:</div>
            <Input
              inputRef={titleTaskRef}
              value={newTaskTitle}
              onChangeHandler={onChangeTitleTaskHandler}
            />
          </div>
          <div className='flex mb-2'>
            <Button text={'Сохранить'} clickHandler={saveTaskTitleHandler} />
            <Button text={'Отменить'} clickHandler={() => setIsAddTaskList(false)} />
          </div>
        </Popover>
      )}

      {card.tasks.length !== 0 ? (
        <div
          className='w-full text-left overflow-y-auto whitespace-pre-wrap break-all'>
          <TaskList boardId={boardId} cardId={card.id} tasks={card.tasks}/>
        </div>
      ) : (
        null
      )}

      <div
        className='w-full text-center text-gray-400  hover:text-gray-600 border-t p-2 hover:cursor-pointer'
        onClick={editTasksHandler}
      >
        Добавить список задач
      </div>
    </Popover>
  )
}