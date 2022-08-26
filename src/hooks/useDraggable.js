import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { initState, setSortedCards, addCard } from "@/store/main/mainSlice";
import { deleteCardFromBoard } from "@/utils/helpers/card-board-helpers";

const useDraggable = () => {
  const dispatch = useDispatch();
  const { boards } = useSelector((state) => state.main);

  const onDragStart = (event, dragElement, boardId = undefined) => {
    console.log('useDraggable onDragStart')
    event.stopPropagation();
    // event.target.style.position = "absolute";

    // console.log("---------------------");
    // console.log("DRAG Element:", dragElement);
    // console.log("DRAG Element.id:", dragElement.id);
    // console.log("Drag Element.order:", dragElement.order);
    // console.log("Drag event.target:", event.target);

    event.dataTransfer.setData("dragElement", JSON.stringify(dragElement));
    event.dataTransfer.setData("dragElementId", dragElement.id);
    event.dataTransfer.setData("parentBoardId", boardId);

    if (dragElement.hasOwnProperty("cards")) {
      event.dataTransfer.setData("dragElementType", "group");
    } else {
      event.dataTransfer.setData("dragElementType", "card");
    }
    event.dataTransfer.setData("dragElementOrder", dragElement.order);
    event.dataTransfer.effectAllowed = "move";

    // console.log("DRAG Element Type:", event.dataTransfer.getData("dragElementType"));
    // event.dataTransfer.setDragImage(event.target, 50, 90);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.target.style.background = "#e5e7eb";
  };

  const onDragLeave = (event) => {
    event.target.style.background = "";
  };

  const onDragEnd = (event) => {};

  const onDrop = (event, dropElement, allElements, boardId = undefined) => {
    event.stopPropagation();
    // console.log("---------------------");
    // console.log("DROP Element:", dropElement);
    // console.log("Drop allElements:", allElements);

    const dragElement = JSON.parse(event.dataTransfer.getData("dragElement"));
    const dragElementId = event.dataTransfer.getData("dragElementId");
    const parentBoardId = event.dataTransfer.getData("parentBoardId");
    const dragElementType = event.dataTransfer.getData("dragElementType");
    const dragElementOrder = event.dataTransfer.getData("dragElementOrder");
    const dropElementType = dropElement.hasOwnProperty("cards")
      ? "group"
      : "card";

    // console.log("DRAG ElementId:", dragElementId);
    // console.log("DRAG dragElement:", dragElement);
    // console.log("DROP Element.id:", dropElement.id);

    // console.log("DRAG parentBoardId:", parentBoardId);
    // console.log("DRAG Element Type:", dragElementType);
    // console.log("DROP Element Type:", dropElementType);

    // console.log("IF:", (dragElementId === dropElement.id
    //   || (dragElementType === 'card' && dropElementType === 'group' && parentBoardId === dropElement.id)
    //   || (dragElementType === 'card' && dropElementType !== 'group' && parentBoardId !== dropElement.id)));

    // console.log("IF dragElementId === dropElement.id:", (dragElementId === dropElement.id));

    // console.log("IF dragElementType === 'card' && dropElementType === 'group' && parentBoardId === dropElement.id:", (dragElementType === 'card' && dropElementType === 'group' && parentBoardId === dropElement.id));

    // console.log("IF dragElementType === 'card' && dropElementType !== 'group' && parentBoardId !== dropElement.id:", (dragElementType === 'card' && dropElementType !== 'group' && parentBoardId !== dropElement.id));

    // console.log("IF dropElementType !== 'group':", (dropElementType !== 'group'));
    // console.log("dropElementType:", dropElementType);
    // console.log("boardId:", boardId);
    // console.log("dropElement.id:", dropElement.id);

    // console.log("IF parentBoardId !== boardId:", (parentBoardId !== boardId));

    // console.log("DROP Element.cards:", dropElement.cards);
    // console.log("DROP Element.cards hasOwnProperty('cards'):", dropElement.hasOwnProperty('cards'));
    // console.log("drop Element.cards !== undefined:", dropElement.cards !== undefined);
    // console.log("DROP dragElementOrder:", dragElementOrder);
    // console.log("---------------------");
    event.target.style.background = "";

    if (
      dragElementId === dropElement.id ||
      (dragElementType === "card" &&
        dropElementType === "group" &&
        parentBoardId === dropElement.id) ||
      (dragElementType === "card" &&
        dropElementType !== "group" &&
        parentBoardId !== boardId)
    ) {
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

      const filteredBoards = deleteCardFromBoard(
        boards,
        parentBoardId,
        dragElementId
      );
      // console.log(" boards::", boards);
      // console.log(" filteredBoard::", filteredBoards);
      dispatch(initState([...filteredBoards]));
      dispatch(addCard({ card: dragElement, id: dropElement.id }));
      return;
    }

    const changedElements = allElements.map((current) => {
      if (current.id === dropElement.id) {
        return { ...current, order: dragElementOrder };
      }
      if (current.id === dragElementId) {
        return { ...current, order: dropElement.order };
      }
      return current;
    });

    const sortedCards = changedElements.sort(sortElements);

    if (boardId === undefined) {
      dispatch(initState([...sortedCards]));
    } else {
      dispatch(setSortedCards({ boardId, sortedCards }));
    }
  };

  const sortElements = (a, b) => {
    if (a.order > b.order) {
      return 1;
    } else {
      return -1;
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
