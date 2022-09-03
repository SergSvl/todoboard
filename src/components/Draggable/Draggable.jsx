import React, { useEffect, useState, useRef, createElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPhontomBoard, removePhontomBoard } from "@/store/main/mainSlice";

export const Draggable = ({
  order,
  boardId,
  elementParkingRef,
  boardElementRef,
  children
}) => {
  const dispatch = useDispatch();
  const { isPhontomGroupCreated } = useSelector((state) => state.main);
  const [mouseDownElement, setMouseDownElement] = useState(null);
  const [mouseDownElementId, setMouseDownElementId] = useState(null);
  const [mouseDownElementOrder, setMouseDownElementOrder] = useState(null);


  const [parking, setParking] = useState(null);
  const [parkingNode, setParkingNode] = useState(null);
  const [mouseMoveElement, setMouseMoveElement] = useState(null);
  const [mouseUpElement, setMouseUpElement] = useState(null);
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [localCoords, setLocalCoords] = useState({ x: 0, y: 0 });
  const [windowCoords, setWindowCoords] = useState({ x: 0, y: 0 });
  const [isStartPositioning, setIsStartPositioning] = useState(false);
  const [isPhontomCreated, setIsPhontomCreated] = useState(false);
  const wait = "300";

  useEffect(() => {
    console.log("====-----!!!!");
    // console.log('Mouse Events:', { mouseDownElement, mouseUpElement, mouseMoveElement });
    // console.log('globalCoords:', globalCoords);
    // console.log('localCoords:', localCoords);
    // console.log('windowCoords:', windowCoords);
    console.log("parking:", parking ? "<parking>" : null);
    console.log(
      "mouseDownElement:",
      mouseDownElement ? "<mouseDownElement>" : null
    );
    console.log("parkingNode:", parkingNode ? "<parkingNode>" : null);
    console.log("!!!-----====");
  }, [
    mouseDownElement,
    // mouseUpElement,
    // mouseMoveElement,
    // globalCoords,
    // localCoords,
    // windowCoords,
    parking,
    parkingNode
  ]);

  useEffect(() => {
    const parking = document.getElementById("parking");
    setParking(parking);
  }, []);

  useEffect(() => {
    if (isStartPositioning) {
      console.log("elementParkingRef:", elementParkingRef);
      console.log("boardElementRef:", boardElementRef);
      console.log("Начинаем позиционирование элементов");
    }
  }, [isStartPositioning]);

  const setMoveStyles = () => {
    if (!isPhontomCreated) {
      mouseDownElement.style.transitionProperty = "none";
      mouseDownElement.style.boxShadow = "2px 2px 10px gray";
      // elementParkingRef.current = mouseDownElement;
    }

    // const phantomElement = createElement(
    //   '<div',
    //   {
    //     className: 'bg-yelloq-200 w-[300px] h-[200px]'
    //   },
    // );
    // duplicate.style.backgroundColor = 'yellow';

    // const phantomElement = () => <div className='bg-yellow w-[300px] h-[200px] z-40 board-red-3'>phantomElement</div>;
    // const phantomElement = () => {return { __html: <div className='bg-yelloq-200 w-[300px] h-[200px]'>phantomElement</div> }}

    // const parkingPhontom = document.getElementById('parkingPhontom');

    // const phantomElement = document.createElement('div');
    // phantomElement.style.backgroundColor = 'yellow';
    // phantomElement.style.border = '2px solid red';
    // phantomElement.style.width = mouseDownElement.style.width;
    // phantomElement.style.height = mouseDownElement.style.height;

    // parkingPhontom.after(phantomElement);

    // boardElementRef.current = phantomElement;
    // boardElementRef.current.dangerouslySetInnerHTML = phantomElement();

    // boardElementRef.current = phantomElement;
    // mouseDownElement.style.position = 'absolute';
  };

  const restoreStyles = () => {
    mouseDownElement.style.transitionProperty = "left, top, box-shadow";
    mouseDownElement.style.transitionTimingFunction = "linear";
    mouseDownElement.style.transitionDuration = wait + "ms";
    mouseDownElement.style.boxShadow = "0px 0px 0px gray";
    // mouseDownElement.style.left = windowCoords.x;
    // mouseDownElement.style.top = windowCoords.y;
    mouseDownElement.style.position = "";
    mouseDownElement.style.left = "0px";
    mouseDownElement.style.top = "0px";
    setTimeout(() => {
      // mouseDownElement.style.left = '0px';
      // mouseDownElement.style.top = '0px';
      mouseDownElement.style.zIndex = "";
    }, wait * 5);
  };

  const calculateDistance = (e) => {
    if (Math.abs(e.screenY - globalCoords.y) > 250) {
      console.log("Элемент переместился далеко");
      setIsStartPositioning(true);
    }
  };

  const mouseDown = (e) => {
    // console.log('mouseDown:', e);
    // console.log('e.target.id:', e.target.id);

    if (e.target.id !== "board-to-drag" && e.target.id !== "card-to-drag") {
      return;
    }
    setMouseDownElement(e.target);
    setMouseDownElementId(e.target.dataset.id);
    setMouseDownElementOrder(e.target.dataset.order);
    // e.clientX - координата указателя мыши по оси X относительно окна
    // e.clientY - координата указателя мыши по оси Y относительно окна
    // e.target.offsetLeft - координата смещения окна по X относительно родительского окна
    // e.target.offsetTop - координата смещения окна по Y относительно родительского окна
    setGlobalCoords({
      x: e.screenX,
      y: e.screenY
    });
    setLocalCoords({
      x: e.clientX,
      y: e.clientY
    });
    setWindowCoords({
      x: e.target.offsetLeft,
      y: e.target.offsetTop
    });
  };

  const createPhontomBoard = () => {
    // if (!isPhontomGroupCreated) {

    // console.log('parking:', parking);
    // console.log('parkingNode:', parkingNode);
    // console.log('mouseDownElement:', mouseDownElement);

    if (mouseDownElement !== null && parkingNode === null) {
      // 1. Сделать копию исходного эл-та и его фонтом (без дочерних эл-тов)
      // const mouseDownElementCopy = mouseDownElement.cloneNode(true);
      // const mouseDownElementPhantom = mouseDownElement.cloneNode(false);

      // // 2. Задать стили копии
      // mouseDownElementCopy.style.transitionProperty = "none";
      // mouseDownElementCopy.style.boxShadow = "2px 2px 10px gray";
      // mouseDownElementCopy.style.width = mouseDownElement.clientWidth + "px";

      // // 3. Припарковать копию и удалить из потока эл-тов
      // parking.append(mouseDownElementCopy);

      // // 4. Задать стили фантому
      // mouseDownElementPhantom.style.backgroundColor = "rgba(0, 0, 0, 0.2)";

      // // 5. Заменить исходный эл-т фантомом
      // mouseDownElement.replaceWith(mouseDownElementPhantom);

      // // 6. Получить припаркованный эл-т
      // const newParkingNode = parking.firstChild;

      // newParkingNode.style.position = "absolute";
      // newParkingNode.style.zIndex = "20";
      // newParkingNode.style.border = "1px solid red";

      // // 7. Сохранить его в стейте
      // setParkingNode(newParkingNode);
      // -------------------------------------


      mouseDownElement.style.transitionProperty = "none";
      mouseDownElement.style.boxShadow = "2px 2px 10px gray";
      // mouseDownElement.style.width = mouseDownElement.clientWidth + "px";
      // parking.append(mouseDownElement);
      // const newParkingNode = parking.firstChild;
      mouseDownElement.style.zIndex = "20";
      mouseDownElement.style.border = "1px solid red";
      setParkingNode(mouseDownElement);


      // setMoveStyles();

      // console.log("<><><><><><> newParkingNode:", newParkingNode);
      // dispatch(setPhontomBoard({ boardId, order }));
      setIsPhontomCreated(true);
      // return newParkingNode;
      return mouseDownElement;
    }

    // }
    return null;
  };

  const mouseMove = (e) => {
    if (mouseDownElement !== null) {
      const newParkingNode = createPhontomBoard();

      // const pointX = e.clientX;
      // const pointY = e.clientY;

      // const elemFromPoint = document.elementFromPoint(pointX, pointY);

      console.log("------------------");
      // console.log('mouseDownElement:', mouseDownElement ? '<mouseDownElement>' : null);
      // console.log(
      //   "~~~~ newParkingNode:",
      //   newParkingNode ? "<newParkingNode>" : null
      // );
      // console.log("parkingNode:", parkingNode ? "<parkingNode>" : null);

      // console.log("pointX, pointY:", { pointX, pointY });
      // console.log("elemFromPoint:", elemFromPoint);
      // console.log("elemFromPoint:", elemFromPoint.dataset.id);

      // console.log("mouseDownElement:", mouseDownElement);
      console.log("mouseDownElementId:", mouseDownElementId);
      // console.log("mouseDownElementOrder:", mouseDownElementOrder);

      // const mouseOverElement = e.target;
      const mouseDownElementParent = mouseDownElement.parentNode;
      const nextElement = mouseDownElementParent.nextElementSibling;
      const mouseOverElementAfter = nextElement.firstChild;
      console.log("mouseOverElementAfter id:", mouseOverElementAfter.dataset.id);

      // const mouseOverElementId = e.target.dataset.id;
      // const mouseOverElementOrder = e.target.dataset.order;

      // console.log("e.target.dataset.order:", mouseOverElementOrder);
      // console.log("e.target.dataset.id:", mouseOverElementId);
      // console.log("e.target.dataset.type:", e.target.dataset.type);
      console.log("------------------");

      // if (mouseDownElementId !== mouseOverElementId) {
        swap(mouseDownElement, mouseOverElementAfter);
      // }

      if (parkingNode !== null) {
        moveElement(e, newParkingNode || parkingNode);
      }
      // if (newParkingNode !== null || parkingNode !== null ) {
      //   moveElement(e, newParkingNode || parkingNode);
      // }
    }
  };

  const swap = (node1, node2) => {
    const parent = node1.parentNode;
    const afterNode1 = node1.nextElementSibling;
    node2.replaceWith(node1);
    parent.insertBefore(node2, afterNode1);
  }

  const moveElement = (e, newParkingNode) => {
    // console.log("--newParkingNode--:", newParkingNode);

    const mouseShiftX = e.screenX - globalCoords.x;
    const mouseShiftY = e.screenY - globalCoords.y;

    // calculateDistance(e);

    // console.log('mouseDownElement:', mouseDownElement);
    // console.log('windowCoords:', windowCoords);
    // console.log('Mouse Shift:', { mouseShiftX, mouseShiftY });

    // console.log('windowCoords X + mouseShiftX:', windowCoords.x + mouseShiftX);
    // console.log('windowCoords Y + mouseShiftY:', windowCoords.y + mouseShiftY);

    // mouseDownElement.style.left = windowCoords.x + mouseShiftX + 'px';
    // mouseDownElement.style.top = windowCoords.y + mouseShiftY + 'px';

    // if (parkingNode !== null) {
    //   parkingNode.style.left = mouseShiftX + 'px';
    //   parkingNode.style.top = mouseShiftY + 'px';
    //   parkingNode.style.zIndex = "20";
    // } else {
    // newParkingNode.style.position = "absolute";
    // newParkingNode.style.zIndex = "20";
    // newParkingNode.style.border = "1px solid red";
    // newParkingNode.style.left = windowCoords.x + mouseShiftX + "px";
    // newParkingNode.style.top = windowCoords.y + mouseShiftY + "px";
    newParkingNode.style.left = mouseShiftX + "px";
    newParkingNode.style.top = mouseShiftY + "px";
    // }
  };

  const mouseUp = (e) => {
    if (mouseDownElement !== null) {
      setMouseDownElement(null);
      restoreStyles();
      setIsStartPositioning(false);

      // dispatch(removePhontomBoard());
      setIsPhontomCreated(false);
      // parkingNode.remove();
      setParkingNode(null);
    }
  };

  const mouseOver = (e) => {
    console.log("mouseOver order:", e.target.dataset.order);
    console.log("mouseOver id:", e.target.dataset.id);
    
    // if (mouseDownElement !== null) {
    //   console.log("mouseOver:", e);
    // }
  };

  const mouseEnter = (e) => {

    console.log("mouseEnter order:", e.target.dataset.order);
    console.log("mouseEnter id:", e.target.dataset.id);

    // if (mouseDownElement !== null) {
    //   console.log("mouseEnter:", e);
    // }
  };

  return (
    <div
      className='w-full -[flex-basis:content] -border border-red-400'
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseMove={mouseMove}
      // onMouseOver={mouseOver}
      // onMouseEnter={mouseEnter}
    >
      {children}
    </div>
  );
};
