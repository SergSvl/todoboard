import React from "react";
import Button from "@/components/Button";

export const Tags = ({ tags, openModalHandler, deleteTagHandler = null }) => {
  const clickHandler = (e, tagId) => {
    e.stopPropagation();
    deleteTagHandler(tagId);
  }

  let onOpenModalHandler = () => {};

  if (openModalHandler !== null) {
    onOpenModalHandler = (tag) => openModalHandler(tag);
  }

  return (
    <div className='w-full flex flex-wrap justify-start font-thin text-sm text-sky-400 whitespace-pre-wrap break-all px-1 py-2 -border'>
      {tags && tags.map((tag) => {
        return (
            <div key={tag.id} className={`flex items-center border rounded-xl mr-1 mb-1 h-6 px-2 text-slate-700 hover:bg-cyan-500 hover:text-cyan-100 hover:transition-all duration-200 ${openModalHandler !== null ? 'hover:cursor-pointer' : ''}  ${tag.color}`}>
              <div className='max-w-[6rem] whitespace-nowrap overflow-hidden text-ellipsis' onClick={onOpenModalHandler}>#{tag.text}</div>
              <Button text={''} clickHandler={(e) => clickHandler(e, tag.id)} type={'tagDel'} />
            </div>
        )
      })}
    </div>
  );

}