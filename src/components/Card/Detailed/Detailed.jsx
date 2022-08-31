import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setTitleCard, setDescriptionCard, addTask, addTag, updateTag, deleteTag } from "@/store/main/mainSlice";
import Popover from "@/components/Popover";
import Button from "@/components/Button";
import TaskList from "@/components/TaskList";
import Input from "@/components/Input";
import lang from '@/locales/ru/common.json';
import Tags from '@/components/Card/Tags';
import { Colors } from '@/components/Card/Tags/Colors';

export const Detailed = ({ card, boardId, setIsCardOpenned, setIsDraggableBoard }) => {
  const dispatch = useDispatch();
  const titleCardRef = useRef();
  const titleTaskRef = useRef();
  const tagTextRef = useRef();
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const textareaRows = newDescription.split("\n").length;
  const [isEditTitleCard, setIsEditTitleCard] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddTaskList, setIsAddTaskList] = useState(false);
  const [newTagText, setNewTagText] = useState("");
  const [newTagColor, setNewTagColor] = useState("");
  const [isAddTag, setIsAddTag] = useState(false);
  const [titleTagWindow, setTitleTagWindow] = useState(lang.addingTag);
  const [tagId, setTagId] = useState('');

  useEffect(() => {
    setCardTitle(card.title);
    setNewDescription(card.description);
    setIsDraggableBoard(false);

    return () => setIsDraggableBoard(true);
  }, []);

  useEffect(() => {
    if (isEditTitleCard) {
      titleCardRef.current.focus();
    }
    if (isAddTaskList) {
      titleTaskRef.current.focus();
    }
    if (isAddTag) {
      tagTextRef.current.focus();
    }
  }, [isEditTitleCard, isAddTaskList, isAddTag]);

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

  const saveTaskTitleHandler = (e) => {
    if (e.code === 'Enter' || e.type === 'click') {
      if (newTaskTitle) {
        setIsAddTaskList(false);
        dispatch(addTask({ boardId, cardId: card.id, title: newTaskTitle }));
      }
    }
  };

  const editTagHandler = () => {
    setNewTagText('');
    setNewTagColor('');
    setTitleTagWindow(lang.addingTag);
    setTagId('');
    setIsAddTag(true);
  };

  const onChangeTagTextHandler = (text) => {
    setNewTagText(text);
  }

  const selectTagColorHandler = (bgColor) => {
    setNewTagColor(bgColor);
  }

  const saveTagHandler = (e) => {
    if (e.code === 'Enter' || e.type === 'click') {
      setIsAddTag(false);
      if (tagId) {
        dispatch(updateTag({ boardId, cardId: card.id, tagId, newTagText, newTagColor }));
      } else {
        dispatch(addTag({ boardId, cardId: card.id, newTagText, newTagColor }));
      }
    }
  }

  const changeTagHandler = (tag) => {
    setNewTagText(tag.text);
    setNewTagColor(tag.color);
    setTagId(tag.id);
    setIsAddTag(true);
    setTitleTagWindow(lang.changingTag);
  }

  const deleteTagHandler = (tagId) => {
    dispatch(deleteTag({ boardId, cardId: card.id, tagId }));
  }

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
          title={lang.editTitle}
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
            <Button text={lang.save} clickHandler={saveDescriptionHandler} />
            <Button text={lang.cansel} clickHandler={() => setIsEditDescription(false)} />
          </div>
        </>
      ) : card.description === "" ? (
        <div
          className='w-full text-center text-gray-400  hover:text-gray-600 border p-2 hover:cursor-pointer mb-4 hover:transition-all duration-200'
          onClick={editDescriptionHandler}
        >
          {lang.addDescription}
        </div>
      ) : (
        <div
          className='w-full text-left p-3 mb-4 mt-1 overflow-y-auto whitespace-pre-wrap break-all'
          onClick={editDescriptionHandler}
        >
          {card.description}
        </div>
      )}

      <div className='w-full text-left font-semibold'>{lang.tasks}:</div>

      {isAddTaskList && (
        <Popover clickOut={() => setIsAddTaskList(false)}>
          <div className='w-full text-center my-4 font-semibold'>
            <div className='w-full text-center font-bold mb-6'>{lang.creatingNewTaskList}</div>
            <div className='w-full text-left font-semibold mb-2'>{lang.listTitle}:</div>
            <Input
              inputRef={titleTaskRef}
              value={newTaskTitle}
              onChangeHandler={onChangeTitleTaskHandler}
              onBlurHandler={saveTaskTitleHandler}
            />
          </div>
          <div className='flex mb-2'>
            <Button text={lang.save} clickHandler={saveTaskTitleHandler} />
            <Button text={lang.cansel} clickHandler={() => setIsAddTaskList(false)} />
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
        className='w-full text-center text-gray-400  hover:text-gray-600 border-t p-2 hover:cursor-pointer hover:transition-all duration-200'
        onClick={editTasksHandler}
      >
        {lang.addTaskList}
      </div>

      <div className='w-full text-left font-semibold mb-2'>{lang.tags}:</div>

      {isAddTag && (
        <Popover clickOut={() => setIsAddTag(false)}>
          <div className='w-full text-center mt-4 font-semibold'>
            <div className='w-full text-center font-bold mb-6'>{titleTagWindow}</div>
            <div className='w-full text-left font-semibold mb-2'>{lang.tagText}:</div>
            <div className='flex items-center'>
              <div className='w-[50%]'>
                <Input
                  inputRef={tagTextRef}
                  value={newTagText}
                  onChangeHandler={onChangeTagTextHandler}
                  onBlurHandler={saveTagHandler}
                />
              </div>
              <div className='w-[50%] item-center'>
                <div className={`flex inline-flex mb-3 mr-2 border w-fit px-3 rounded-xl ${newTagColor}`}>
                  #{`${newTagText}`}
                </div>
              </div>
            </div>
          </div>

          <div className='w-full text-left font-semibold mb-2'>{lang.tagColor}:</div>
          
          <div className='flex flex-wrap justify-start mb-4 w-fit px-2 rounded-xl'>
          
          {Colors && Colors.map((bgColor) => {
            return <div key={bgColor} 
              className={`flex justify-center mb-2 mr-2 border w-fit px-3 rounded-xl hover:cursor-pointer hover:border-gray-500 ${bgColor}`}
              onClick={() => selectTagColorHandler(bgColor)}
            >
              #{lang.tag}
            </div>
          })}
          </div>

          <div className='flex mb-2'>
            <Button text={lang.save} clickHandler={saveTagHandler} />
            <Button text={lang.cansel} clickHandler={() => setIsAddTag(false)} />
          </div>
        </Popover>
      )}

      <Tags tags={card.tags} openModalHandler={changeTagHandler} deleteTagHandler={deleteTagHandler} />

      <div
        className='w-full text-center text-gray-400  hover:text-gray-600 border-t mt-2 p-2 hover:cursor-pointer hover:transition-all duration-200'
        onClick={editTagHandler}
      >
        {lang.addTag}
      </div>
    </Popover>
  )
}