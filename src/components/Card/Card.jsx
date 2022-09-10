import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addTitleCard, removeTag } from "@/store/main/mainSlice";
import Confirm from "@/components/Confirm";
import Input from "@/components/Input";
import Detailed from "@/components/Card/Detailed";
import Tags from "@/components/Card/Tags";
import lang from "@/locales/ru/common.json";
import Divider from "@/components/Card/Divider";

export const Card = ({
  card,
  boardId,
  deleteCard,
}) => {
  const dispatch = useDispatch();
  const [isEditTitleOut, setIsEditTitleOut] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const titleCardRef = useRef();
  const [isConfirmOpenned, setIsConfirmOpenned] = useState(false);
  const [isCardOpenned, setIsCardOpenned] = useState(false);

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

    if (newTitle !== card.title) {
      dispatch(addTitleCard({ cardId: card.id, boardId, cardTitle: newTitle }));
    }
  };

  const openCardHandler = (e) => {
    e.stopPropagation();
    setIsCardOpenned(true);
  };

  const onDeleteCard = (cardProps) => {
    deleteCard(boardId, cardProps);
    setIsConfirmOpenned(false);
  };

  const deleteTagHandler = (tagId) => {
    dispatch(removeTag({ boardId, cardId: card.id, tagId }));
  };

  return (
    <>
      {isConfirmOpenned && (
        <Confirm
          title={lang.questionRemoveCard}
          yesHandler={() =>
            onDeleteCard({
              cardId: card.id,
              cardOrder: card.order,
              cardDivided: card.divided
            })
          }
          noHandler={clickOutHandler}
        />
      )}

      {isCardOpenned && (
        <Detailed
          card={card}
          boardId={boardId}
          setIsCardOpenned={setIsCardOpenned}
        />
      )}

      {card.divider ? (
        <Divider
          divider={card.divider}
          cardOrder={card.order}
          boardId={boardId}
        />
      ) : (
        card && card.id !== "card#phantom" ? (
          <>
            <div
              className='w-[300px] min-h-[80px] px-2 pt-3 mb-8 flex flex-wrap items-stretch shrink-0 grow-0 items-end relative rounded my-1 bg-white hover:bg-gray-50 shadow hover:transition-all duration-200'
              id='card-to-drag'
              data-board-id={boardId}
              data-id={card.id}
              data-divided={card.divided}
              data-order={card.order}
              data-type={"card"}
              onClick={(e) => clickOutHandler(e)}
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
                    className='w-full mr-2 text-left pl-2 hover:cursor-pointer whitespace-pre-wrap break-all -border border-red-600 hover:transition-all duration-200 hover:bg-slate-100 select-none'
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

            {!card.divided && (
              <Divider
                divider={undefined}
                cardOrder={card.order}
                boardId={boardId}
              />
            )}
          </>
        ) : (
          <>
            <div
              className='w-[300px] min-h-[80px] pt-3 mb-8 _mx-0 relative bg-gray-400/30 border rounded my-1 shadow transition-all duration-700'
              data-board-id={boardId}
              data-id={card.id}
              data-order={card.order}
              data-type={"card"}
            ></div>
            {!card.divided && (
              <Divider
                divider={undefined}
                cardOrder={card.order}
                boardId={boardId}
              />
            )}
          </>
        )
      )}
    </>
  );
};
