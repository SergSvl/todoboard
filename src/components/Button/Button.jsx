import React from 'react';
import lang from '@/locales/ru/common.json';

export const Button = ({ text, clickHandler, type = 'base' }) => {
  const baseClasses = 'rounded-md text-white py-2 px-6 mx-auto relative hover:transition-all duration-200';
  const baseStyle = 'bg-sky-400 hover:bg-sky-500';
  const dangerStyle = 'bg-red-400 hover:bg-red-500';
  const lightStyle = 'p-1 px-2 -my-1 bg-transparent text-gray-500 hover:text-gray-600 hover:transition-all duration-200';
  const tagStyle = 'p-0 pl-1 ml-1 -mr-2 bg-transparent text-gray-500 hover:text-gray-600 hover:transition-all duration-200 -border border-red-400';
  let resultClasses = '';
  const signBase = '-border border-red-400 font-thin text-xl px-0 ';
  const signDel = 'rotate-45 hover:transition-all duration-200 hover:font-extrabold z-10';
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
      resultClasses = `${lightStyle}`;
      signClasses = `${signBase} ${signDel}`;
      break;
    case 'tagDel':
      resultClasses = `${tagStyle}`;
      signClasses = `${signBase} ${signDel}`;
      break;
    default:
  }

  return (
    <>
      {type === 'lightAdd' || type === 'lightDel' || type === 'tagDel' ? (
        <button
          className={resultClasses}
          onClick={clickHandler}
        >
          <div className='flex justify-between items-center '>
            <div className={signClasses} title={type === 'tagDel' ? `${lang.removeTag}` : ''}>+</div><div className='text-base pl-1 break-normal'>{text}</div>
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