import { createSlice, current } from '@reduxjs/toolkit';
import { setLSData, deleteLSData } from '@/utils/helpers/local-storage-helpers';
import { LOCAL_STORAGE_KEYS } from "@/utils/local-storage-keys";
import { updateCard } from '@/utils/helpers/arrays-helpers';

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
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    setTitleCard(state, action) {
      const { cardId, boardId, newTitle } = action.payload;
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        title: newTitle
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    setDescriptionCard(state, action) {
      const { cardId, boardId, newDescription } = action.payload;
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        description: newDescription
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    addCard(state, action) {
      const id = action.payload.id;
      let card = {
        id: '',
        order: '',
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
      let newBoards = [];

      if (action.payload.hasOwnProperty('card')) {
        newBoards = state.boards.map((board) => {
          if (board.id === id) {
            card = action.payload.card;
            card.order = `${board.cards.length+1}`;
            board.cards = [...board.cards, card];
          }
          return board;
        });
      } else {
        newBoards = state.boards.map((board) => {
          if (board.id === id) {
            card.id = `card#${Date.now()}`;
            card.order = `${board.cards.length+1}`;
            card.title = `Новая карточка ${board.cards.length+1}`;
            board.cards = [...board.cards, card];
          }
          return board;
        });
      }
      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
    },

    setSortedCards(state, action) {
      const { boardId, sortedCards } = action.payload;

      const newBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards = [...sortedCards];
        }
        return board;
      });
      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
    },
  }
});

export const { initState, setBoard, setTitleBoard, setTitleCard, addCard, setSortedCards, setDescriptionCard } = homeSlice.actions;

export default homeSlice.reducer;