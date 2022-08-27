import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setTitleCard, setDescriptionCard, addTask } from "@/store/main/mainSlice";
import Popover from "@/components/Popover";
import Button from "@/components/Button";
import TaskList from "@/components/TaskList";
import Input from "@/components/Input";
import lang from '@/locales/ru/common.json';

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
          className='w-full text-center mb-4 font-semibold hover:cursor-pointer hover:bg-slate-100 whitespace-pre-wrap break-all hover:transition-all duration-200 hover:bg-slate-100'
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
            <Button text={`${lang.save}`} clickHandler={saveDescriptionHandler} />
            <Button text={`${lang.cansel}`} clickHandler={() => setIsEditDescription(false)} />
          </div>
        </>
      ) : card.description === "" ? (
        <div
          className='w-full text-center text-gray-400  hover:text-gray-600 border p-2 hover:cursor-pointer mb-4 hover:transition-all duration-200 hover:bg-slate-100'
          onClick={editDescriptionHandler}
        >
          {`${lang.addDescription}`}
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
            <div className='w-full text-center font-bold mb-6'>{`${lang.creatingNewTaskList}`}</div>
            <div className='w-full text-left font-semibold mb-2'>{`${lang.listTitle}`}:</div>
            <Input
              inputRef={titleTaskRef}
              value={newTaskTitle}
              onChangeHandler={onChangeTitleTaskHandler}
            />
          </div>
          <div className='flex mb-2'>
            <Button text={`${lang.save}`} clickHandler={saveTaskTitleHandler} />
            <Button text={`${lang.cansel}`} clickHandler={() => setIsAddTaskList(false)} />
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
        className='w-full text-center text-gray-400  hover:text-gray-600 border-t p-2 hover:cursor-pointer hover:transition-all duration-200 hover:bg-slate-100'
        onClick={editTasksHandler}
      >
        {`${lang.addTaskList}`}
      </div>
    </Popover>
  )
}