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
      state.boards = [...state.boards, action.payload];
      setLSData(LOCAL_STORAGE_KEYS.boards, action.payload);
    },

  }
});

export const { initState, setBoard } = homeSlice.actions;

export default homeSlice.reducer;