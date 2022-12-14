import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initState, addBoard, removeBoard } from "@/store/main/mainSlice";
import Board from "@/components/Board";
import Confirm from "@/components/Confirm";
import CreateCardsGroup from "@/components/CreateCardsGroup";
import { getLSData } from "@/utils/helpers/local-storage-helpers";
import { LOCAL_STORAGE_KEYS } from "@/utils/local-storage-keys";
import Button from "@/components/Button";
import lang from "@/locales/ru/common.json";

export const Main = () => {
  const { boards } = useSelector((state) => state.main);
  const titleGroupRef = useRef();
  const dispatch = useDispatch();
  const [isAddTitleOpenned, setIsAddTitleOpenned] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [groupTitle, setGroupTitle] = useState("");

  // useEffect(() => {
  //   if (boards.length) {
  //     console.log("boards", boards);
  //   }
  // }, [boards]);

  useEffect(() => {
    if (groupTitle) {
      titleGroupRef.current.focus();
    }
  }, [groupTitle]);

  const addBoardHandler = () => {
    setIsAddTitleOpenned(true);
    setGroupTitle(`${lang.newGroupNumber}${boards.length + 1}`);
  };

  const onDeleteBoards = () => {
    setIsOpenConfirmDialog(false);
    dispatch(initState([]));
  };

  const addGroupTitleHandler = (value) => {
    setGroupTitle(value);
  };

  const onChangeGroupTitle = (e) => {
    if (e.code === "Enter" || e.type === "click") {
      setIsAddTitleOpenned(false);
      dispatch(addBoard({ groupTitle }));
    }
  };

  const deleteBoard = (boardId) => {
    dispatch(removeBoard({ boardId }));
  };

  useEffect(() => {
    const initialization = () => {
      const boards = getLSData(LOCAL_STORAGE_KEYS.boards);

      if (typeof boards === "object" && boards !== null) {
        dispatch(initState([...boards]));
      }
    };
    initialization();
  }, [dispatch]);

  return (
    <>
      <div className='w-full h-8 mt-12 fixed -border border-red-600 top-0 left-0 right-0 bg-gray-50/50 z-10'>
        <div className='container w-full mx-auto flex justify-between items-center'>
          <Button
            text={lang.addGroup}
            clickHandler={addBoardHandler}
            type={"lightAdd"}
          />
          {boards.length ? (
            <Button
              text={lang.removeAllGroups}
              clickHandler={() => setIsOpenConfirmDialog(true)}
              type={"lightDel"}
            />
          ) : null}
        </div>
      </div>

      {isAddTitleOpenned && (
        <CreateCardsGroup
          inputRef={titleGroupRef}
          groupTitle={groupTitle}
          clickOutHandler={() => setIsAddTitleOpenned(false)}
          addGroupTitleHandler={addGroupTitleHandler}
          onChangeGroupTitle={onChangeGroupTitle}
        />
      )}

      {isOpenConfirmDialog && (
        <Confirm
          title={lang.questionRemoveAllGroups}
          yesHandler={onDeleteBoards}
          noHandler={() => setIsOpenConfirmDialog(false)}
        />
      )}

      <div
        id='boardsParent'
        className='container flex flex-wrap mx-auto mt-24 -border transition-all duration-500'
      >
        {boards &&
          boards.map((board) => {
            return (
              <Board key={board.id} board={board} deleteBoard={deleteBoard} />
            );
          })}
      </div>
    </>
  );
};
