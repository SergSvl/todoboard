import React from 'react';

export const Popover = ({ children, clickOut }) => {
  return (
    <>
      <div className="top-[3rem] bottom-0 left-0 right-0 fixed bg-gray-400/40 z-20" onClick={clickOut}></div>
      <div className="absolute bottom-0 left-0 right-0 top-0 m-auto w-[500px] h-fit bg-white p-8 my-14 rounded-md border z-30 flex flex-wrap transition-transform">
        {children}
      </div>
    </>
  )
}