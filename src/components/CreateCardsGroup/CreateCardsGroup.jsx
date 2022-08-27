import React from "react";
import Popover from '@/components/Popover';
import Button from "@/components/Button";
import lang from '@/locales/ru/common.json';

export const CreateCardsGroup = ({ groupTitle, clickOutHandler, addGroupTitleHandler, onChangeGroupTitle }) => {

  return (
    <Popover clickOut={clickOutHandler}>
      <div className='w-full text-center mb-4 font-bold text-lg'>{`${lang.creatingNewCardGroup}`}</div>
      <div className='text-left mb-2 font-semibold'>{`${lang.groupTitle}`}:</div>
      <input className='w-full border rounded-md h-8 px-2 mb-4'
        value={groupTitle}
        onChange={(e) => addGroupTitleHandler(e.target.value)}
      />
      <Button text={`${lang.create}`} clickHandler={onChangeGroupTitle} />
    </Popover>
  );
}