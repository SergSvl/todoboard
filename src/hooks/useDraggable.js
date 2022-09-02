import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { initState, setSortedCards, addCard, addDivider } from "@/store/main/mainSlice";
import { deleteCardFromBoard, sortElements } from "@/utils/helpers/card-board-helpers";

const useDraggable = () => {
  const dispatch = useDispatch();
  const { boards } = useSelector((state) => state.main);

  const onDragStart = (event, dragElement, boardId = undefined) => {
    event.stopPropagation();
    
    if (dragElement !== 'divider') {
      event.dataTransfer.setData("dragElement", JSON.stringify(dragElement));
      event.dataTransfer.setData("dragElementId", dragElement.id);
      event.dataTransfer.setData("parentBoardId", boardId);

      if (dragElement.hasOwnProperty("cards")) {
        event.dataTransfer.setData("dragElementType", "group");
      } else {
        event.dataTransfer.setData("dragElementType", "card");
      }
      event.dataTransfer.setData("dragElementOrder", dragElement.order);
    } else {
      event.dataTransfer.setData("dragElement", dragElement);
      event.dataTransfer.setData("parentBoardId", boardId);
    }

    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.target.style.background = "#f3f4f6";
  };

  const onDragLeave = (event) => {
    event.target.style.background = "";
  };

  const onDragEnd = (event) => {};

  const onDrop = (event, dropElement, allElements, boardId = undefined, cardOrder = undefined) => {
    event.stopPropagation();
    event.target.style.background = "";

    const dragElementType = event.dataTransfer.getData("dragElementType");
    const parentBoardId = event.dataTransfer.getData("parentBoardId");

    if (cardOrder !== undefined && dragElementType !== "group" && dragElementType !== "card" && dropElement === 'dropZone') {
      dispatch(addDivider({ boardId, cardOrder }));
    } else {
      const dragElementId = event.dataTransfer.getData("dragElementId");

      if (!dragElementId || dragElementId === 'divider') {
        return;
      }

      const dragElement = JSON.parse(event.dataTransfer.getData("dragElement"));
      const dragElementOrder = event.dataTransfer.getData("dragElementOrder");
      const dropElementType = dropElement.hasOwnProperty("cards")
        ? "group"
        : "card";

      if (
        dragElementId === dropElement.id ||
        (dragElementType === "card" &&
          dropElementType === "group" &&
          parentBoardId === dropElement.id) ||
        (dragElementType === "card" &&
          dropElementType !== "group" &&
          (parentBoardId !== boardId || dropElement === "dropZone")) ||
          (dragElementType === "group" &&
          (dropElementType === "card" || dropElementType === "divider"))
      ) {
        return;
      }

      if (
        dragElementType === "card" &&
        dropElementType === "group" &&
        parentBoardId !== dropElement.id
      ) {
        const filteredBoards = deleteCardFromBoard(boards, parentBoardId, { cardId: dragElementId });
        dispatch(initState([...filteredBoards]));
        dispatch(addCard({ card: dragElement, id: dropElement.id }));
        return;
      }

      const changedElements = allElements.map((current) => {
        if (current.id === dropElement.id) {
          return { ...current, order: dragElementOrder, divided: dragElement.divided };
        }
        if (current.id === dragElementId) {
          return { ...current, order: dropElement.order, divided: dropElement.divided };
        }
        return current;
      });

      const sortedCards = changedElements.sort(sortElements);

      if (boardId === undefined) {
        dispatch(initState([...sortedCards]));
      } else {
        dispatch(setSortedCards({ boardId, sortedCards }));
      }
    }
  };

  return {
    onDragStart,
    onDragOver,
    onDragLeave,
    onDragEnd,
    onDrop
  };
};

export default useDraggable;
