import React from 'react';
import { useDispatch } from "react-redux";
import { initState, setSortedCards } from "@/store/main/mainSlice";

const useDraggable = () => {
  const dispatch = useDispatch();

  const onDragStart = (event, dragElement) => {
    event.stopPropagation();
    console.log("---------------------");
    // console.log("DragStart dragElement:", dragElement);
    console.log("DragStart dragElement.id:", dragElement.id);
    console.log("DragStart dragElement.order:", dragElement.order);
    // console.log("DragStart event.target:", event.target);

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

  const onDrop = (event, dragElement, allElements, boardId = undefined) => {
    event.stopPropagation();
    console.log("---------------------");
    console.log("Drop dragElement:", dragElement);
    console.log("Drop allElements:", allElements);

    const dragElementId = event.dataTransfer.getData("dragElementId");
    const dragElementOrder = event.dataTransfer.getData("dragElementOrder");
    console.log("DROP dragElementId:", dragElementId);
    console.log("DROP dragElementOrder:", dragElementOrder);
    console.log("---------------------");
    event.target.style.background = '';

    const changedElements = allElements.map(current => {
      if (current.id === dragElement.id) {
        return {...current, order: dragElementOrder}
      }
      if (current.id === dragElementId) {
        return {...current, order: dragElement.order}
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