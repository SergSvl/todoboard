import React from 'react';

export const Popover = ({ children, clickOut, type = '' }) => {
  let styleWindow = 'bg-slate-50 p-4 sm:p-8 rounded-md max-h-[90vh] border z-30 flex flex-col overflow-y-auto';
  if (type === 'confirm') {
    styleWindow = styleWindow + 'w-[300px] min-w-[100px] sm:min-w-[200px] md:min-w-[250px] xl:min-w-[300px] mx-4';
  } else {
    styleWindow = styleWindow + 'w-[300px] w-fit mx-[20px] sm:w-[500px] md:w-[650px] xl:min-w-[950px] w-min mx-4';
  }
  return (
    <>
      <div className="w-full h-full top-0 bottom-0 left-0 right-0 fixed bg-gray-400/40 z-20 flex content-center items-center justify-center"
        onClick={clickOut}
        onDragStart={(e) => e.stopPropagation()}
      >
        <div className={styleWindow}
          onClick={(e) => e.stopPropagation()}
          onDragStart={(e) => e.stopPropagation()}
        >{children}</div>
      </div>
    </>
  )
}