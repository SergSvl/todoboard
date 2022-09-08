import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPhantomBoard,
  addPhantomCard,
  removePhantomBoard,
  removePhantomCard,
  swapBoards,
  swapCards
} from "@/store/main/mainSlice";

export const Draggable = ({ boards, order, boardId, children }) => {
  const dispatch = useDispatch();
  const [mouseDownElement, setMouseDownElement] = useState(null);
  const [nextDivider, setNextDivider] = useState(null);
  const [phantomData, setPhantomData] = useState(null);
  const [findElement, setFindElement] = useState(null);
  const [marginTopElement, setMarginTopElement] = useState(16);
  const [mouseDownElementId, setMouseDownElementId] = useState(null);
  const [mouseDownElementOrder, setMouseDownElementOrder] = useState(null);
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [windowCoords, setWindowCoords] = useState({ x: 0, y: 0 });
  const [domElements, setDomElements] = useState([]);
  const [effectWait, setEffectWait] = useState([]);
  const [phantomId, setPhantomId] = useState("phantom");
  const [nextFind, setNextFind] = useState(false);
  // const [lastScreenY, setLastScreenY] = useState(null);
  // const [lastScreenX, setLastScreenX] = useState(null);

  useEffect(() => {
    const getCardElements = (boardId) => {
      // console.log("boardId:", boardId);

      const elementBorders = [];
      const cardsNode = document.getElementById(`cardsParent#${boardId}`);
      // console.log("cardsNode:", cardsNode);
      if (cardsNode) {
        const elements = cardsNode.childNodes;

        for (let i = 0; i < elements.length; i++) {
          const defaultCardWidth = 300;
          const defaultCardHeight = 80;
          const resultCardWidth =
            mouseDownElement !== null
              ? mouseDownElement.clientWidth
              : defaultCardWidth;
          const resultCardHeight =
            mouseDownElement !== null
              ? mouseDownElement.clientHeight
              : defaultCardHeight;
          const height =
            elements[i].offsetHeight === 0
              ? resultCardHeight
              : elements[i].offsetHeight;
          const resultLeft = elements[i].offsetLeft;
          const resultRight = elements[i].offsetLeft + resultCardWidth;

          // console.log("last elementBorders:", elementBorders[elementBorders.length-1]);

          // console.log("elements["+i+"]:", elements[i]);
          // console.log("elements["+i+"].id:", elements[i].id);
          // console.log("elements[i].offsetTop:", elements[i].offsetTop);
          // console.log("resultLeft:", resultLeft);
          // console.log("height:", height);
          // console.log("resultRight:", resultRight);

          // console.log("mouseDownElement:", mouseDownElement);
          // console.log("elements[" + i + "].id:", elements[i].id);
          // console.log(
          //   "elements[" + i + "].dataset.id:",
          //   elements[i].dataset.id
          // );
          // console.log(
          //   "mouseDownElement.dataset.id:",
          //   mouseDownElement.dataset.id
          // );

          if (
            mouseDownElement !== null &&
            elements[i].dataset.id !== undefined &&
            elements[i].dataset.id !== mouseDownElement.dataset.id
          ) {
            elementBorders.push({
              id: elements[i].dataset.id ? elements[i].dataset.id : phantomId,
              order: parseInt(elements[i].dataset.order),
              top: elements[i].offsetTop,
              left: resultLeft,
              right: resultRight
            });
          }

          if (!elements[i].id) {
            // console.log("card elements["+i+"].id:", elements[i].id);
            // console.log("card elements["+i+"].dataset.order:", elements[i].dataset.order);

            if (elements[i].dataset.order !== undefined) {
              setPhantomData({
                boardId,
                id: phantomId,
                order: elements[i].dataset.order
              });
            }
          }
        }
      }
      return elementBorders;
    };

    let element = "";
    const elements = document.getElementById("boardsParent").childNodes;

    if (elements[0].firstElementChild === null) {
      element = elements[0];
    } else {
      element = elements[0].firstElementChild;
    }

    const margins =
      parseInt(getComputedStyle(element).marginTop) +
      parseInt(getComputedStyle(element).marginBottom);
    // console.log("margins:", margins);
    // console.log("boardsParent:", elements);
    // console.log("mouseDownElement:", mouseDownElement);

    const elementBorders = [];
    const defaultBoardHeight = 192;
    const resultBoardHeight =
      mouseDownElement !== null
        ? mouseDownElement.clientHeight
        : defaultBoardHeight;

    for (let i = 0; i < elements.length; i++) {
      const height =
        elements[i].offsetHeight === 0
          ? resultBoardHeight
          : elements[i].offsetHeight - margins;
      const resultTop =
        elements[i].id === ""
          ? elements[i].offsetTop - marginTopElement
          : elements[i].offsetTop;
      const resultBottom =
        elements[i].id === ""
          ? elements[i].offsetTop + height + marginTopElement
          : elements[i].offsetTop + height;

      // console.log("last elementBorders:", elementBorders[elementBorders.length-1]);
      // console.log("last height:", height);
      // console.log("last elements["+i+"].id:", elements[i].id);

      // console.log("elements["+i+"]:", elements[i]);
      // console.log("elements["+i+"].id:", elements[i].id);
      // console.log("resultTop:", resultTop);
      // console.log("height:", height);
      // console.log("resultBottom:", resultBottom);

      if (
        mouseDownElement !== null &&
        elements[i].id !== mouseDownElement.dataset.id
      ) {
        elementBorders.push({
          id: elements[i].id ? elements[i].id : phantomId,
          order: parseInt(elements[i].dataset.order),
          top: resultTop,
          left: elements[i].offsetLeft,
          bottom: resultBottom,
          cards: getCardElements(elements[i].id)
        });
      }

      if (!elements[i].id) {
          // console.log("board elements["+i+"].id:", elements[i].id);
          // console.log("board elements["+i+"].dataset.order:", elements[i].dataset.order);
          if (elements[i].dataset.order !== undefined) {
            setPhantomData({ id: phantomId, order: elements[i].dataset.order });
          }
      }
    }
    console.log("setDomElements:", elementBorders);
    setDomElements(elementBorders);
  }, [boards, mouseDownElement, marginTopElement, phantomId]);

  useEffect(() => {
    setEffectWait(300);
  }, []);

  useEffect(() => {
    // console.log("domElements:", domElements);
  }, [domElements]);

  const setMouseDownBoardStyles = (e, element) => {
    const width = element.clientWidth + "px";
    element.style.width = width;
    element.style.transitionProperty = "none";
    element.style.boxShadow = "2px 2px 12px rgba(85, 85, 85, 1)";
    element.style.zIndex = "20";
    element.style.left = element.offsetLeft + "px";
    element.style.top = element.offsetTop + "px";
    element.style.marginTop = "0px";
    element.style.position = "absolute";

    // const top = parseInt(getComputedStyle(element).top);
    // const left = parseInt(getComputedStyle(element).left);
    // console.log("top, left:", { top, left });
    // console.log("element.style:", { top: element.style.top, left: element.style.left });
    // console.log("globalCoords.x, globalCoords.y:", { x: e.screenX, y: e.screenY });
    // console.log("element.offsetLeft, element.offsetTop:", { x: element.offsetLeft, y: element.offsetTop });
  };

  const setMouseDownCardStyles = (e, element) => {
    const nextDivider = element.nextElementSibling;
    console.log("nextDivider.dataset.divider:", nextDivider.dataset.divider);

    if (nextDivider.dataset.divider === undefined) {
      nextDivider.style.position = "absolute";
      setNextDivider(nextDivider);
    }
    const height = element.clientHeight + "px";
    element.style.height = height;
    element.style.transitionProperty = "none";
    element.style.boxShadow = "2px 2px 10px rgba(85, 85, 85, 1)";
    element.style.zIndex = "20";
    element.style.left = element.offsetLeft + "px";
    element.style.top = element.offsetTop + "px";
    element.style.marginTop = "0px";
    element.style.marginLeft = "0px";
    element.style.position = "absolute";
  };

  const setMouseMoveStyles = () => {
    mouseDownElement.style.marginTop = "0px";
  };

  const setMouseUpBoardStyles = () => {
    // console.log("globalCoords.x, globalCoords.y:", { x: globalCoords.x, y: globalCoords.y });
    // console.log("offsetLeft.x, offsetLeft.y:", { x: windowCoords.x, y: windowCoords.y });
    // console.log("findElement:", findElement);

    if (findElement !== null) {
      mouseDownElement.style.left = findElement.left + "px";
      mouseDownElement.style.top = findElement.top + marginTopElement + "px"; // margin-top compensation
    } else {
      mouseDownElement.style.left = windowCoords.x + "px";
      mouseDownElement.style.top = windowCoords.y + "px";
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
      mouseDownElement.style.width = "";
      mouseDownElement.style.position = "";
    }, effectWait);

    setTimeout(() => {
      mouseDownElement.style.zIndex = "";
    }, effectWait * 2);
  };

  const setMouseUpCardStyles = () => {
    // console.log("globalCoords.x, globalCoords.y:", { x: globalCoords.x, y: globalCoords.y });
    // console.log("offsetLeft.x, offsetLeft.y:", { x: windowCoords.x, y: windowCoords.y });
    // console.log("findElement:", findElement);

    if (findElement !== null) {
      mouseDownElement.style.left = findElement.left + "px";
      mouseDownElement.style.top = findElement.top + "px";
    } else {
      mouseDownElement.style.left = windowCoords.x + "px";
      mouseDownElement.style.top = windowCoords.y + "px";
    }

    mouseDownElement.style.transitionProperty = "left, top, box-shadow";
    mouseDownElement.style.transitionDuration = effectWait + "ms";
    mouseDownElement.style.transitionTimingFunction = "linear";

    // console.log("nextDivider:", nextDivider);

    setTimeout(() => {
      mouseDownElement.style.boxShadow = "0 1px 3px 0 rgb(0, 0, 0, 0.1), 0 1px 2px -1px rgb(0, 0, 0, 0.1)";
      mouseDownElement.style.transitionProperty = "none";
      mouseDownElement.style.left = "0px";
      mouseDownElement.style.top = "0px";
      mouseDownElement.style.marginTop = "4px";
      mouseDownElement.style.height = "";
      mouseDownElement.style.position = "";
      if (nextDivider !== null) {
        nextDivider.style.position = "";
      }
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

    console.log("mouseDownElement:", {
      id: element.dataset.id,
      order: element.dataset.order,
      type: element.dataset.type
    });

    // e.clientX - координата указателя мыши по оси X относительно окна
    // e.clientY - координата указателя мыши по оси Y относительно окна
    setGlobalCoords({
      x: e.screenX,
      y: e.screenY
    });
    // e.target.offsetLeft - координата смещения окна по X относительно родительского окна
    // e.target.offsetTop - координата смещения окна по Y относительно родительского окна
    setWindowCoords({
      x: element.offsetLeft,
      y: element.offsetTop
    });

    if (element) {
      setPhantomData({ id: element.dataset.id, order: element.dataset.order });
    }

    switch (element.id) {
      case "board-to-drag":
        boardToDrag(e, element);
        break;
      case "card-to-drag":
        cardToDrag(e, element);
        break;
      default:
    }
  };

  const boardToDrag = (e, element) => {
    setMouseDownBoardStyles(e, element);

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

    dispatch(addPhantomBoard({ order, height }));
  };

  const cardToDrag = (e, element) => {
    setMouseDownCardStyles(e, element);

    const height = 0;
    const boardId = element.dataset.boardId;
    const divided = element.dataset.divided;
    const order = element.dataset.order;
    dispatch(addPhantomCard({ boardId, order, divided, height }));
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

    mouseDownElement.style.left = windowCoords.x + mouseShiftX + "px";
    mouseDownElement.style.top = windowCoords.y + mouseShiftY + "px";

    // directionY > 0 - down, < 0 - up
    // directionX > 0 - right, < 0 - left
    // let directionY = e.screenY - lastScreenY;
    // let directionX = e.screenX - lastScreenX;
    // setLastScreenY(e.screenY);
    // setLastScreenX(e.screenX);

    // console.log('globalCoords.y:', globalCoords.y);
    // console.log('e.screenY:', e.screenY);
    // console.log('lastScreenY:', lastScreenY);
    // console.log('directionY:', directionY);
    // console.log("mouseDownElement.id:", mouseDownElement.id);
    // console.log('=============');

    switch (mouseDownElement.id) {
      case "board-to-drag":
        moveBoard(e, mouseDownElement);
        break;
      case "card-to-drag":
        moveCard(e, mouseDownElement);
        break;
      default:
    }
  };

  const moveBoard = (e) => {
    const findEnterElement = domElements.filter((elem) => {
      if (elem.top <= e.clientY && e.clientY <= elem.bottom) {
        setNextFind(true);
        return true;
      } else {
        return false;
      }
    })[0];

    if (
      nextFind &&
      findEnterElement !== undefined &&
      findEnterElement.id !== phantomData.id
    ) {
      setFindElement(findEnterElement);
      // console.log("domElements:", domElements);
      dispatch(
        swapBoards({
          sourceOrder: phantomData.order,
          destinationOrder: findEnterElement.order
        })
      );
      setNextFind(false);
    }
  };

  const moveCard = (e) => {
    let findEnterElement = [];

    domElements.map((board) => {
      if (board.id === phantomData.boardId) {
        findEnterElement = board.cards.filter((card) => {
          if (card.left <= e.clientX && e.clientX <= card.right) {
            setNextFind(true);
            return true;
          } else {
            return false;
          }
        })[0];
      }
      return board;
    });

    // console.log("findEnterElement:", findEnterElement);
    // console.log("phantomData.id:", phantomData.id);

    if (
      nextFind &&
      findEnterElement !== undefined &&
      findEnterElement.id !== `card#${phantomData.id}`
    ) {
      console.log("findEnterElement.id:", findEnterElement.id);
      setFindElement(findEnterElement);

      dispatch(
        swapCards({
          boardId: phantomData.boardId,
          sourceOrder: phantomData.order,
          destinationOrder: findEnterElement.order
        })
      );
      setNextFind(false);
    }
  };

  const mouseUp = (e) => {
    if (mouseDownElement !== null) {
      setMouseDownElement(null);
      console.log("phantomData:", phantomData);
      console.log("mouseDownElement:", mouseDownElement);
      // console.log("mouseDownElement:", { ...mouseDownElement });
      // console.log("findElement:", findElement);

      switch (mouseDownElement.id) {
        case "board-to-drag":
          pantomBoard(e);
          break;
        case "card-to-drag":
          pantomCard(e);
          break;
        default:
      }
      setFindElement(null);
    }
  };

  const pantomBoard = (e) => {
    setMouseUpBoardStyles();
    setTimeout(() => {
      dispatch(
        removePhantomBoard({
          fromBoardId: mouseDownElement.dataset.id,
          toBoardOrder: phantomData.order
        })
      );
    }, effectWait);
  };

  const pantomCard = (e) => {
    setMouseUpCardStyles();
    
    console.log("phantomData:", phantomData);

    setTimeout(() => {
      dispatch(
        removePhantomCard({
          boardId: phantomData.boardId,
          fromCardId: mouseDownElement.dataset.id,
          toCardOrder: phantomData.order
        })
      );
    }, effectWait);
  };

  return (
    <div
      id={boardId}
      data-order={order}
      className='w-full -[flex-basis:content] -border border-red-400 -text-white'
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseMove={mouseMove}
    >
      {children}
    </div>
  );
};
