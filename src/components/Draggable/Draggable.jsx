import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import useDraggable from "@/hooks/useDraggable";
import lang from '@/locales/ru/common.json';
import { removeDivider } from "@/store/main/mainSlice";

export const Draggable = ({ children }) => {
  const [mouseDownElement, setMouseDownElement] = useState(null);
  const [mouseMoveElement, setMouseMoveElement] = useState(null);
  const [mouseUpElement, setMouseUpElement] = useState(null);
  const [globalCoords, setGlobalCoords] = useState({x: 0, y: 0});
  const [localCoords, setLocalCoords] = useState({x: 0, y: 0});
  const [windowCoords, setWindowCoords] = useState({x: 0, y: 0});
  const wait = '300';

  useEffect(() => {
    // console.log('Mouse Events:', { mouseDownElement, mouseUpElement, mouseMoveElement });
    // console.log('globalCoords:', globalCoords);
    // console.log('localCoords:', localCoords);
    // console.log('windowCoords:', windowCoords);
  }, [mouseDownElement, mouseUpElement, mouseMoveElement, globalCoords, localCoords, windowCoords]);

  const restoreStyles = () => {
    mouseDownElement.style.transitionProperty = 'left, top, box-shadow';
    mouseDownElement.style.transitionTimingFunction = 'linear';
    mouseDownElement.style.transitionDuration = wait + 'ms';
    mouseDownElement.style.boxShadow = '0px 0px 0px gray';
    mouseDownElement.style.left = '0px';
    mouseDownElement.style.top = '0px';
    setTimeout(() => {
      mouseDownElement.style.zIndex = '';
    }, wait*5);
  }

  const setStyles = () => {
    mouseDownElement.style.transitionProperty = 'none';
    mouseDownElement.style.boxShadow = '2px 2px 10px gray';
  }

  const mouseDown = (e) => {
    // console.log('mouseDown:', e);
    console.log('e.target.id:', e.target.id);

    if (e.target.id !== 'board-to-drag' && e.target.id !== 'card-to-drag') {
      return;
    }
    setMouseDownElement(e.target);
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
      y: e.clientY,
    });
    setWindowCoords({
      x: e.target.offsetLeft,
      y: e.target.offsetTop,
    });
    
  }

  const mouseUp = (e) => {
    if (mouseDownElement !== null) {
      setMouseDownElement(null);
      restoreStyles();
    }
  }

  const mouseMove = (e) => {
    if (mouseDownElement !== null) {
      setStyles();
      const mouseShiftX = e.screenX - globalCoords.x;
      const mouseShiftY = e.screenY - globalCoords.y;

      // console.log('mouseDownElement:', mouseDownElement);
      console.log('windowCoords:', windowCoords);
      console.log('Mouse Shift:', { mouseShiftX, mouseShiftY });

      console.log('windowCoords X + mouseShiftX:', windowCoords.x + mouseShiftX);
      console.log('windowCoords Y + mouseShiftY:', windowCoords.y + mouseShiftY);

      mouseDownElement.style.left = mouseShiftX + 'px';
      mouseDownElement.style.top = mouseShiftY + 'px';
      mouseDownElement.style.zIndex = "20";
    }
  }

  const mouseOver = (e) => {
    if (mouseDownElement !== null) {
      // console.log('mouseOver:', e);
    }
  }
  
  return (
    <div
      className='w-full -[flex-basis:content] -border border-red-400'
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseMove={mouseMove}
      onMouseOver={mouseOver }
    >
      {children}
    </div>
  );

}