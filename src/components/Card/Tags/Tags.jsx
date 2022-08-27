import React, { useEffect, useState, useRef } from "react";
import { Colors } from '@/components/Card/Tags/Colors';

export const Tags = ({ tags }) => {

  // console.log("Tags tags:", tags);

  return (
    <div className='w-full flex flex-wrap justify-start font-thin text-sm text-sky-400 whitespace-pre-wrap break-all -border'>
      {tags && tags.map((tag) => {
        return (
          <div key={tag.id} className={`border rounded-xl mr-1 px-2 text-slate-700 hover:bg-cyan-500 hover:text-cyan-100 hover:transition-all duration-200 hover:cursor-pointer ${tag.color}`}>#{tag.text}</div>
        )
      })}
    </div>
  );

}