import React, { useEffect, useState, useRef, createElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPhontomBoard, removePhontomBoard } from "@/store/main/mainSlice";

export const Draggable = ({
  order,
  boardId,
  // elementParkingRef,
  // boardElementRef,
  children
}) => {
  const dispatch = useDispatch();
  // const { isPhontomGroupCreated } = useSelector((state) => state.main);
  const [mouseDownElement, setMouseDownElement] = useState(null);
  const [phantomElement, setPhantomElement] = useState(null);
  const [mouseDownElementId, setMouseDownElementId] = useState(null);
  const [mouseDownElementOrder, setMouseDownElementOrder] = useState(null);


  // const [parking, setParking] = useState(null);
  // const [parkingNode, setParkingNode] = useState(null);
  // const [mouseMoveElement, setMouseMoveElement] = useState(null);
  // const [mouseUpElement, setMouseUpElement] = useState(null);
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [localCoords, setLocalCoords] = useState({ x: 0, y: 0 });
  const [windowCoords, setWindowCoords] = useState({ x: 0, y: 0 });
  const [isUp, setIsUp] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [isLeft, setIsLeft] = useState(false);
  const [isRight, setIsRight] = useState(false);
  // const [isMoving, setIsMoving] = useState(false);

  // const [isPhontomCreated, setIsPhontomCreated] = useState(false);
  const wait = "300";

  useEffect(() => {
    // console.log("====-----!!!!");
    // // console.log('Mouse Events:', { mouseDownElement, mouseUpElement, mouseMoveElement });
    // // console.log('globalCoords:', globalCoords);
    // // console.log('localCoords:', localCoords);
    // // console.log('windowCoords:', windowCoords);
    // console.log("parking:", parking ? "<parking>" : null);
    // console.log(
    //   "mouseDownElement:",
    //   mouseDownElement ? "<mouseDownElement>" : null
    // );
    // console.log("parkingNode:", parkingNode ? "<parkingNode>" : null);
    // console.log("!!!-----====");
  }, [
    mouseDownElement,
    // mouseUpElement,
    // mouseMoveElement,
    // globalCoords,
    // localCoords,
    // windowCoords,
    // parking,
    // parkingNode
  ]);

  const setMoveStyles = () => {
    if (mouseDownElement.style.position !== 'absolute') {
      // mouseDownElement.style.transitionProperty = "none";
      // mouseDownElement.style.boxShadow = "2px 2px 10px gray";
      // mouseDownElement.style.zIndex = "20";
      // mouseDownElement.style.border = "1px solid red";
      // mouseDownElement.style.position = 'absolute';
      // const width = mouseDownElement.clientWidth + "px";
      // mouseDownElement.style.width = width;
    }
  };




  const restoreStyles = () => {
    const phantomElement = document.getElementById('phantomElement');
    // const phantomX = phantomElement.offsetLeft;
    // const phantomY = phantomElement.offsetTop;
    
    mouseDownElement.style.left = windowCoords.x + 'px';
    mouseDownElement.style.top = windowCoords.y + 'px';
    mouseDownElement.style.transitionProperty = "left, top, box-shadow";
    mouseDownElement.style.transitionTimingFunction = "linear";
    mouseDownElement.style.transitionDuration = wait + "ms";
    mouseDownElement.style.boxShadow = "0px 0px 0px gray";
    
    setTimeout(() => {
      phantomElement.remove();
      mouseDownElement.style.transitionProperty = "none";
      mouseDownElement.style.left = "0px";
      mouseDownElement.style.top = "0px";
      mouseDownElement.style.position = "";
    }, wait);
    
    setTimeout(() => {
      mouseDownElement.style.zIndex = "";
    }, wait * 3);
  };




  const mouseDown = (e) => {
    // console.log('e.target.id:', e.target.id);

    if (e.target.id !== "board-to-drag" && e.target.id !== "card-to-drag") {
      return;
    }

    const element = e.target;
    setMouseDownElement(element);
    setMouseDownElementId(element.dataset.id);
    setMouseDownElementOrder(element.dataset.order);
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
      x: element.offsetLeft,
      y: element.offsetTop
    });

    const phantomElement = element.cloneNode(false);
    setPhantomElement(phantomElement);
    const width = element.clientWidth + "px";
    element.style.width = width;
    element.style.transitionProperty = "none";
    element.style.boxShadow = "2px 2px 10px gray";
    element.style.zIndex = "20";
    element.style.position = 'absolute';

    phantomElement.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    phantomElement.style.zIndex = "0";
    phantomElement.style.left = e.offsetLeft + 'px';
    phantomElement.style.top = e.offsetTop + 'px';
    phantomElement.setAttribute ('id', 'phantomElement');
    const parent = element.parentNode;
    parent.append(phantomElement);
  };

  const createPhontomBoard = () => {
    // if (!isPhontomGroupCreated) {

    // console.log('parking:', parking);
    // console.log('parkingNode:', parkingNode);
    // console.log('mouseDownElement:', mouseDownElement);

    if (mouseDownElement !== null) {
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
      // setParkingNode(mouseDownElement);


      // setMoveStyles();

      // console.log("<><><><><><> newParkingNode:", newParkingNode);
      // dispatch(setPhontomBoard({ boardId, order }));
      // setIsPhontomCreated(true);
      // return newParkingNode;
      return mouseDownElement;
    }

    // }
    return null;
  };




  const mouseMove = (e) => {
    if (mouseDownElement !== null) {
      setMoveStyles();

      console.log("------------------");
      // console.log("elemFromPoint:", elemFromPoint);
      // console.log("elemFromPoint:", elemFromPoint.dataset.id);

      // console.log("mouseDownElement:", mouseDownElement);
      console.log("mouseDownElementId:", mouseDownElementId);
      console.log("isUp, isDown, isLeft, isRight:", { isUp, isDown, isLeft, isRight });
      // console.log("mouseDownElementOrder:", mouseDownElementOrder);

      // const mouseOverElement = e.target;
      // const mouseOverElementId = e.target.dataset.id;
      // const mouseOverElementOrder = e.target.dataset.order;

      // console.log("e.target.dataset.order:", mouseOverElementOrder);
      // console.log("e.target.dataset.id:", mouseOverElementId);
      // console.log("e.target.dataset.type:", e.target.dataset.type);
      console.log("------------------");

      // let nodeUp;
      // let nodeDown;
      // let nodeLeft;
      // let nodeRight;

      if (isUp) {
        swapUp();
      } else if (isDown) {
        swapDown();
      } else {
        restorePhantomPosition();
      }
      
      
      if (isLeft) {
        // nodeRight = mouseDownElement;
        // nodeLeft = findNodeDown(nodeRight);
        // swap(nodeLeft, nodeRight);
      } else if (isRight) {
        // nodeLeft = mouseDownElement;
        // nodeRight = findNodeDown(nodeUp);
        // swap(nodeLeft, nodeRight);
      }      

      moveElement(e);
    }
  };

  const findNodeUp = (nodeDown) => {
    const parent = nodeDown.parentNode;
    const prevElement = parent.previousElementSibling;
    if (prevElement !== null) {
      const child = prevElement.firstChild;
      // console.log("findNodeUp id:", child.dataset.id);
      // if (child.dataset.id) 
      return child;
    }
    return null;
  }

  const findNodeDown = (nodeUp) => {
    const parent = nodeUp.parentNode;
    console.log("parent:", parent);
    const nextElement = parent.nextElementSibling;
    console.log("nextElement:", nextElement);
    if (nextElement !== null) {
      const child = nextElement.firstChild;
      console.log("child:", child);
      // console.log("findNodeDown id:", child.dataset.id);
      // if (child.dataset.id) return child;
      return child;
    }
    return null;
  }

  // let isPhantomAdded = false;

  let nodeLeft = 0;
  let nodeTop = 0;

  const swapUp = () => {
    const nodeDown = phantomElement;
    const nodeUp = findNodeUp(nodeDown);

    // console.log('nodeUp.offsetLeft 1:', nodeUp.offsetLeft);
    // console.log('nodeUp.offsetTop 1:', nodeUp.offsetTop);
    
    if (nodeUp !== null && nodeDown !== null) {
      setIsUp(false);
      nodeLeft = nodeUp.offsetLeft;
      nodeTop = nodeUp.offsetTop;
      
      const parent = nodeDown.parentNode;
      const nodeDownCopy = nodeUp;
      nodeUp.replaceWith(nodeDown);
      parent.append(nodeDownCopy);

      // setWindowCoords({
      //   x: nodeLeft,
      //   y: nodeTop
      // });
    }
  }

  const swapDown = () => {
    const nodeUp = phantomElement;
    const nodeDown = findNodeDown(nodeUp);
    
    if (nodeUp !== null && nodeDown !== null) {
      setWindowCoords({
        x: nodeDown.offsetLeft,
        y: nodeDown.offsetTop
      });
  
      setIsDown(false);

      const parent = nodeUp.parentNode;
      const nodeDownCopy = nodeDown;
      nodeDown.replaceWith(nodeUp);
      parent.append(nodeDownCopy);
    }
  }

  const restorePhantomPosition = () => {

  }

  const moveElement = (e) => {
    const mouseShiftX = e.screenX - globalCoords.x;
    const mouseShiftY = e.screenY - globalCoords.y;

    // console.log('mouseDownElement:', mouseDownElement);
    // console.log('windowCoords:', windowCoords);
    // console.log('Mouse Shift:', { mouseShiftX, mouseShiftY });

    // console.log('windowCoords X + mouseShiftX:', windowCoords.x + mouseShiftX);
    // console.log('windowCoords Y + mouseShiftY:', windowCoords.y + mouseShiftY);

    // mouseDownElement.style.left = windowCoords.x + mouseShiftX + 'px';
    // mouseDownElement.style.top = windowCoords.y + mouseShiftY + 'px';

    // newParkingNode.style.position = "absolute";
    // newParkingNode.style.zIndex = "20";
    // newParkingNode.style.border = "1px solid red";

    

    mouseDownElement.style.left = windowCoords.x + mouseShiftX + "px";
    mouseDownElement.style.top = windowCoords.y + mouseShiftY + "px";
    // mouseDownElement.style.left = mouseShiftX + "px";
    // mouseDownElement.style.top = mouseShiftY + "px";

    calculateDistance(e);
  };

  const calculateDistance = (e) => {
    const step = 50;
    const distanceY = e.screenY - globalCoords.y;
    const distanceX = e.screenX - globalCoords.x;
    // distanceY > 0 - down, < 0 - up
    // distanceX > 0 - right, < 0 - left
    
    console.log("distanceY:", distanceY);
    console.log("distanceX:", distanceX);

    if (Math.abs(distanceY) > step) {
      console.log("Элемент над другим элементом по Y");
      if (distanceY >= 0) {
        console.log("Элемент идет ВНИЗ");
        setIsDown(true)
        setIsUp(false);
      } else {
        console.log("Элемент идет ВВЕРХ");
        setIsDown(false);
        setIsUp(true);
      }
    } else {
      console.log("Элемент на своем месте");
      setIsUp(false);
      setIsDown(false);
    }
    
    if (Math.abs(distanceX) > step) {
      console.log("Элемент над другим элементом по X");
      if (distanceX >= 0) {
        setIsRight(true)
        setIsLeft(false);
      } else {
        setIsRight(false);
        setIsLeft(true);
      }
    } else {
      setIsRight(false);
      setIsLeft(false);
    }
  };

  const mouseUp = (e) => {
    if (mouseDownElement !== null) {
      setMouseDownElement(null);
      restoreStyles();

      // dispatch(removePhontomBoard());
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
