import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setTitleCard, removeTag } from "@/store/main/mainSlice";
import Confirm from "@/components/Confirm";
import Input from "@/components/Input";
import useDraggable from "@/hooks/useDraggable";
import Detailed from "@/components/Card/Detailed";
import Tags from "@/components/Card/Tags";
import lang from "@/locales/ru/common.json";
import Divider from "@/components/Card/Divider";
import Draggable from '@/components/Draggable';

export const Card = ({
  card,
  cards,
  boardId,
  deleteCard,
  setIsDraggableBoard
}) => {
  const { onDragStart, onDragOver, onDragLeave, onDragEnd, onDrop } =
    useDraggable();
  const [isEditTitleOut, setIsEditTitleOut] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const titleCardRef = useRef();
  const [isConfirmOpenned, setIsConfirmOpenned] = useState(false);
  const [isCardOpenned, setIsCardOpenned] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setNewTitle(card.title);
  }, [card]);

  useEffect(() => {
    if (isEditTitleOut) {
      setIsDraggable(false);
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
    setIsDraggable(false);
    setIsDraggableBoard(false);
    setIsConfirmOpenned(true);
  };

  const clickOutHandler = (e) => {
    e.stopPropagation();
    setIsConfirmOpenned(false);
    setIsEditTitleOut(false);
    setIsDraggable(true);
    setIsDraggableBoard(true);

    if (newTitle !== card.title) {
      dispatch(setTitleCard({ cardId: card.id, boardId, cardTitle: newTitle }));
    }
  };

  const openCardHandler = (e) => {
    e.stopPropagation();
    setIsDraggable(false);
    setIsDraggableBoard(false);
    setIsCardOpenned(true);
  };

  const onDeleteCard = (cardProps) => {
    deleteCard(boardId, cardProps);
    setIsConfirmOpenned(false);
    setIsDraggable(true);
    setIsDraggableBoard(true);
  };

  const deleteTagHandler = (tagId) => {
    dispatch(removeTag({ boardId, cardId: card.id, tagId }));
  };

  return (
    <>
      {isConfirmOpenned && (
        <Confirm
          title={lang.questionRemoveCard}
          yesHandler={() => onDeleteCard({ cardId: card.id, cardOrder: card.order, cardDivided: card.divided })}
          noHandler={clickOutHandler}
        />
      )}

      {isCardOpenned && (
        <Detailed
          card={card}
          boardId={boardId}
          setIsCardOpenned={setIsCardOpenned}
          setIsDraggableBoard={setIsDraggableBoard}
        />
      )}

      {card.divider ? (
        <Divider
          divider={card.divider}
          cardOrder={card.order}
          boardId={boardId}
        />
      ) : (
        <>
          {/* <Draggable> */}
            <div
              className='w-[300px] min-h-[80px] p-2 mb-8 flex flex-wrap items-stretch shrink-0 grow-0 items-end relative bg-slate-50 border rounded my-1 bg-white hover:bg-gray-50 shadow hover:transition-all duration-200'
              id='card-to-drag'
              onClick={(e) => clickOutHandler(e)}
              // draggable={isDraggable}
              onDragStart={(e) => onDragStart(e, card, boardId)}
              onDragLeave={(e) => onDragLeave(e)}
              onDragOver={(e) => onDragOver(e)}
              onDragEnd={(e) => onDragEnd(e)}
              onDrop={(e) => onDrop(e, card, cards, boardId)}
            >
              <div className='flex justify-beetwen grow mb-1'>
                {isEditTitleOut ? (
                  <Input
                    inputRef={titleCardRef}
                    value={newTitle}
                    onChangeHandler={onChangeTitleHandler}
                    onBlurHandler={clickOutHandler}
                  />
                ) : (
                  <div
                    className='w-full mr-2 text-left pl-2 hover:cursor-pointer whitespace-pre-wrap break-all -border border-red-600 hover:transition-all duration-200 hover:bg-slate-100'
                    title={lang.editTitle}
                    onClick={(e) => onEditTitleHandler(e)}
                  >
                    {card.title}
                  </div>
                )}
                {!isEditTitleOut ? (
                  <div
                    className='h-7 hover:cursor-pointer'
                    title={lang.removeCard}
                    onClick={(e) => onDeleteHandler(e)}
                  >
                    <div className='w-[1rem] h-[1rem] p-0 -mt-1 -mr-1 leading-[1rem] font-thin text-3xl text-gray-400 -border border-red-400  hover:text-gray-500 -mt-3 rotate-45 hover:transition-all duration-200 select-none'>
                      +
                    </div>
                  </div>
                ) : null}
              </div>

              <div className='w-full -border border-red-400 flex justify-end items-end right-0 bottom-0'>
                <Tags
                  tags={card.tags}
                  openModalHandler={null}
                  deleteTagHandler={deleteTagHandler}
                />
                <div
                  className='h-7 hover:cursor-pointer -border select-none'
                  title={lang.openCard}
                  onClick={(e) => openCardHandler(e)}
                >
                  <div className='w-[1rem] font-thin text-sm text-gray-400 hover:text-gray-500 rotate-90 hover:transition-all duration-200'>
                    &#9998;
                  </div>
                </div>
              </div>
            </div>
          {/* </Draggable> */}

          {!card.divided && (
            <Divider
              divider={undefined}
              cardOrder={card.order}
              boardId={boardId}
            />
          )}
        </>
      )}
    </>
  );
};
