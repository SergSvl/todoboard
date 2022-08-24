import React from "react";
import Popover from '@/components/Popover';

export const Confirm = ({ title, yesHandler, noHandler }) => {
  return (
    <Popover clickOut={noHandler}>
      <div className='w-full text-center mb-4 p-4 font-semibold'>{title}</div>
      <button className='btn rounded-md bg-red-400 text-white py-2 px-8 mx-auto relative' onClick={yesHandler}>Да</button>
      <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={noHandler}>Нет</button>
    </Popover>
  );
}