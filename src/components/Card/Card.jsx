import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setTitleCard } from "@/store/main/mainSlice";
import Popover from '@/components/Popover';
import useDraggable from '@/hooks/useDraggable';

export const Card = ({ card, cards, boardId, deleteCard }) => {
  const { onDragStart, onDragOver, onDragLeave, onDragEnd, onDrop } = useDraggable();
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const titleInputRef = useRef();
  const [isConfirmOpenned, setIsConfirmOpenned] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setNewTitle(card.title);
  }, []);

  useEffect(() => {
    if (isEditTitle) {
      titleInputRef.current.focus();
    } 
  }, [isEditTitle]);

  const onChangeTitleHandler = (title) => {
    setNewTitle(title);
  }

  const onEditTitleHandler = (e) => {
    e.stopPropagation();
    setIsEditTitle(true);
  }

  const onDeleteHandler = (e) => {
    e.stopPropagation();
    setIsConfirmOpenned(true);
  }

  const clickOutHandler = () => {
    setIsConfirmOpenned(false);
    setIsEditTitle(false);

    if (newTitle !== card.title) {
      dispatch(setTitleCard({ cardId: card.id, boardId, newTitle }));
    }
  }

  const onDeleteCard = (cardId) => {
    deleteCard(boardId, cardId);
    setIsConfirmOpenned(false);
  }

  return (
    <>
      {isConfirmOpenned && (
        <Popover clickOut={clickOutHandler}>
          <div className='w-full text-center mb-4 font-semibold'>Удалить карточку?</div>
          <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={() => onDeleteCard(card.id)}>Да</button>
          <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={clickOutHandler}>Нет</button>
        </Popover>
      )}
    
      <div className="w-[300px] h-[100px] p-2 shrink-0 border rounded ml-2 my-1 bg-white hover:bg-gray-50 shadow"
        onClick={(e) => clickOutHandler(e)}
        draggable={true}
        onDragStart={(e) => onDragStart(e, card)}
        onDragLeave={(e) => onDragLeave(e)}
        onDragOver={(e) => onDragOver(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDrop={(e) => onDrop(e, card, cards)}
      >
        <div className='flex justify-beetwen mb-1'>
          {isEditTitle ? (
            <input className='w-full border rounded-md h-6 px-2 mb-0'
              ref={titleInputRef}
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
          {!isEditTitle ? (
            <div className='h-7 hover:cursor-pointer -border' 
                title='Удалить карточку'
                onClick={(e) => onDeleteHandler(e)}
            >
              <div className='w-[1rem] font-thin text-3xl text-gray-400 hover:text-gray-500 -mt-3 rotate-45'>+</div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}