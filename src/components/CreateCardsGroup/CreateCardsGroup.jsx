import React from "react";
import Popover from '@/components/Popover';
import Button from "@/components/Button";
import lang from '@/locales/ru/common.json';
import Input from "@/components/Input";

export const CreateCardsGroup = ({ inputRef, groupTitle, clickOutHandler, addGroupTitleHandler, onChangeGroupTitle }) => {

  return (
    <Popover clickOut={clickOutHandler}>
      <div className='w-full text-center mb-4 font-bold text-lg'>{lang.creatingNewCardGroup}</div>
      <div className='text-left mb-2 font-semibold'>{lang.groupTitle}:</div>
      <Input
        classProp='mb-8'
        inputRef={inputRef}
        value={groupTitle}
        onChangeHandler={(e) => addGroupTitleHandler(e.target.value)}
        onBlurHandler={onChangeGroupTitle}
      />
      <Button text={lang.create} clickHandler={onChangeGroupTitle} />
    </Popover>
  );
}