import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setTitleCard } from "@/store/main/mainSlice";
import Confirm from "@/components/Confirm";
import Input from "@/components/Input";
import useDraggable from "@/hooks/useDraggable";
import Detailed from '@/components/Card/Detailed';

export const Card = ({ card, cards, boardId, deleteCard }) => {
  const { onDragStart, onDragOver, onDragLeave, onDragEnd, onDrop } = useDraggable();
  const [isEditTitleOut, setIsEditTitleOut] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const titleCardRef = useRef();
  const [isConfirmOpenned, setIsConfirmOpenned] = useState(false);
  const [isCardOpenned, setIsCardOpenned] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setNewTitle(card.title);
  }, [card]);

  useEffect(() => {
    if (isEditTitleOut) {
      titleCardRef.current.focus();
    }
  }, [isEditTitleOut]);

  const onChangeTitleHandler = (title) => {
    setNewTitle(title);
  };

  const onEditTitleHandler = (e) => {
    e.stopPropagation();
    setIsEditTitleOut(true);
  };

  const onDeleteHandler = (e) => {
    e.stopPropagation();
    setIsConfirmOpenned(true);
  };

  const clickOutHandler = (e) => {
    e.stopPropagation();
    setIsConfirmOpenned(false);
    setIsEditTitleOut(false);

    // console.log("Card newTitle::", newTitle);
    // console.log("card.title::", card.title);

    if (newTitle !== card.title) {
      dispatch(setTitleCard({ cardId: card.id, boardId, cardTitle: newTitle }));
    }
  };

  const openCardHandler = (e, card) => {
    e.stopPropagation();
    setIsCardOpenned(true);
  };

  const onDeleteCard = (cardId) => {
    deleteCard(boardId, cardId);
    setIsConfirmOpenned(false);
  };

  return (
    <>
      {isConfirmOpenned && (
        <Confirm
          title={"Удалить карточку?"}
          yesHandler={() => onDeleteCard(card.id)}
          noHandler={clickOutHandler}
        />
      )}

      {isCardOpenned && (
        <Detailed card={card} boardId={boardId} setIsCardOpenned={setIsCardOpenned}/>
      )}

      <div
        className='w-[300px] min-h-[80px] p-2 shrink-0 relative bg-slate-50 border rounded ml-2 my-1 bg-white hover:bg-gray-50 shadow'
        onClick={(e) => clickOutHandler(e)}
        draggable={true}
        onDragStart={(e) => onDragStart(e, card, boardId)}
        onDragLeave={(e) => onDragLeave(e)}
        onDragOver={(e) => onDragOver(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDrop={(e) => onDrop(e, card, cards, boardId)}
      >
        <div className='flex justify-beetwen mb-1'>
          {isEditTitleOut ? (
            <Input
              inputRef={titleCardRef}
              value={newTitle}
              onChangeHandler={onChangeTitleHandler}
              onBlurHandler={clickOutHandler}
            />
          ) : (
            <div
              className='w-full mr-2 text-left pl-2 hover:cursor-pointer whitespace-pre-wrap break-all -border border-red-600'
              onClick={(e) => onEditTitleHandler(e)}
            >
              {card.title}
            </div>
          )}
          {!isEditTitleOut ? (
            <div
              className='h-7 hover:cursor-pointer'
              title='Удалить карточку'
              onClick={(e) => onDeleteHandler(e)}
            >
              <div className='w-[1rem] font-thin text-3xl text-gray-400 hover:text-gray-500 -mt-3 rotate-45'>
                +
              </div>
            </div>
          ) : null}
        </div>

        <div className='w-full h-8 -border border-red-400 absolute flex justify-end right-2 bottom-2'>
          <div
            className='h-7 hover:cursor-pointer -border'
            title='Открыть карточку'
            onClick={(e) => openCardHandler(e, card)}
          >
            <div className='w-[1rem] font-thin text-sm text-gray-400 hover:text-gray-500 rotate-90'>
              &#9998;
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
