import React from 'react';

export const Button = ({ text, clickHandler, type = 'base' }) => {
  const baseClasses = 'rounded-md text-white py-2 px-6 mx-auto relative';
  const baseStyle = 'bg-sky-400';
  const dangerStyle = 'bg-red-400';
  const lightStyle = 'p-1 px-2 -my-1 bg-transparent text-gray-500 hover:text-gray-600';
  let resultClasses = '';
  const signBase = 'w-[1rem] -border border-red-400 font-thin text-xl px-0 ';
  const signDel = 'rotate-45';
  let signClasses = '';

  switch (type) {
    case 'base':
      resultClasses = `${baseClasses} ${baseStyle}`;
      break;
    case 'danger':
      resultClasses = `${baseClasses} ${dangerStyle}`;
      break;
    case 'lightAdd':
      resultClasses = `${lightStyle}`;
      signClasses = `${signBase}`;
      break;
    case 'lightDel':
      resultClasses = `${lightStyle} `;
      signClasses = `${signBase} ${signDel}`;
      break;
    default:
  }

  return (
    <>
      {type === 'lightAdd' || type === 'lightDel' ? (
        <button
          className={resultClasses}
          onClick={clickHandler}
        >
          <div className='flex justify-between items-center'>
            <div className={signClasses}>+</div><div className='text-base -border border-red-400 pl-1'>{text}</div>
          </div>
        </button>
      ) : (
        <button
          className={resultClasses}
          onClick={clickHandler}
        >{text}</button>
      )}
    </>
  );
}