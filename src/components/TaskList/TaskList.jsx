import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Popover from "@/components/Popover";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Confirm from "@/components/Confirm";
import {
  updateTask,
  addTaskListElement,
  removeTaskList,
  removeTaskListElement
} from "@/store/main/mainSlice";
import lang from '@/locales/ru/common.json';

export const TaskList = ({ boardId, cardId, tasks }) => {
  const dispatch = useDispatch();
  const taskListElementRef = useRef();
  const taskTitleRef = useRef();
  const taskListElemRef = useRef();
  const [isAddTaskListElement, setIsAddTaskListElement] = useState(false);
  const [newTaskListText, setNewTaskListText] = useState("");
  const [taskId, setTaskId] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditTaskTitle, setIsEditTaskTitle] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isEditTaskListElement, setIsEditTaskListElement] = useState(false);
  const [taskListElemText, setTaskListElemText] = useState("");
  const [elemId, setElemId] = useState("");

  console.log("tasks:", tasks);

  useEffect(() => {
    if (isAddTaskListElement) {
      taskListElementRef.current.focus();
    }
    if (isEditTaskTitle) {
      taskTitleRef.current.focus();
    }
    if (isEditTaskListElement) {
      taskListElemRef.current.focus();
    }
  }, [isAddTaskListElement, isEditTaskTitle, isEditTaskListElement]);

  const checkHandler = (e, taskId, listId) => {
    dispatch(
      updateTask({ boardId, cardId, taskId, listId, checked: e.target.checked })
    );
  };

  const addListElemHandler = (taskId) => {
    setNewTaskListText("");
    setIsAddTaskListElement(true);
    setTaskId(taskId);
  };

  const onChangeTaskTextHandler = (text) => {
    setNewTaskListText(text);
  };

  const onChangeTitleTaskHandler = (title) => {
    setNewTaskTitle(title);
  };

  const onEditTitleHandler = (e, taskTitle, taskId) => {
    e.stopPropagation();
    setNewTaskTitle(taskTitle);
    setTaskId(taskId);
    setIsEditTaskTitle(true);
  };

  const addListElem = (e) => {
    if (e.code === 'Enter' || e.type === 'click') {
      if (newTaskListText) {
        dispatch(
          addTaskListElement({ boardId, cardId, taskId, newTaskListText })
        );
        setIsAddTaskListElement(false);
      }
    }
  };

  const saveTaskTitleHandler = () => {
    if (newTaskTitle) {
      setIsEditTaskTitle(false);
      dispatch(
        updateTask({ boardId, cardId, taskId, taskTitle: newTaskTitle })
      );
    }
  };

  const deleteTaskListHandler = (taskId) => {
    setIsOpenConfirmDialog(true);
    setTaskId(taskId);
  };

  const deleteTaskList = () => {
    setIsOpenConfirmDialog(false);
    dispatch(removeTaskList({ boardId, cardId, taskId }));
  };

  const editTaskListElemText = (data) => {
    setIsEditTaskListElement(true);
    
    setElemId(data.id);
    setTaskId(data.taskId);
    setTaskListElemText(data.value);
  };

  const onChangeTaskListElementHandler = (text) => {
    setTaskListElemText(text);
  };

  const saveTaskListElemText = () => {
    if (taskListElemText) {
      setIsEditTaskListElement(false);
      dispatch(
        updateTask({
          boardId,
          cardId,
          taskId,
          listId: elemId,
          taskListElemText
        })
      );
    }
  };

  const deleteTaskListElem = (taskId, elemId) => {
    dispatch(
      removeTaskListElement({ boardId, cardId, taskId, listId: elemId })
    );
  }

  return (
    <>
      {isAddTaskListElement && (
        <Popover clickOut={() => setIsAddTaskListElement(false)}>
          <div className='w-full text-center my-4 font-semibold'>
            <div className='w-full text-center font-bold mb-6 break-normal'>
            {`${lang.addNewTaskListElement}`}
            </div>
            <div className='w-full text-left font-semibold mb-2'> {`${lang.text}`}:</div>
            <Input
              inputRef={taskListElementRef}
              value={newTaskListText}
              onChangeHandler={onChangeTaskTextHandler}
              onBlurHandler={addListElem}
            />
          </div>
          <div className='flex mb-2'>
            <Button text={`${lang.save}`} clickHandler={addListElem} />
            <Button
              text={`${lang.cansel}`}
              clickHandler={(e) => setIsAddTaskListElement(false)}
            />
          </div>
        </Popover>
      )}

      {tasks.map((task) => {
        return (
          <div
            key={task.id}
            className='w-full text-center p-3 mb-2 overflow-y-auto whitespace-pre-wrap break-all'
          >
            {isEditTaskTitle && taskId === task.id ? (
              <Input
                inputRef={taskTitleRef}
                value={newTaskTitle}
                onChangeHandler={onChangeTitleTaskHandler}
                onBlurHandler={saveTaskTitleHandler}
              />
            ) : (
              <div
                key={task.id}
                className={`${task.id} w-full mb-5 font-semibold overflow-y-auto whitespace-pre-wrap break-all hover:cursor-pointer hover:transition-all duration-200 hover:bg-slate-100`}
                title={`${lang.editTitle}`}
                onClick={(e) => onEditTitleHandler(e, task.title, task.id)}
              >
                {task.title}
              </div>
            )}

            {task.list.map((elem) => {
              let styleText =
                "w-full flex items-center text-left font-normal mt-2 overflow-y-auto whitespace-pre-wrap break-all hover:bg-slate-100 hover:cursor-pointer hover:transition-all duration-200 hover:bg-slate-100";
              if (elem.checked) styleText = `${styleText} line-through`;
              return (
                <div key={elem.id} className='flex'>
                  <div key={elem.id} className={styleText}>
                    <input
                      className='mr-4 h-5 ml-2'
                      onChange={(e) => checkHandler(e, task.id, elem.id)}
                      type='checkbox'
                      checked={elem.checked}
                    ></input>
                    {isEditTaskListElement && elem.id === elemId ? (
                      <Input
                        type={"taskList"}
                        inputRef={taskListElemRef}
                        value={taskListElemText}
                        onChangeHandler={onChangeTaskListElementHandler}
                        onBlurHandler={saveTaskListElemText}
                      />
                    ) : (
                      <div
                        className='w-full'
                        onClick={() =>
                          editTaskListElemText({
                            id: elem.id,
                            value: elem.text,
                            taskId: task.id
                          })
                        }
                      >
                        {elem.text}
                      </div>
                    )}
                  </div>
                  <Button text={""} clickHandler={() => deleteTaskListElem(task.id, elem.id)} type={"lightDel"} />
                </div>
              );
            })}

            <div className='-w-full flex justify-between mt-5 border-t'>
              <Button
                text={`${lang.addTaskListElement}`}
                clickHandler={() => addListElemHandler(task.id)}
                type={"lightAdd"}
              />
              <Button
                text={`${lang.removeList}`}
                clickHandler={() => deleteTaskListHandler(task.id)}
                type={"lightDel"}
              />
            </div>

            {isOpenConfirmDialog && (
              <Confirm
                title={`${lang.questionRemoveTaskList}`}
                yesHandler={deleteTaskList}
                noHandler={() => setIsOpenConfirmDialog(false)}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
