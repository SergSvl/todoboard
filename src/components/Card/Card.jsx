import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitleCard, setDescriptionCard } from "@/store/main/mainSlice";
import Popover from '@/components/Popover';
import Confirm from '@/components/Confirm';
import useDraggable from '@/hooks/useDraggable';

export const Card = ({ card, cards, boardId, deleteCard }) => {
  const { onDragStart, onDragOver, onDragLeave, onDragEnd, onDrop } = useDraggable();
  const [isEditTitleOut, setIsEditTitleOut] = useState(false);
  const [isEditTitleIn, setIsEditTitleIn] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const titleInputOutRef = useRef();
  const titleInputInRef = useRef();
  const [isConfirmOpenned, setIsConfirmOpenned] = useState(false);
  const [isCardOpenned, setIsCardOpenned] = useState(false);
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const textareaRows = descriptionText.split("\n").length;
  // const { boards } = useSelector((state) => state.main);
  const dispatch = useDispatch();

  useEffect(() => {
    setNewTitle(card.title);
    setDescriptionText(card.description);
  }, []);

  useEffect(() => {
    if (isEditTitleOut) {
      titleInputOutRef.current.focus();
    }

    if (isEditTitleIn) {
      titleInputInRef.current.focus();
    }
  }, [isEditTitleOut, isEditTitleIn]);

  const onChangeTitleHandler = (title) => {
    setNewTitle(title);
  }

  const onEditTitleHandler = (e, type = 'outer') => {
    e.stopPropagation();
    if (type === 'inner') {
      setIsEditTitleIn(true);
    } else {
      setIsEditTitleOut(true);
    }
  }

  const onDeleteHandler = (e) => {
    e.stopPropagation();
    setIsConfirmOpenned(true);
  }

  const clickOutHandler = (e, type = '') => {
    e.stopPropagation();
    setIsConfirmOpenned(false);
    setIsEditTitleOut(false);
    setIsEditTitleIn(false);
    if (type !== 'inner') {
      setIsCardOpenned(false);
    }
    setIsEditDescription(false);

    if (newTitle !== card.title) {
      dispatch(setTitleCard({ cardId: card.id, boardId, newTitle }));
    }
  }

  const openCardHandler = (e, card) => {
    console.log("openCardHandler::", card);
    e.stopPropagation();
    setIsCardOpenned(true);
  }

  const saveDescriptionHandler = () => {
    setIsEditDescription(false);
    dispatch(setDescriptionCard({ cardId: card.id, boardId, descriptionText }));
  }

  const cancelDescriptionHandler = () => {
    setIsEditDescription(false);
  }

  const editDescriptionHandler = () => {
    setIsEditDescription(true);
  }

  const onDeleteCard = (cardId) => {
    deleteCard(boardId, cardId);
    setIsConfirmOpenned(false);
  }

  return (
    <>
      {isConfirmOpenned && (
        <Confirm
          title={'Удалить карточку?'}
          yesHandler={() => onDeleteCard(card.id)}
          noHandler={clickOutHandler}
        />
      )}

      {isCardOpenned && (
        <Popover clickOut={clickOutHandler}>
          {isEditTitleIn ? (
            <input className='w-full border rounded-md h-6 px-2 mb-4'
              ref={titleInputInRef}
              value={newTitle}
              onChange={(e) => onChangeTitleHandler(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => clickOutHandler(e, 'inner')}
            />
          ) : (
            <div className='w-full text-center mb-4 font-semibold hover:cursor-pointer'
              onClick={(e) => onEditTitleHandler(e, 'inner')}
            >{card.title}</div>
          )}
          
          <div className='w-full text-left _mb-4 font-semibold'>Описание:</div>

          {isEditDescription ? (
            <>
              <textarea className='w-full h-fit text-left mb-4 border border-2 border-sky-400 rounded p-2'
                rows={textareaRows}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
              ></textarea>
              <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={saveDescriptionHandler}>Сохранить</button>
              <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={cancelDescriptionHandler}>Отменить</button>
            </>
          ) : (
            card.description === ''
              ? <div className='w-full text-center text-gray-400  hover:text-gray-600 border p-2 hover:cursor-pointer'
                  onClick={editDescriptionHandler}
                >Добавить описание</div>
              : <div className='w-full text-left p-3 mb-4 overflow-x-hidden whitespace-pre-wrap'
                  onClick={editDescriptionHandler}
                >{card.description}</div>
          )}
        </Popover>
      )}
    
      <div className="w-[300px] h-[80px] p-2 shrink-0 relative bg-slate-50 border rounded ml-2 my-1 bg-white hover:bg-gray-50 shadow -hover:cursor-pointer"
        onClick={(e) => clickOutHandler(e)}
        draggable={true}
        onDragStart={(e) => onDragStart(e, card)}
        onDragLeave={(e) => onDragLeave(e)}
        onDragOver={(e) => onDragOver(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDrop={(e) => onDrop(e, card, cards, boardId)}
      >
        <div className='flex justify-beetwen mb-1'>
          {isEditTitleOut ? (
            <input className='w-full border rounded-md h-6 px-2 mb-0'
              ref={titleInputOutRef}
              value={newTitle}
              onChange={(e) => onChangeTitleHandler(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => clickOutHandler(e)}
            />
          ) : (
            <div className='w-full h-6 text-left pl-2 hover:cursor-pointer'
              onClick={(e) => onEditTitleHandler(e)}
            >{card.title}</div>
          )}
          {!isEditTitleOut ? (
            <div className='h-7 hover:cursor-pointer -border' 
                title='Удалить карточку'
                onClick={(e) => onDeleteHandler(e)}
            >
              <div className='w-[1rem] font-thin text-3xl text-gray-400 hover:text-gray-500 -mt-3 rotate-45'>+</div>
            </div>
          ) : null}
        </div>

        <div className='w-full h-8 -border border-red-400 absolute flex justify-end right-2 bottom-2'>
          <div className='h-7 hover:cursor-pointer -border'
            title='Открыть карточку'
            onClick={(e) => openCardHandler(e, card)}
          >
            <div className='w-[1rem] font-thin text-sm text-gray-400 hover:text-gray-500 rotate-90'>&#9998;</div>
          </div>
        </div>
      </div>
    </>
  )
}