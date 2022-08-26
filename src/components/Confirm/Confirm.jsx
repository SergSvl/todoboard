import React from "react";
import Popover from '@/components/Popover';
import Button from "@/components/Button";

export const Confirm = ({ title, yesHandler, noHandler }) => {
  return (
    <Popover clickOut={noHandler} type='confirm'>
      <div className='w-full text-center mb-4 p-4 font-semibold'>{title}</div>
      <div className='flex'>
        <Button text={'Да'} clickHandler={yesHandler} type={'danger'}/>
        <Button text={'Нет'} clickHandler={noHandler} />
      </div>
    </Popover>
  );
}