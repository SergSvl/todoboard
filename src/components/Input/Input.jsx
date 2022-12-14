import React from "react";

export const Input = ({ value, onChangeHandler, onBlurHandler = undefined, inputRef, type = '', classProp = '' }) => {
  const baseClasses = 'w-full border rounded-md h-8 px-2';
  const taskElemStyles = 'w-full border rounded-md h-6 px-2';
  let resultClasses = baseClasses;

  if (classProp) {
    resultClasses = `${baseClasses} ${classProp}`;
  }
  

  if (type === 'taskList') {
    resultClasses = taskElemStyles;
  }

  const onKeyDown = (e) =>{
    if (e.code === 'Enter') {
      onBlurHandler(e);
    }
  }

  return (
    <input
      className={resultClasses}
      ref={inputRef}
      value={value}
      onChange={(e) => onChangeHandler(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onBlur={onBlurHandler !== undefined ? (e) => onBlurHandler(e) : null}
      onKeyDown={onKeyDown}
    />
  );
}