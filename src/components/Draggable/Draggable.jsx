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
  // const { isPhantomCreatedOnce } = useSelector((state) => state.main);
  const [mouseDownElement, setMouseDownElement] = useState(null);
  const [nextDivider, setNextDivider] = useState(null);
  const [phantomData, setPhantomData] = useState(null);
  const [foundElement, setFoundElement] = useState(null);
  const [marginTopElement, setMarginTopElement] = useState(16);
  const [mouseDownElementId, setMouseDownElementId] = useState(null);
  const [mouseDownElementOrder, setMouseDownElementOrder] = useState(null);
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [windowCoords, setWindowCoords] = useState({ x: 0, y: 0 });
  const [domElements, setDomElements] = useState([]);
  const [effectWait, setEffectWait] = useState([]);
  const [phantomId, setPhantomId] = useState("phantom");
  const [nextFind, setNextFind] = useState(false);

  useEffect(() => {
    const getCardElements = (boardId) => {
      const elementBorders = [];
      const cardsNode = document.getElementById(`cardsParent#${boardId}`);

      if (cardsNode) {
        const elements = cardsNode.childNodes;

        for (let i = 0; i < elements.length; i++) {
          const defaultCardWidth = 300;
          const resultCardWidth =
            mouseDownElement !== null
              ? mouseDownElement.clientWidth
              : defaultCardWidth;
          const resultRight =
            elements[i].getBoundingClientRect().left + resultCardWidth;

          // console.log("elements["+i+"]:", elements[i]);
          // console.log("elements["+i+"].id:", elements[i].id);
          // console.log("elements[i].offsetTop:", elements[i].offsetTop);
          // console.log("getBoundingClientRect().top:", elements[i].getBoundingClientRect().top);
          // console.log("getBoundingClientRect().left:", elements[i].getBoundingClientRect().left);
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
              left: elements[i].offsetLeft,
              // top: elements[i].getBoundingClientRect().top,
              // left: elements[i].getBoundingClientRect().left,
              right: resultRight
            });
          }

          // console.log("Проверка elements["+i+"].id:", elements[i].id);
          // console.log("Его dataset.id:", elements[i].dataset.id);
          // console.log("Его dataset.order:", elements[i].dataset.order);

          if (!elements[i].id) {
            // console.log("card elements["+i+"].id:", elements[i].id);
            // console.log("card elements["+i+"].dataset.order:", elements[i].dataset.order);
            
            if (elements[i].dataset.order !== undefined) {
              // console.log("Запоминаем фантом карты на доске:", boardId);
              // console.log("elements["+i+"].offsetTop:", elements[i].offsetTop);
              // console.log("elements["+i+"].offsetLeft:", elements[i].offsetLeft);

              setPhantomData({
                boardId,
                id: phantomId,
                order: parseFloat(elements[i].dataset.order),
                top: elements[i].offsetTop,
                left: elements[i].offsetLeft,
              });

              // setPhantomCardData({
              //   top: elements[i].offsetTop,
              //   left: elements[i].offsetLeft,
              // });
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
            // console.log("Запоминаем фантом доски:", elements[i].dataset.id);
            setPhantomData({
              id: phantomId,
              order: parseFloat(elements[i].dataset.order)
            });
          }
        }
      }
      // console.log("setDomElements:", elementBorders);
      setDomElements(elementBorders);
    }
    getBoardElements();
  }, [boards, mouseDownElement, marginTopElement, phantomId]);

  useEffect(() => {
    setEffectWait(300);
  }, []);

  useEffect(() => {
    const resultTop = getRightTopCardPosition();

    const resultFoundElement = {
      ...foundElement,
      left: phantomData !== null ? phantomData.left : 0,
    }

    console.log("Изменены domElements:", domElements);
    console.log("Изменена phantomData:", phantomData);
    console.log("Изменены mouseDownElement:", mouseDownElement);
    console.log(":: resultTop:", resultTop);
    // console.log(":: foundElement:", foundElement);
    console.log("==> resultFoundElement:", resultFoundElement);

    if (resultTop !== null) {
      setFoundElement({
        ...resultFoundElement,
        top: resultTop,
      });
    } else {
      // при переносе карточек с нижней доски на верхнюю это работает правильно,
      // а наоборот, с верхней - на нижнюю, правильно работает только положение left, top - ломается
      // 1) Для первой карточки на доске, этот метод не срабатывает, а срабатывает только moveCardBetweenBoards
      // 2) А когда на доске уже есть карточка(и), то он срабатывает при первом же наезде на доску
      // След-но, оба эти метода должны одинаково правильно определять позицию top
      setFoundElement({...resultFoundElement});
    }
  }, [
    domElements,
  ]);

  const getRightTopCardPosition = () => {
    if (mouseDownElement !== null) {
      const startCardParent = mouseDownElement.parentElement;
      const phantomDomElement = document.querySelector('.card_phantom');
      let resultTop = 40;
      const cardMarginTop = 4;

      if (phantomDomElement !== null) {
        const finishCardParent = phantomDomElement.parentElement;

        const start = startCardParent.getBoundingClientRect().top;
        const finishTop = finishCardParent.getBoundingClientRect().top;
        const finishMarginTop = finishCardParent.offsetTop + cardMarginTop;
        const shiftParent = Math.abs(finishTop - start);

        if (start < finishTop) {
          resultTop = shiftParent + finishMarginTop;
        } else if (start > finishTop) {
          resultTop = -shiftParent + finishMarginTop;
        }

        console.log("<<>> start top:", start);
        console.log("<<>> finish top:", finishTop);
        // console.log("<<>> finishMarginTop:", finishMarginTop);
        console.log("<<>> shiftParent:", shiftParent);
      } else {
      }

      return resultTop;
    }
    return null;
  }

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
  };

  const setMouseDownCardStyles = (e, element) => {
    const nextDivider = element.nextElementSibling;
    // console.log("nextDivider.dataset.divider:", nextDivider.dataset.divider);

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
    if (foundElement !== null) {
      mouseDownElement.style.left = foundElement.left + "px";
      mouseDownElement.style.top = foundElement.top + marginTopElement + "px"; // margin-top compensation
    } else {
      mouseDownElement.style.left = windowCoords.x + "px";
      mouseDownElement.style.top = windowCoords.y + "px";
    }

    mouseDownElement.style.transitionProperty = "left, top, box-shadow";
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
    if (foundElement !== null) {
      console.log("Восстановление стилей:", foundElement);

      mouseDownElement.style.left = foundElement.left + "px";
      mouseDownElement.style.top = foundElement.top + "px";
    } else {
      mouseDownElement.style.left = windowCoords.x + "px";
      mouseDownElement.style.top = windowCoords.y + "px";
    }

    mouseDownElement.style.transitionProperty = "left, top, box-shadow";
    mouseDownElement.style.transitionDuration = effectWait + "ms";
    mouseDownElement.style.transitionTimingFunction = "linear";

    // return;

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

  const mouseDown = (e) => {
    if (e.target.id !== "board-to-drag" && e.target.id !== "card-to-drag") {
      return;
    }

    const element = e.target;
    setMouseDownElement(element);
    setMouseDownElementId(element.dataset.id);
    setMouseDownElementOrder(element.dataset.order);

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

    // const boardId = element.dataset.id;
    const order = element.dataset.order;

    // const height = domElements.reduce((acc, elem) => {
    //   if (elem.id === boardId) {
    //     acc = parseFloat(elem.bottom) - parseFloat(elem.top);
    //     // console.log("elem.id:", elem.id);
    //     // console.log("parseFloat(elem.top):", parseFloat(elem.top));
    //     // console.log("parseFloat(elem.bottom):", parseFloatat(elem.bottom));
    //     // console.log("height:", parseFloat(elem.bottom) - parseFloat(elem.top));
    //   }
    //   return acc;
    // }, 0);

    dispatch(addPhantomBoard({ order }));
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

    if (
      nextFind &&
      findEnterElement !== undefined &&
      findEnterElement.id !== phantomData.id
    ) {

      // it is calculation an absolute position of board here, only here
      setFoundElement(findEnterElement);

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
      setNextFind(false);
      dispatch(
        swapCards({
          boardId: phantomData.boardId,
          sourceOrder: phantomData.order,
          destinationOrder: findEnterCardElement.order,
          isPhantomAddOnce: false
        })
      );
    }
  };

  const moveCardBetweenBoards = (e) => {
    // there are finding the board that cursor was moved on
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
      dispatch(
        removePhantomCard({
          boardId: phantomData.boardId,
          fromCardId: mouseDownElement.dataset.id,
          toCardOrder: 1
        })
      );

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
      setFoundElement(null);
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
