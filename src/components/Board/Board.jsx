import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from '@/components/Card';
import Popover from '@/components/Popover';
import { initState, setTitleBoard, addCard } from "@/store/main/mainSlice";
import useDraggable from '@/hooks/useDraggable';
import useHorizontalScroll from '@/hooks/useHorizontalScroll';

export const Board = ({ board, deleteBoard }) => {
  const [isConfirmOpenned, setIsConfirmOpenned] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { boards } = useSelector((state) => state.main);
  const { onDragStart, onDragOver, onDragLeave, onDragEnd, onDrop } = useDraggable();
  const dispatch = useDispatch();
  const titleInputRef = useRef();
  const scrollRef = useHorizontalScroll();

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
    setIsEditTitle(true);
  }

  const onChangeTitleHandler = (title) => {
    setNewTitle(title);
  }

  const addCardHandler = (event, boardId) => {
    dispatch(addCard({ id: boardId }));
  }

  useEffect(() => {
    if (isEditTitle) {
      titleInputRef.current.focus();
    } 
  }, [isEditTitle]);

  useEffect(() => {
    setNewTitle(board.title);
  }, []);

  const deleteCard = (boardId, cardId) => {
    const filteredBoard = boards.map((board) => {
      const newBoard = {...board};
      const newCards = newBoard.cards.filter((card) => {
        return card.id !== cardId ? true : false;
      });
      newBoard.cards = newCards;
      // console.log("newCards::", newCards);
      let counter = 1;

      const orderedBoard = newBoard.cards.map((board) => {
        const orderBoard = {...board};
        orderBoard.order = ''+counter++;
        return orderBoard;
      });
      newBoard.cards = orderedBoard;
      return newBoard;
    });
    // console.log("boards::", boards);
    // console.log("filteredBoard::", filteredBoard);
    
    dispatch(initState([...filteredBoard]));
  }

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
        <div className="w-full h-fit -bg-white bg-gray-200 mb-6 min-h-[12rem] relative text-center border rounded"
          id={board.id}
          onClick={(e) => clickOutHandler(e)}
          draggable={true}
          onDragStart={(e) => onDragStart(e, board)}
          onDragLeave={(e) => onDragLeave(e)}
          onDragOver={(e) => onDragOver(e)}
          onDragEnd={(e) => onDragEnd(e)}
          onDrop={(e) => onDrop(e, board, boards)}
        >
          <div className='flex justify-beetwen mb-1'>
            {isEditTitle ? (
              <input className='w-full border rounded-md h-8 px-2 mb-0'
                ref={titleInputRef}
                value={newTitle}
                onChange={(e) => onChangeTitleHandler(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => clickOutHandler(e)}
              />
            ) : (
              <div className='w-full h-8 -text-left pt-1 pl-2 font-semibold hover:cursor-pointer'
                onClick={(e) => onEditTitleHandler(e)}
              >{board.title}</div>
            )}
            
          </div>

          <div ref={scrollRef} className='flex overflow-hidden -border border-red-600'>
            {board.cards.length > 0 ? (
              board.cards.map((card) => {
                return <Card key={card.id} card={card} cards={board.cards} boardId={board.id} deleteCard={deleteCard}/>
              })
            ) : null}
          </div>

          <div className='w-full h-8 -border border-red-400 absolute bottom-0 flex justify-between'>
            <div className='-border border-blue-400 flex flex-nowrap items-center hover:text-gray-500 hover:cursor-pointer text-gray-400 px-1' onClick={(e) => addCardHandler(e, board.id)}>
              <div className='w-[1rem] -border border-red-400 font-thin text-xl px-0'>+</div><div className='text-base -border border-red-400 pl-1'>Добавить карточку</div>
            </div>

            <div className='-border border-blue-400 flex flex-nowrap items-center hover:text-gray-500 hover:cursor-pointer text-gray-400 px-1' onClick={(e) => onDeleteHandler(e, board.id)}>
              <div className='w-[1rem] -border border-red-400 font-thin text-xl px-0 rotate-45'>+</div><div className='text-base -border border-red-400 pl-1'>Удалить группу</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}