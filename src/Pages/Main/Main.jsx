import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initState } from "@/store/main/mainSlice";
import Board from '@/components/Board';

export const Main = () => {
  const { boards } = useSelector((state) => state.main);

  const Cards = [
    {
      title: '',
      description: '',
      tasks: {
        title: '',
        list: [
          {
            text: ''
          }
        ]
      }
    }
  ];
  
  const Board = [
    {
      title: '',
      cards: [
        ...Cards
      ],
    }
  ]

  console.log("boards", boards);

  const addBoardHandler = () => {

  }

  useEffect(() => {

  }, []);

  return (
    <>
      <div className='h-12 mt-12 fixed -border-2 top-0 left-0 right-0 bg-gray-100'>
        <button className='btn border border-sky-200 p-1 px-2 m-1 sm:mr-6 rounded-md absolute right-0 bg-sky-400 text-white' onClick={addBoardHandler}>Добавить группу</button>
      </div>

      <div className='container flex mx-auto mt-24 bg-gray-100 p-4 border'>
        {boards && (
          boards.map((board) => {
            return <Board key={board.title} />;
          })
        )}
      </div>
    </>
  );
};
