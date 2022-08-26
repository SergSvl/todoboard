import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Popover from "@/components/Popover";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { updateTask, addTaskListElement } from "@/store/main/mainSlice";

export const TaskList = ({ boardId, cardId, tasks }) => {
  const dispatch = useDispatch();
  const taskListElementRef = useRef();
  const taskTitleRef = useRef();
  const [isAddTaskListElement, setIsAddTaskListElement] = useState(false);
  const [newTaskListText, setNewTaskListText] = useState("");
  const [taskId, setTaskId] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditTaskTitle, setIsEditTaskTitle] = useState(false);

  console.log("tasks:", tasks);
  /*
    const task = {
      title: '',
      list:[
        {
          id: '1',
          text: '1. Починить машину, подстричь газон, убрать лужайку, принести песок, выгрузить кирпичи, помыть окна',
          checked: false
        },
        {
          id: '2',
          text: '2. Покормить корову',
          checked: false
        }
      ]
    }*/
  
  useEffect(() => {
    if (isAddTaskListElement) {
      taskListElementRef.current.focus();
    }
    if (isEditTaskTitle) {
      taskTitleRef.current.focus();
    }
  }, [isAddTaskListElement, isEditTaskTitle]);
  
  const clickOutHandler = (e) => {
    e.stopPropagation();
    setIsAddTaskListElement(false);
    setIsEditTaskTitle(false);
  };

  const checkHandler = (e, taskId, listId) => {
    // console.log("checkHandler::", { boardId, cardId, taskId, listId, checked: e.target.checked });
    dispatch(updateTask({ boardId, cardId, taskId, listId, checked: e.target.checked }));
  };

  const addListElemHandler = (taskId) => {
    setNewTaskListText('');
    setIsAddTaskListElement(true);
    setTaskId(taskId);
  }

  const onChangeTaskTextHandler = (text) => {
    setNewTaskListText(text);
  }

  const onChangeTitleTaskHandler = (title) => {
    setNewTaskTitle(title);
  };

  const onEditTitleHandler = (e, taskTitle, taskId) => {
    e.stopPropagation();
    setNewTaskTitle(taskTitle);
    setTaskId(taskId);
    setIsEditTaskTitle(true);
  };

  const addListElem = () => {
    if (newTaskListText) {
      dispatch(addTaskListElement({ boardId, cardId, taskId, newTaskListText }));
      setIsAddTaskListElement(false);
    }
  }

  const saveTaskTitleHandler = () => {
    if (newTaskTitle) {
      setIsEditTaskTitle(false);
      dispatch(updateTask({ boardId, cardId, taskId, taskTitle: newTaskTitle }));
    }
  };

  return (
    <>
      {isAddTaskListElement && (
        <Popover clickOut={(e) => clickOutHandler(e)}>
          <div className='w-full text-center my-4 font-semibold'>
            <div className='w-full text-center font-bold mb-6'>Добавление нового пункта списка задач</div>
            <div className='w-full text-left font-semibold mb-2'>Текст:</div>
            <Input
              inputRef={taskListElementRef}
              value={newTaskListText}
              onChangeHandler={onChangeTaskTextHandler}
            />
          </div>
          <div className='flex mb-2'>
            <Button text={'Сохранить'} clickHandler={addListElem} />
            <Button text={'Отменить'} clickHandler={(e) => setIsAddTaskListElement(false)} />
          </div>
        </Popover>
      )}

      {tasks.map((task) => {
        return (
          <div
            key={task.id}
            className='w-full text-center  p-3 mb-2 overflow-y-auto whitespace-pre-wrap break-all'
          >
            {isEditTaskTitle ? (
              <Popover clickOut={(e) => clickOutHandler(e)}>
                <div className='w-full text-center my-4 font-semibold'>
                  <div className='w-full text-left font-semibold mb-2'>Изменение заголовка списка задач:</div>
                  <Input
                    inputRef={taskTitleRef}
                    value={newTaskTitle}
                    onChangeHandler={onChangeTitleTaskHandler}
                  />
                </div>
                <div className='flex mb-2'>
                  <Button text={'Сохранить'} clickHandler={saveTaskTitleHandler} />
                  <Button text={'Отменить'} clickHandler={() => setIsEditTaskTitle(false)} />
                </div>
              </Popover>
            ) : (
              <div
                key={task.id} 
                className={`${task.id} w-full mb-5 font-semibold overflow-y-auto whitespace-pre-wrap break-all`}
                onClick={(e) => onEditTitleHandler(e, task.title, task.id)}
              >{task.title}</div>
            )}

            {task.list.map((elem) => {
              let styleText = 'w-full flex items-center text-left font-normal mt-2 overflow-y-auto whitespace-pre-wrap break-all';
              if (elem.checked) styleText = `${styleText} line-through`;
              return (
                <div
                  key={elem.id}
                  className={styleText}
                >
                  <input
                    className='mr-4 h-5'
                    onChange={(e) => checkHandler(e, task.id, elem.id)}
                    type='checkbox'
                    checked={elem.checked}
                  ></input>
                  {elem.text}
                </div>
              );
            })}

            <div className='w-full flex mt-5 border-t'>
              <Button text={'Добавить элемент спика'} clickHandler={() => addListElemHandler(task.id)} type={'lightAdd'} />
            </div>
          </div>
        );
      })}
    </>
  );
};
