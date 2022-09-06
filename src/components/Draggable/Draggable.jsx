import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPhontomBoard, removePhontomBoard, swapBoards } from "@/store/main/mainSlice";

export const Draggable = ({
  boards,
  order,
  boardId,
  children
}) => {
  const dispatch = useDispatch();
  const [mouseDownElement, setMouseDownElement] = useState(null);
  const [phantomData, setPhantomData] = useState(null);
  const [findElement, setFindElement] = useState(null);
  const [marginTopElement, setMarginTopElement] = useState(16);
  const [mouseDownElementId, setMouseDownElementId] = useState(null);
  const [mouseDownElementOrder, setMouseDownElementOrder] = useState(null);
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [windowCoords, setWindowCoords] = useState({ x: 0, y: 0 });
  const [domElements, setDomElements] = useState([]);
  const [effectWait, setEffectWait] = useState([]);

  useEffect(() => {
    const elements = document.getElementById('boardsParent').childNodes;
    let element = '';

    if (elements[0].firstElementChild === null) {
      element = elements[0];
    } else {
      element = elements[0].firstElementChild;
    }

    const margins = parseInt(getComputedStyle(element).marginTop) + parseInt(getComputedStyle(element).marginBottom);
    // console.log("margins:", margins);
    // console.log("boardsParent:", elements);
    // console.log("mouseDownElement:", mouseDownElement);

    const elementBorders = [];
    const phantomId = 'phantom';
    const defaultBoardHeight = 192;
    const resultBoardHeight = mouseDownElement !== null ? mouseDownElement.clientHeight : defaultBoardHeight;

    for (let i = 0; i < elements.length; i++) {
      const height = elements[i].offsetHeight === 0 ? resultBoardHeight : elements[i].offsetHeight - margins;
      const resultTop = elements[i].id === '' ? elements[i].offsetTop - marginTopElement : elements[i].offsetTop;
      const resultBottom = elements[i].id === '' ? elements[i].offsetTop + height + marginTopElement : elements[i].offsetTop + height;

      // console.log("last elementBorders:", elementBorders[elementBorders.length-1]);
      // console.log("last height:", height);
      // console.log("last elements["+i+"].id:", elements[i].id);

      elementBorders.push({
        id: elements[i].id ? elements[i].id : phantomId,
        order: elements[i].dataset.order,
        top: resultTop,
        left: elements[i].offsetLeft,
        bottom: resultBottom
      });
      
      if (!elements[i].id) {
        setPhantomData({ id: phantomId, order: elements[i].dataset.order });
      }
    }
    // console.log("elementBorders:", elementBorders);
    setDomElements(elementBorders);
  }, [boards]);

  useEffect(() => {
    setEffectWait(300);
  }, []); 

  useEffect(() => {
    // console.log("domElements:", domElements);
  }, [domElements]); 


  //-------------------------------------------------------
  // const width = mouseDownElement.clientWidth + "px";
  // mouseDownElement.style.width = width;
  // const phantomElement = element.cloneNode(false);
  // setPhantomElement(phantomElement);
  // phantomElement.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  // phantomElement.style.zIndex = "0";
  // phantomElement.style.left = e.offsetLeft + 'px';
  // phantomElement.style.top = e.offsetTop + 'px';
  // phantomElement.setAttribute ('id', 'phantomElement');
  // const parent = element.parentNode;
  // parent.append(phantomElement);

  const setMouseDownStyles = (e, element) => {
    const width = element.clientWidth + "px";
    element.style.width = width;
    element.style.transitionProperty = "none";
    element.style.boxShadow = "2px 2px 12px rgba(85, 85, 85, 1)";
    element.style.zIndex = "20";
    
    // if (!element.style.top && !element.style.left) {
    //   element.style.left = element.offsetLeft + 'px';
    //   element.style.top = element.offsetTop + 'px';
    //   element.style.marginTop = "0px";
    //   element.style.position = 'absolute';
    // } else {
    //   element.style.left = element.offsetLeft + 'px';
    //   element.style.top = element.offsetTop + 'px';
    //   element.style.marginTop = "0px";
    //   element.style.position = 'absolute';
    // }
    element.style.left = element.offsetLeft + 'px';
    element.style.top = element.offsetTop + 'px';
    element.style.marginTop = "0px";
    element.style.position = 'absolute';
    
    // const top = parseInt(getComputedStyle(element).top);
    // const left = parseInt(getComputedStyle(element).left);
    // console.log("top, left:", { top, left });
    // console.log("element.style:", { top: element.style.top, left: element.style.left });
    // console.log("globalCoords.x, globalCoords.y:", { x: e.screenX, y: e.screenY });
    // console.log("element.offsetLeft, element.offsetTop:", { x: element.offsetLeft, y: element.offsetTop });
  }

  const setMouseMoveStyles = () => {
    mouseDownElement.style.marginTop = "0px";
  }

  const setMouseUpStyles = () => {
    // console.log("globalCoords.x, globalCoords.y:", { x: globalCoords.x, y: globalCoords.y });
    // console.log("offsetLeft.x, offsetLeft.y:", { x: windowCoords.x, y: windowCoords.y });
    // console.log("findElement:", findElement);
    
    if (findElement !== null) {
      mouseDownElement.style.left = findElement.left + 'px';
      mouseDownElement.style.top = findElement.top + marginTopElement + 'px'; // margin-top compensation
    } else {
      mouseDownElement.style.left = windowCoords.x + 'px';
      mouseDownElement.style.top = windowCoords.y + 'px';
    }

    mouseDownElement.style.transitionProperty = "left, top, box-shadow";
    // mouseDownElement.style.marginTop = "0px";
    mouseDownElement.style.transitionDuration = effectWait + "ms";
    mouseDownElement.style.transitionTimingFunction = "linear";
    
    setTimeout(() => {
      mouseDownElement.style.boxShadow = "0px 0px 0px gray";
      mouseDownElement.style.transitionProperty = "none";
      mouseDownElement.style.left = "0px";
      mouseDownElement.style.top = "0px";
      mouseDownElement.style.marginTop = "16px";
      mouseDownElement.style.width = '';
      mouseDownElement.style.position = "";
    }, effectWait);
    
    setTimeout(() => {
      mouseDownElement.style.zIndex = "";
    }, effectWait * 2);
  };

  //-------------------------------------------------------

  const mouseDown = (e) => {
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
    setWindowCoords({
      x: element.offsetLeft,
      y: element.offsetTop
    });

    // console.log("element {}:", { id: element.dataset.id, order: element.dataset.order });

    if (element) {
      setPhantomData({ id: element.dataset.id, order: element.dataset.order });
    }

    setMouseDownStyles(e, element);

    const boardId = element.dataset.id;
    const order = element.dataset.order;

    const height = domElements.reduce((acc, elem) => {
      if (elem.id === boardId) {
        acc = parseInt(elem.bottom) - parseInt(elem.top);
        // console.log("elem.id:", elem.id);
        // console.log("parseInt(elem.top):", parseInt(elem.top));
        // console.log("parseInt(elem.bottom):", parseInt(elem.bottom));
        // console.log("height:", parseInt(elem.bottom) - parseInt(elem.top));
      }
      return acc;
    }, 0);

    // console.log("height:", height);

    dispatch(setPhontomBoard({ order, height }));
  };

  const mouseMove = (e) => {
    if (mouseDownElement !== null) {
      setMouseMoveStyles();

      // console.log("------------------");
      // const mouseOverElement = e.target;
      // const mouseOverElementId = e.target.dataset.id;
      // const mouseOverElementOrder = e.target.dataset.order;

      // console.log("e.target.dataset.order:", mouseOverElementOrder);
      // console.log("e.target.dataset.id:", mouseOverElementId);
      // console.log("e.target.dataset.type:", e.target.dataset.type);
      // console.log("------------------");

      moveElement(e);
    }
  };

  const moveElement = (e) => {
    const mouseShiftX = e.screenX - globalCoords.x;
    const mouseShiftY = e.screenY - globalCoords.y;

    // mouseShiftY > 0 - down, < 0 - up
    // mouseShiftX > 0 - right, < 0 - left

    // console.log('mouseDownElement:', mouseDownElement);
    // console.log('windowCoords:', windowCoords);
    // console.log('windowCoords X + mouseShiftX:', windowCoords.x + mouseShiftX);
    // console.log('windowCoords Y + mouseShiftY:', windowCoords.y + mouseShiftY);

    mouseDownElement.style.left = windowCoords.x + mouseShiftX + "px";
    mouseDownElement.style.top = windowCoords.y + mouseShiftY + "px";

    const findEnterElement = domElements.filter((elem) => elem.top <= e.clientY && e.clientY <= elem.bottom ? true : false)[0];
    
    // console.log('findEnterElement:', findEnterElement !== undefined && findEnterElement);
    
    if (findEnterElement !== undefined && findEnterElement.id !== phantomData.id) {
      setFindElement(findEnterElement);
      
      // console.log('findEnterElement:', findEnterElement);
      // console.log("domElements:", domElements);
      // console.log('e.clientY:', e.clientY);

      const order = mouseShiftY > 0 
        ? findEnterElement.order
        : findEnterElement.order > 1
          ? findEnterElement.order
          // ? findEnterElement.order - 1
          : findEnterElement.order;
      dispatch(swapBoards({ destinationOrder: order }));
    }
  };

  const mouseUp = (e) => {
    if (mouseDownElement !== null) {
      setMouseDownElement(null);
      setMouseUpStyles();
      // console.log("phantomData:", phantomData);
      // console.log("mouseDownElement:", mouseDownElement);
      // console.log("mouseDownElement:", { ...mouseDownElement });
      // console.log("findElement:", findElement);
      setTimeout(() => {
        dispatch(removePhontomBoard({ 
          boardId: mouseDownElement.dataset.id,
          boardOrder: phantomData.order <= 1 ? 1 : parseInt(mouseDownElement.dataset.order),
          phantomId: findElement !== null ? findElement.id : '',
          phantomOrder: phantomData.order <= 1 ? 1 : phantomData.order - 1
        }));
      }, effectWait);
      setFindElement(null);
    }
  };

  return (
    <div
      id={boardId}
      data-order={order}
      className='w-full -[flex-basis:content] -border border-red-400 text-white'
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseMove={mouseMove}
    >
      {children}
    </div>
  );
};
