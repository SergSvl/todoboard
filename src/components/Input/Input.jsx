import React from "react";

export const Input = ({ value, onChangeHandler, onBlurHandler = undefined, inputRef }) => {
  console.log("Input value:", value);
  return (
    <input
      className='w-full border rounded-md h-6 px-2 mb-4'
      ref={inputRef}
      value={value}
      // onChange={onChangeHandler}
      // onChange={(value) => onChangeHandler(value)}
      onChange={(e) => onChangeHandler(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onBlur={onBlurHandler !== undefined ? (e) => onBlurHandler(e) : null}
    />
  );
}