import { createSlice, current } from '@reduxjs/toolkit';
import { setLSData, deleteLSData } from '@/utils/helpers/local-storage-helpers';
import { LOCAL_STORAGE_KEYS } from "@/utils/local-storage-keys";

const initialState = {
  boards: [],
  error: '',
}

export const homeSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    initState(state, action) {
      state.boards = action.payload;
      state.error = '';
      setLSData(LOCAL_STORAGE_KEYS.boards, action.payload);
    },
    setBoard(state, action) {
      const boards = [...state.boards, action.payload];
      console.log("setBoard:", boards);
      state.boards = boards;
      setLSData(LOCAL_STORAGE_KEYS.boards, boards);
    },
    setTitleBoard(state, action) {
      const { id, newTitle } = action.payload;
      const updatedBoards = state.boards.map((board) => {
        if (board.id === id) {
          board.title = newTitle;
        }
        return board;
      });
      console.log("updatedBoards:", updatedBoards);
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

  }
});

export const { initState, setBoard, setTitleBoard } = homeSlice.actions;

export default homeSlice.reducer;