import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/Card";
import Confirm from "@/components/Confirm";
import Input from "@/components/Input";
import { initState, setTitleBoard, addCard } from "@/store/main/mainSlice";
import useDraggable from "@/hooks/useDraggable";
import useHorizontalScroll from "@/hooks/useHorizontalScroll";
import { deleteCardFromBoard } from "@/utils/helpers/card-board-helpers";
import lang from '@/locales/ru/common.json';

export const Board = ({ board, deleteBoard }) => {
  const [isConfirmOpenned, setIsConfirmOpenned] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isDraggable, setIsDraggable] = useState(true);
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
  };

  const onDeleteGroup = () => {
    deleteBoard(board.id);
    setIsConfirmOpenned(false);
  };

  const onDeleteHandler = (e) => {
    e.stopPropagation();
    setIsConfirmOpenned(true);
  };

  const onEditTitleHandler = (e) => {
    e.stopPropagation();
    setIsEditTitle(true);
  };

  const onChangeTitleHandler = (title) => {
    setNewTitle(title);
  };

  const addCardHandler = (event, boardId) => {
    dispatch(addCard({ id: boardId }));
  };

  useEffect(() => {
    if (isEditTitle) {
      setIsDraggable(false);
      titleInputRef.current.focus();
    }
  }, [isEditTitle]);

  useEffect(() => {
    setNewTitle(board.title);
  }, []);

  const deleteCard = (boardId, cardProps) => {
    const filteredBoards = deleteCardFromBoard(boards, boardId, cardProps);
    dispatch(initState([...filteredBoards]));
  };

  return (
    <>
      {isConfirmOpenned && (
        <Confirm
          title={lang.questionRemoveGroupWithCards}
          yesHandler={onDeleteGroup}
          noHandler={clickOutHandler}
        />
      )}

      {board && (
        <div
          className='w-full h-fit text-slate-700 bg-gray-200 mb-6 min-h-[12rem] relative text-center border rounded'
          id={board.id}
          onClick={(e) => clickOutHandler(e)}
          draggable={isDraggable}
          onDragStart={(e) => onDragStart(e, board)}
          onDragLeave={(e) => onDragLeave(e)}
          onDragOver={(e) => onDragOver(e)}
          onDragEnd={(e) => onDragEnd(e)}
          onDrop={(e) => onDrop(e, board, boards)}
        >
          <div className='flex justify-beetwen mb-1 hover:transition-all duration-200 hover:bg-slate-200'>
            {isEditTitle ? (
                <Input
                  inputRef={titleInputRef}
                  value={newTitle}
                  onChangeHandler={onChangeTitleHandler}
                  onBlurHandler={clickOutHandler}
                />
            ) : (
              <div
                className='w-full h-8 pt-1 pl-2 font-semibold hover:cursor-pointer -text-slate-700'
                title={lang.editTitle}
                onClick={(e) => onEditTitleHandler(e)}
              >
                {board.title}
              </div>
            )}
          </div>

          <div
            ref={scrollRef}
            className='flex overflow-hidden -border border-red-600'
          >
            {board.cards.length > 0
              ? board.cards.map((card) => {
                  return (
                    <Card
                      key={card.id}
                      card={card}
                      cards={board.cards}
                      boardId={board.id}
                      deleteCard={deleteCard}
                      setIsDraggableBoard={setIsDraggable}
                    />
                  );
                })
              : null}
          </div>

          <div className='w-full h-8 -border border-red-400 absolute bottom-0 flex justify-between'>
            <div
              className='-border border-blue-400 flex flex-nowrap items-center hover:text-gray-500 hover:cursor-pointer text-gray-400 px-1'
              onClick={(e) => addCardHandler(e, board.id)}
            >
              <div className='w-[1rem] -border border-red-400 font-thin text-xl px-0 hover:transition-all duration-200'>
                +
              </div>
              <div className='text-base -border border-red-400 pl-1 hover:transition-all duration-200'>
                {lang.addCard}
              </div>
            </div>

            <div
              className='-border border-blue-400 flex flex-nowrap items-center hover:text-gray-500 hover:cursor-pointer text-gray-400 px-1'
              title={lang.addCardDivider}
              draggable={true}
              onDragStart={(e) => onDragStart(e, 'divider', board.id)}
              onDragLeave={(e) => onDragLeave(e)}
              onDragOver={(e) => onDragOver(e)}
            >
              <div className='w-[2rem] pb-1 -border border-red-400 text-2xl hover:font-bold hover:transition-all duration-200'>
                |
              </div>
            </div>

            <div
              className='-border border-blue-400 flex flex-nowrap items-center hover:text-gray-500 hover:cursor-pointer text-gray-400 px-1'
              onClick={(e) => onDeleteHandler(e, board.id)}
            >
              <div className='w-[1rem] -border border-red-400 font-thin text-xl px-0 rotate-45 hover:transition-all duration-200'>
                +
              </div>
              <div className='text-base -border border-red-400 pl-1 hover:transition-all duration-200'>
                {lang.removeGroup}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
