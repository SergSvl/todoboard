import React from 'react';

export const Popover = ({ children, clickOut, type = '' }) => {
  let styleWindow = 'bg-slate-50 p-4 rounded-md [max-height:calc(100vh-10%)] border z-30 flex flex-wrap overflow-y-auto';
  if (type === 'confirm') {
    styleWindow = styleWindow + 'w-[300px] min-w-[100px] sm:min-w-[200px] md:min-w-[250px] xl:min-w-[300px]';
  } else {
    styleWindow = styleWindow + 'w-[500px] min-w-[300px] sm:min-w-[450px] md:min-w-[750px] xl:min-w-[950px]';
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