import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPhantomBoard,
  addPhantomCard,
  addPhantomCardOnce,
  resetFlagIsPhantomCreatedOnce,
  removePhantomCardAndReplaceCardToOtherBoard,
  removePhantomBoard,
  removePhantomCard,
  swapBoards,
  swapCards
} from "@/store/main/mainSlice";

export const Draggable = ({ boards, order, boardId, children }) => {
  const dispatch = useDispatch();
  const { isPhantomCreatedOnce } = useSelector((state) => state.main);
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
  const [isPhantomCardAdded, setIsPhantomCardAdded] = useState(false);

  useEffect(() => {
    const getCardElements = (boardId) => {
      const elementBorders = [];
      const parentBoards = document.getElementById("boardsParent");
      const cardsNode = document.getElementById(`cardsParent#${boardId}`);

      if (cardsNode) {
        const elements = cardsNode.childNodes;
        const boardMarginLeft = parentBoards.offsetLeft;

        for (let i = 0; i < elements.length; i++) {
          const defaultCardWidth = 300;
          const resultCardWidth =
            mouseDownElement !== null
              ? mouseDownElement.clientWidth
              : defaultCardWidth;
          const resultLeft = elements[i].offsetLeft + boardMarginLeft; // adaptive compensation
          const resultRight =
            elements[i].offsetLeft + boardMarginLeft + resultCardWidth;

          // console.log("elements["+i+"]:", elements[i]);
          console.log("elements["+i+"].id:", elements[i].id);
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
              order: parseFloat(elements[i].dataset.order),
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
                order: parseFloat(elements[i].dataset.order)
              });
            }
          }
        }
      }
      // console.log("elementBorders:", elementBorders);
      return elementBorders;
    };

    const getBoardElements = () => {
      let element = "";
      const elements = document.getElementById("boardsParent").childNodes;

      if (elements[0].firstElementChild === null) {
        element = elements[0];
      } else {
        element = elements[0].firstElementChild;
      }

      const margins =
        parseFloat(getComputedStyle(element).marginTop) +
        parseFloat(getComputedStyle(element).marginBottom);
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
            order: parseFloat(elements[i].dataset.order),
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
            setPhantomData({
              id: phantomId,
              order: parseFloat(elements[i].dataset.order)
            });
          }
        }
      }
      console.log("setDomElements:", elementBorders);
      setDomElements(elementBorders);
    }
    getBoardElements();
  }, [boards, mouseDownElement, marginTopElement, phantomId]);

  useEffect(() => {
    setEffectWait(300);
  }, []);

  useEffect(() => {
    // console.log("domElements:", domElements);
    console.log(":: phantomData:", phantomData);
  }, [
    // domElements,
    phantomData
  ]);

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

    // const top = parseFloat(getComputedStyle(element).top);
    // const left = parseFloat(getComputedStyle(element).left);
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
      mouseDownElement.style.boxShadow =
        "0 1px 3px 0 rgb(0, 0, 0, 0.1), 0 1px 2px -1px rgb(0, 0, 0, 0.1)";
      mouseDownElement.style.transitionProperty = "none";
      mouseDownElement.style.left = "0px";
      mouseDownElement.style.top = "0px";
      mouseDownElement.style.marginTop = "4px";
      mouseDownElement.style.height = "";
      mouseDownElement.style.position = "";
      if (nextDivider !== null) {
        nextDivider.style.position = "";
      }
    }, effectWait * 3);

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
      order: parseFloat(element.dataset.order),
      type: element.dataset.type
    });
    // e.target.offsetLeft - координата смещения окна по X относительно окна экрана
    // e.target.offsetTop - координата смещения окна по Y относительно окна экрана
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
      setPhantomData({
        id: element.dataset.id,
        order: parseFloat(element.dataset.order)
      });
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
        acc = parseFloat(elem.bottom) - parseFloat(elem.top);
        // console.log("elem.id:", elem.id);
        // console.log("parseFloat(elem.top):", parseFloat(elem.top));
        // console.log("parseFloat(elem.bottom):", parseFloatat(elem.bottom));
        // console.log("height:", parseFloat(elem.bottom) - parseFloat(elem.top));
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
    dispatch(
      addPhantomCard({
        boardId,
        order,
        divided,
        height,
        isPhantomAddOnce: false
      })
    );
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

    // console.log('globalCoords.y:', globalCoords.y);
    // console.log('e.screenY:', e.screenY);
    // console.log('lastScreenY:', lastScreenY);
    // console.log('directionY:', directionY);
    // console.log("mouseDownElement.id:", mouseDownElement.id);
    // console.log('=============');

    switch (mouseDownElement.id) {
      case "board-to-drag":
        moveBoard(e);
        break;
      case "card-to-drag":
        moveCard(e);
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

    // console.log("board findEnterElement:", findEnterElement);
    // console.log("board phantomData.id:", phantomData.id);

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
    moveCardOnTheBoard(e);
    moveCardBetweenBoards(e);
  };

  const moveCardOnTheBoard = (e) => {
    let findEnterCardElement = [];

    domElements.map((board) => {
      if (board.id === phantomData.boardId) {
        findEnterCardElement = board.cards.filter((card) => {
          // e.clientX - координата указателя мыши по оси X относительно окна
          // e.clientY - координата указателя мыши по оси Y относительно окна
          if (card.left <= e.clientX && e.clientX <= card.right) {
            setNextFind(true);
            return true;
          } else {
            return false;
          }
        })[0];
      }
    });

    if (
      nextFind &&
      findEnterCardElement !== undefined &&
      findEnterCardElement.id !== `card#${phantomData.id}`
    ) {
      // console.log("findEnterCardElement.id:", findEnterCardElement.id);
      setFindElement(findEnterCardElement);

      dispatch(
        swapCards({
          boardId: phantomData.boardId,
          sourceOrder: phantomData.order,
          destinationOrder: findEnterCardElement.order,
          isPhantomAddOnce: false
        })
      );
      setNextFind(false);
    }
  };

  const moveCardBetweenBoards = (e) => {
    // Нахождение доски, на которую наехал курсор
    const findEnterBoardElement = domElements.filter((elem) => {
      if (elem.top <= e.clientY && e.clientY <= elem.bottom) {
        return true;
      } else {
        return false;
      }
    })[0];

    if (
      findEnterBoardElement !== undefined &&
      findEnterBoardElement.id !== phantomData.boardId
    ) {
      // console.log("++ findEnterBoardElement:", findEnterBoardElement);

      // удаление фантома с доски, с которой поднята карточка
      dispatch(
        removePhantomCard({
          boardId: phantomData.boardId,
          fromCardId: mouseDownElement.dataset.id,
          toCardOrder: 1
        })
      );

      // теперь нужно сдлеать так, словно я кликаю по этой же карточке, только на другой доске, а значит, нужно добавить фантом с другим ID доски

      // console.log("__ isPhantomCreatedOnce:", isPhantomCreatedOnce);

      // Создание фантома только один раз на текущей доске
      const height = 0;
      const boardId = findEnterBoardElement.id;
      const divided = mouseDownElement.dataset.divided;
      const order = mouseDownElement.dataset.order;
      dispatch(
        addPhantomCardOnce({
          boardId,
          order,
          divided,
          height
        })
      );

      // let phantomElement = null;

      // здесь нужно в domElements найти фантом с доски, на которую я перетащил карточку и получить его координаты top и left для последнего дейсвтия с карточкой - восстановления стилей  нового положения, куда ей нужно лететь

      // Нахождение фантома на другой доске, чтобы получить его стили для перелета карточки в новые коодинаты
      domElements.map((board) => {
        if (board.id === findEnterBoardElement.id) {
          setFindElement(
            board.cards.filter((card) => card.id === "card#phantom")
          );
          // phantomElement = board.cards.filter((card) => card.id === 'card#phantom');
        }
      });

      // console.log("__ findEnterBoardElement:", findEnterBoardElement);
      // console.log("__ findEnterBoardElement !== undefined && findEnterBoardElement.id !== sourceBoardId && !isPhantomCreatedOnce:", findEnterBoardElement !== undefined && findEnterBoardElement.id !== sourceBoardId && !isPhantomCreatedOnce);

      // console.log("card mouseDownElement.dataset.id:", mouseDownElement.dataset.id);

      // console.log("card phantomData:", phantomData);
      // console.log("card domElements:", domElements);
    } else {
      dispatch(resetFlagIsPhantomCreatedOnce());
    }
  };

  const mouseUp = (e) => {
    if (mouseDownElement !== null) {
      setMouseDownElement(null);
      switch (mouseDownElement.id) {
        case "board-to-drag":
          phantomBoard(e);
          break;
        case "card-to-drag":
          phantomCard(e);
          break;
        default:
      }
      setFindElement(null);
    }
  };

  const phantomBoard = (e) => {
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

  const phantomCard = (e) => {
    setMouseUpCardStyles();

    // console.log("phantomData:", phantomData);
    // console.log("mouseDownElement.dataset.boardId:", mouseDownElement.dataset.boardId);
    // здесь нужно определять, что доска сменилась при перетаскивании карточки и след-но вызывать другой метод removePhantomCardAndReplaceCardToOtherBoard(),
    // который будет доставать карточку из старой доски и помещать в новую
    
    setTimeout(() => {
      if (mouseDownElement.dataset.boardId === phantomData.boardId) {
        dispatch(
          removePhantomCard({
            boardId: phantomData.boardId,
            fromCardId: mouseDownElement.dataset.id,
            toCardOrder: phantomData.order
          })
        );
      } else {
        dispatch(
          removePhantomCardAndReplaceCardToOtherBoard({
            fromBoardId: mouseDownElement.dataset.boardId,
            toBoardId: phantomData.boardId,
            cardId: mouseDownElement.dataset.id,
            toCardOrder: phantomData.order
          })
        );
      }
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
