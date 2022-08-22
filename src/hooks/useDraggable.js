import React from 'react';
import { useDispatch } from "react-redux";
import { initState } from "@/store/main/mainSlice";

const useDraggable = () => {
  const dispatch = useDispatch();

  const onDragStart = (event, dragElement) => {
    console.log("---------------------");
    // console.log("DragStart dragElement:", dragElement);
    console.log("DragStart dragElement.order:", dragElement.order);
    console.log("DragStart dragElement.id:", dragElement.id);
    console.log("DragStart event.target:", event.target);

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

  const onDrop = (event, dragElement, allElements) => {
    event.preventDefault();
    console.log("---------------------");
    console.log("Drop dragElement:", dragElement);
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

    // console.log("Drop changedElements:", changedElements);
    console.log("Drop changedElements.sort(sortElements):", changedElements.sort(sortElements));

    dispatch(initState([...changedElements.sort(sortElements)]));
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