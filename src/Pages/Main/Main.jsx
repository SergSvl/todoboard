import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initState, setBoard } from "@/store/main/mainSlice";
import Board from '@/components/Board';
import { getLSData } from "@/utils/helpers/local-storage-helpers";
import { LOCAL_STORAGE_KEYS } from "@/utils/local-storage-keys";
import Popover from '@/components/Popover';

export const Main = () => {
  const { boards } = useSelector((state) => state.main);
  const dispatch = useDispatch();
  const [isAddTitleOpenned, setIsAddTitleOpenned] = useState(false);
  const [isDeleteBoardsOpenned, setIsDeleteBoardsOpenned] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  
  const newBoard = {
    id: '',
    order: '',
    title: '',
    cards: [],
  }

  console.log("boards", boards);
  // console.log("newBoard", newBoard);

  const addBoardHandler = () => {
    setIsAddTitleOpenned(true);
    setGroupTitle(`Новая группа №${boards.length+1}`);
  }

  const deleteBoardsHandler = () => {
    setIsDeleteBoardsOpenned(true);
    // setGroupTitle(`Новая группа №${boards.length+1}`);
  }

  const onDeleteBoards = () => {
    setIsDeleteBoardsOpenned(false);
    dispatch(initState([]));
  }

  const addGroupTitleHandler = (value) => {
    setGroupTitle(value);
  }
  
  const onChangeGroupTitle = () => {
    setIsAddTitleOpenned(false);
    newBoard.id = `group#${Date.now()}`;
    newBoard.order = `${boards.length+1}`;
    newBoard.title = groupTitle;
    dispatch(setBoard(newBoard));
  }

  const clickOutHandler = () => {
    setIsAddTitleOpenned(false);
    setIsDeleteBoardsOpenned(false);
  }

  const deleteBoard = (cardId) => {
    const filteredBoard = boards.filter((board) => board.id !== cardId ? true : false);

    let counter = 1;

    const orderedBoard = filteredBoard.map((board) => {
      const newBoard = {...board};
      newBoard.order = ''+counter++;
      return newBoard;
    });
    // console.log("filteredBoard::", orderedBoard);
    dispatch(initState([...orderedBoard]));
  }

  useEffect(() => {
    const initialization = () => {
      const boards = getLSData(LOCAL_STORAGE_KEYS.boards);
      console.log("initialization boards:", boards);

      if (typeof boards === "object" && boards !== null) {
        dispatch(initState([ ...boards ]));
      }
    }
    initialization();
  }, [dispatch]);

  return (
    <>
      <div className='w-full h-8 mt-12 fixed -border border-red-600 top-0 left-0 right-0 bg-gray-50/50 z-10'>
        <div className='container w-full mx-auto flex justify-between items-center'>
          <button className='btn p-1 px-2 -my-1 bg-transparent text-gray-500 hover:text-gray-600' onClick={addBoardHandler}>
            <div className='container w-full mx-auto flex justify-between items-center'>
              <div className='w-[1rem] -border border-red-400 font-thin text-xl px-0'>+</div><div className='text-base -border border-red-400 pl-1'>Добавить группу</div>
            </div>
          </button>
          <button className='btn p-1 px-2 -my-1 bg-transparent text-gray-500 hover:text-gray-600' onClick={deleteBoardsHandler}>
            <div className='container w-full mx-auto flex justify-between items-center'>
              <div className='w-[1rem] -border border-red-400 font-thin text-xl px-0 rotate-45'>+</div><div className='text-base -border border-red-400 pl-1'> Удалить все группы</div>
            </div>
          </button>
        </div>
      </div>

      <div className="w-full h-full backdrop-blur-sm">
        {isAddTitleOpenned && (
          <Popover clickOut={clickOutHandler}>
            <div className='w-full text-center mb-4 font-bold text-lg'>Создание новой группы карточек</div>
            <div className='text-center mb-2 font-semibold'>Заголовок группы:</div>
            <input className='w-full border rounded-md h-8 px-2 mb-4'
              value={groupTitle}
              onChange={(e) => addGroupTitleHandler(e.target.value)}
            />
            <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={onChangeGroupTitle}>OK</button>
          </Popover>
        )}

        {isDeleteBoardsOpenned && (
          <Popover clickOut={clickOutHandler}>
            <div className='w-full text-center mb-4 font-semibold'>Удалить все группы?</div>
            <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={() => onDeleteBoards()}>Да</button>
            <button className='btn rounded-md bg-sky-400 text-white py-2 px-8 mx-auto relative' onClick={clickOutHandler}>Нет</button>
          </Popover>
        )}

        <div className='container flex flex-wrap mx-auto mt-24 -border'>
          {boards && (
            boards.map((board) => {
              return <Board 
                key={board.id}
                board={board}
                deleteBoard={deleteBoard}
              />;
            })
          )}
        </div>
      </div>
    </>
  );
};
