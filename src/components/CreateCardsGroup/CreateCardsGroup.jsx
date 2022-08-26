import React from "react";
import Popover from '@/components/Popover';
import Button from "@/components/Button";

export const CreateCardsGroup = ({ groupTitle, clickOutHandler, addGroupTitleHandler, onChangeGroupTitle }) => {

  return (
    <Popover clickOut={clickOutHandler}>
      <div className='w-full text-center mb-4 font-bold text-lg'>Создание новой группы карточек</div>
      <div className='text-center mb-2 font-semibold'>Заголовок группы:</div>
      <input className='w-full border rounded-md h-8 px-2 mb-4'
        value={groupTitle}
        onChange={(e) => addGroupTitleHandler(e.target.value)}
      />
      <Button text={'Создать'} clickHandler={onChangeGroupTitle} />
    </Popover>
  );
}