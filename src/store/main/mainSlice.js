import { createSlice, current } from '@reduxjs/toolkit';
import { setLSData, deleteLSData } from '@/utils/helpers/local-storage-helpers';
import { LOCAL_STORAGE_KEYS } from "@/utils/local-storage-keys";
import { updateCard } from '@/utils/helpers/card-board-helpers';

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
      const { cardId, boardId, cardTitle } = action.payload;
      // console.log("setTitleCard:", { cardId, boardId, cardTitle });
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        cardTitle
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

    addTask(state, action) {
      const { boardId, cardId, title } = action.payload;
      const task = {
        id: `task#${Date.now()}`,
        title,
        list: []
      }
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        task: task
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    addTaskListElement(state, action) {
      const { boardId, cardId, taskId, newTaskListText } = action.payload;
      // console.log("addTask:", { boardId, cardId });
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        taskId,
        newTaskListText
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    updateTask(state, action) {
      const { boardId, cardId, taskId, listId, checked, taskTitle } = action.payload;
      console.log("updateTask:", { boardId, cardId, taskId, listId, checked, taskTitle });
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        taskId,
        listId,
        checked,
        taskTitle
      });
      console.log("updateTask:", updatedBoards);
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
        tasks: [],
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

export const { initState, setBoard, setTitleBoard, setTitleCard, addCard, setSortedCards, setDescriptionCard, addTask, updateTask, addTaskListElement } = homeSlice.actions;

export default homeSlice.reducer;