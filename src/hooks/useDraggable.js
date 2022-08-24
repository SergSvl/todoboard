import React from 'react';
import { useDispatch } from "react-redux";
import { initState, setSortedCards } from "@/store/main/mainSlice";

const useDraggable = () => {
  const dispatch = useDispatch();

  const onDragStart = (event, dragElement) => {
    event.stopPropagation();
    console.log("---------------------");
    // console.log("Drag dragElement:", dragElement);
    console.log("Drag Element.id:", dragElement.id);
    console.log("Drag Element.order:", dragElement.order);
    // console.log("Drag event.target:", event.target);

    event.dataTransfer.setData("dragElementId",  dragElement.id);
    event.dataTransfer.setData("dragElementOrder",  dragElement.order);

    event.dataTransfer.effectAllowed = "move";
    // event.dataTransfer.setDragImage(event.target, 50, 90);
  }

  const onDragOver = (event) => {
    event.preventDefault();
    event.target.style.background = '#e5e7eb';
  }

  const onDragLeave = (event) => {
    event.target.style.background = '';
  }

  const onDragEnd = (event) => {
  }

  const onDrop = (event, dropElement, allElements, boardId = undefined) => {
    event.stopPropagation();
    console.log("---------------------");
    console.log("Drop Element:", dropElement);
    console.log("Drop allElements:", allElements);

    const dragElementId = event.dataTransfer.getData("dragElementId");
    const dragElementOrder = event.dataTransfer.getData("dragElementOrder");
    console.log("DROP dragElementId:", dragElementId);
    console.log("DROP dragElementOrder:", dragElementOrder);
    console.log("---------------------");
    event.target.style.background = '';

    if (dragElementId === dropElement.id || dragElementId.cards === undefined && dropElement.cards !== undefined) {
      return;
    }

    const changedElements = allElements.map(current => {
      if (current.id === dropElement.id) {
        return {...current, order: dragElementOrder}
      }
      if (current.id === dragElementId) {
        return {...current, order: dropElement.order}
      }
      return current;
    });

    const sortedCards = changedElements.sort(sortElements);

    console.log("Drop changedElements:", changedElements);
    console.log("Drop changedElements.sort(sortElements):", sortedCards);

    if (boardId === undefined) {
      dispatch(initState([...sortedCards]));
    } else {
      dispatch(setSortedCards({ boardId, sortedCards }));
    }
  }

  const sortElements = (a, b) => {
    if (a.order > b.order) {
      return 1;
    } else {
      return -1;
    }
  }

  return {
    onDragStart,
    onDragOver,
    onDragLeave,
    onDragEnd,
    onDrop
  }
}

export default useDraggable;