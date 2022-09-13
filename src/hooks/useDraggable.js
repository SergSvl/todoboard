import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { initState, setSortedCards, addCard, addDivider } from "@/store/main/mainSlice";
import { deleteCardFromBoard, sortElements } from "@/utils/helpers/card-board-helpers";

const useDraggable = () => {
  const dispatch = useDispatch();
  const { boards } = useSelector((state) => state.main);

  const onDragStart = (event, dragElement, boardId = undefined) => {

    // console.log('Start')
    // console.log("Drag event:", event);
    // console.log("Drag event.target:", event.target);
    
    event.stopPropagation();
    // event.target.style.position = "absolute";

    console.log("---------------------");
    // console.log("DRAG Element:", dragElement);
    // console.log("DRAG boardId:", boardId);
    // console.log("DRAG Element.id:", dragElement.id);
    // console.log("Drag Element.order:", dragElement.order);
    // console.log("Drag event.target:", event.target);
    
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

    // console.log("---------------------");
    // console.log("DROP Element:", dropElement);
    // console.log("DROP boardId:", boardId);
    // console.log("DROP cardOrder:", cardOrder);
    // console.log("DROP dragElementType:", dragElementType);
    
    if (cardOrder !== undefined && dragElementType !== "group" && dragElementType !== "card" && dropElement === 'dropZone') {
      // console.log("DROP cardOrder:", cardOrder);
      dispatch(addDivider({ boardId, cardOrder }));
    } else {
      const dragElementId = event.dataTransfer.getData("dragElementId");
      // console.log("DRAG ElementId:", dragElementId);
      // console.log("DRAG parentBoardId:", parentBoardId);

      if (!dragElementId || dragElementId === 'divider') {
        return;
      }

      const dragElement = JSON.parse(event.dataTransfer.getData("dragElement"));
      const dragElementOrder = event.dataTransfer.getData("dragElementOrder");
      const dropElementType = dropElement.hasOwnProperty("cards")
        ? "group"
        : "card";

      // console.log("IF dragElementType === 'card' && dropElementType !== 'group' && (parentBoardId !== boardId ("+boardId+") || dropElement === 'divider')):", dragElementType === "card" && dropElementType !== "group" && (parentBoardId !== boardId || dropElement === "divider"));

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
        // console.log("Выход");
        return;
      }

      if (
        dragElementType === "card" &&
        dropElementType === "group" &&
        parentBoardId !== dropElement.id
      ) {
        // console.log("DROP Element:", dropElement);
        // console.log("allElements:", allElements);
        // console.log("DRAG Element Id:", dragElementId);
        // console.log("DROP Element Id:", dropElement.id);
        // console.log("parentBoardId:", parentBoardId);
        // console.log("DROP boardId:", boardId);

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
