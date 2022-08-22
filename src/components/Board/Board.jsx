import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from '@/components/Card';
import Delete from '@/assets/icons/close.svg';
import Popover from '@/components/Popover';
import { setTitleBoard } from "@/store/main/mainSlice";
import useDraggable from '@/hooks/useDraggable';

export const Board = ({ board, deleteBoard, changeBoards }) => {
  const [isConfirmOpenned, setIsConfirmOpenned] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { boards } = useSelector((state) => state.main);
  const { onDragStart, onDragOver, onDragLeave, onDragEnd, onDrop } = useDraggable();
  const dispatch = useDispatch();
  const titleInputRef = useRef();

  const clickOutHandler = () => {
    setIsConfirmOpenned(false);
    setIsEditTitle(false);

    if (newTitle !== board.title) {
      dispatch(setTitleBoard({ id: board.id, newTitle }));
    }
  }

  const onDeleteGroup = (id) => {
    deleteBoard(id);
    setIsConfirmOpenned(false);
  }

  const onDeleteHandler = (e) => {
    e.stopPropagation();
    setIsConfirmOpenned(true);
  }

  const onEditTitleHandler = (e) => {
    e.stopPropagation();
    console.log("onEditTitleHandler e:", e);
    setIsEditTitle(true);
    
  }

  const onChangeTitleHandler = (title) => {
    console.log("onChangeTitleHandler::", title);
    setNewTitle(title);
  }

  useEffect(() => {
    if (isEditTitle) {
      titleInputRef.current.focus();
    } 
  }, [isEditTitle]);

  useEffect(() => {
    setNewTitle(board.title);
  }, []);

  return (
    <>
      {isConfirmOpenned && (
        <Popover clickOut={clickOutHandler}>
          <div className='w-full text-center mb-4 font-semibold'>Удалить группу с карточками?</div>
          <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={() => onDeleteGroup(board.id)}>Да</button>
          <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={clickOutHandler}>Нет</button>
        </Popover>
      )}

      {board && (
        <div className="w-full h-fit bg-white mb-4 min-h-[12rem] text-center border rounded-md"
          id={board.id}
          onClick={(e) => clickOutHandler(e)}
          draggable={true}
          onDragStart={(e) => onDragStart(e, board)}
          onDragLeave={(e) => onDragLeave(e)}
          onDragOver={(e) => onDragOver(e)}
          onDragEnd={(e) => onDragEnd(e)}
          onDrop={(e) => onDrop(e, board, boards)}
        >
          <div className='flex justify-beetwen border-b mb-2'>
            {isEditTitle ? (
              <input className='w-full border rounded-md h-8 px-2 mb-0'
                ref={titleInputRef}
                value={newTitle}
                onChange={(e) => onChangeTitleHandler(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className='w-full h-8 text-left pt-1 pl-2 font-semibold'
                onClick={(e) => onEditTitleHandler(e)}
              >{board.title}</div>
            )}
            <div className='h-7 hover:cursor-pointer px-2 -border m-auto pt-2' 
               title='Удалить группу'
               onClick={(e) => onDeleteHandler(e)}
            >
              <img src={Delete} className="" width="12" alt="delete" />
            </div>
          </div>

          {board.cards.length && (
            board.cards.map((card) => {
              return <Card key={card.title} />
            })
          )}
        </div>
      )}
    </>
  )
}