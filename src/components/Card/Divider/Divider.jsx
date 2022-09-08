import React from "react";
import { useDispatch } from "react-redux";
import useDraggable from "@/hooks/useDraggable";
import lang from '@/locales/ru/common.json';
import { removeDivider } from "@/store/main/mainSlice";

export const Divider = ({ divider, cardOrder, boardId }) => {
  const { onDrop } = useDraggable();
  const dispatch = useDispatch();
  
  const baseStyles = 'min-h-[80px] mx-0 mt-1 mb-8 relative -border border-blue-400';
  const dropZoneStyles = 'min-h-[80px] -border border-green-400';
  const dividerStyles = 'min-w-[40px]';
  const noDividerStyles = 'min-w-[20px]';

  const resultStyles = divider === undefined
    ? `${baseStyles} ${noDividerStyles}`
    : `${baseStyles} ${dividerStyles}`;
  
  const onDeleteHandler = () => {
    dispatch(removeDivider({ cardOrder, boardId }));
  }

  return (
      <div className={resultStyles}
        data-divider={divider}
        draggable={false}
        onDrop={(e) => onDrop(e, divider !== undefined ? 'divider' : 'dropZone', null, boardId, cardOrder)}
        onDoubleClick={divider === undefined ? null : onDeleteHandler}
      >
        {divider === undefined ? (
          <div className={dropZoneStyles}></div>
        ) : (
        <div className="h-full flex"
          title={lang.removeDivider}
        >
          <div className='hover:bg-gray-100 hover:cursor-pointer border-r border-gray-400 w-[20px]'></div>
          <div className='hover:bg-gray-100 hover:cursor-pointer border-l border-gray-400 w-[20px]'></div>
        </div>
        )}
      </div>
  );
}