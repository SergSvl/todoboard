import { createSlice } from "@reduxjs/toolkit";
import { setLSData } from "@/utils/helpers/local-storage-helpers";
import {
  addPhantom,
  moveElement,
  reorder,
  sortElements
} from "@/utils/helpers/card-board-helpers";
import { LOCAL_STORAGE_KEYS } from "@/utils/local-storage-keys";
import { updateCard } from "@/utils/helpers/card-board-helpers";
import lang from "@/locales/ru/common.json";

const initialState = {
  boards: [],
  isPhantomCreated: false,
  isPhantomCreatedOnce: false,
  error: ""
};

export const homeSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    initState(state, action) {
      state.boards = action.payload;
      state.error = "";
      setLSData(LOCAL_STORAGE_KEYS.boards, action.payload);
    },

    addBoard(state, action) {
      const { groupTitle } = action.payload;
      const newBoard = {
        id: `group#${Date.now()}`,
        order: parseFloat(state.boards.length + 1),
        title: groupTitle,
        cards: []
      };
      state.boards = [...state.boards, newBoard];
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    removeBoard(state, action) {
      const { boardId } = action.payload;
      const filteredBoard = state.boards.filter((board) => board.id !== boardId);
      let counter = 1;
      state.boards = filteredBoard.map((board) => {
        board.order = "" + counter++;
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    swapBoards(state, action) {
      const { sourceOrder, destinationOrder } = action.payload;
      state.boards = state.boards.filter((board) => board.id !== "group#phantom");
      state.boards = addPhantom(
        "board",
        state.boards,
        {
          sourceOrder,
          destinationOrder,
          divided: false
        }
      );
    },

    addPhantomBoard(state, action) {
      if (!state.isPhantomCreated) {
        const { order, height = "" } = action.payload;
        state.boards = addPhantom(
          "board",
          state.boards,
          {
            sourceOrder: null,
            destinationOrder: order,
            divided: false
          }
        );
        state.isPhantomCreated = true;
      }
    },

    removePhantomBoard(state, action) {
      const { fromBoardId, toBoardOrder } = action.payload;
      const newBoards = state.boards.filter((board) => board.id !== "group#phantom");
      const swappedBoards = moveElement({
        elements: newBoards,
        elementId: fromBoardId,
        newElementOrder: toBoardOrder
      });
      state.boards = reorder(swappedBoards);
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
      state.isPhantomCreated = false;
    },

    swapCards(state, action) {
      const { boardId, sourceOrder, destinationOrder, divided, dividedMyself, dividedOnTheLeft } = action.payload;
      state.boards = state.boards.map((board) => {
        if (board.id === boardId) {
          const filteredCards = board.cards.filter((card) => card.id !== "card#phantom");
          board.cards = addPhantom(
            "card",
            filteredCards,
            {
              sourceOrder,
              destinationOrder,
              divided,
              dividedMyself,
              dividedOnTheLeft
            }
          );
        }
        return board;
      });
    },

    addPhantomCard(state, action) {
      const {
        boardId,
        order,
        divided,
        height = "",
      } = action.payload;
      if (!state.isPhantomCreated ) {
        state.boards = state.boards.map((board) => {
          if (board.id === boardId) {
            board.cards = addPhantom(
              "card",
              board.cards,
              {
                sourceOrder: null,
                destinationOrder: order,
                divided
              }
            );
          }
          return board;
        });
        state.isPhantomCreated = true;
      }
    },

    resetFlagIsPhantomCreatedOnce(state, action) {
      state.isPhantomCreatedOnce = false;
    },

    addPhantomCardOnce(state, action) {
    const {
        boardId,
        order,
        divided,
        height = "",
      } = action.payload;
      if (!state.isPhantomCreatedOnce ) {
        state.boards = state.boards.map((board) => {
          if (board.id === boardId) {
            board.cards = addPhantom(
              "card",
              board.cards,
              {
                sourceOrder: null,
                destinationOrder: order,
                divided
              }
            );
          }
          return board;
        });
        state.isPhantomCreatedOnce = true;
      }
    },

    removePhantomCard(state, action) {
      const { boardId, fromCardId, toCardOrder } = action.payload;
      state.boards = state.boards.map((board) => {
        if (board.id === boardId) {
          const filteredCards = board.cards.filter((card) => card.id !== "card#phantom");
          const swappedCards = moveElement({
            elements: filteredCards,
            elementId: fromCardId,
            newElementOrder: toCardOrder
          });
          board.cards = reorder(swappedCards);
        }
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
      state.isPhantomCreated = false;
    },

    removePhantomCardAndReplaceCardToOtherBoard(state, action) {
      const { fromBoardId, toBoardId, cardId, toCardOrder } = action.payload;
      let card = null;
      state.boards = state.boards.map((board) => {
        if (board.id === fromBoardId) {
          card = board.cards.filter((card) => card.id === cardId)[0];
          const newCards = board.cards.filter((card) => card.id !== cardId);
          board.cards = reorder(newCards);
        }
        return board;
      });

      state.boards = state.boards.map((board) => {
        if (board.id === toBoardId) {
          const filteredCards = board.cards.filter((card) => card.id !== "card#phantom");
          card.order = toCardOrder;
          board.cards = reorder([ ...filteredCards, card ].sort(sortElements));
        }
        return board;
      });

      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
      state.isPhantomCreated = false;
    },

    addTitleBoard(state, action) {
      const { id, newTitle } = action.payload;
      state.boards = state.boards.map((board) => {
        if (board.id === id) {
          board.title = newTitle;
        }
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    addTitleCard(state, action) {
      const { cardId, boardId, cardTitle } = action.payload;
      state.boards = updateCard(state.boards, boardId, cardId, {
        cardTitle
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    addDescriptionCard(state, action) {
      const { cardId, boardId, newDescription } = action.payload;
      state.boards = updateCard(state.boards, boardId, cardId, {
        description: newDescription
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    addTask(state, action) {
      const { boardId, cardId, title } = action.payload;
      state.boards = updateCard(state.boards, boardId, cardId, {
        task: {
          id: `task#${Date.now()}`,
          title,
          list: []
        }
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    removeTaskList(state, action) {
      const { boardId, cardId, taskId } = action.payload;
      state.boards = updateCard(state.boards, boardId, cardId, {
        removeTaskId: taskId
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    addTaskListElement(state, action) {
      const { boardId, cardId, taskId, newTaskListText } = action.payload;
      state.boards = updateCard(state.boards, boardId, cardId, {
        taskId,
        newTaskListText
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    updateTask(state, action) {
      const {
        boardId,
        cardId,
        taskId,
        listId,
        checked,
        taskTitle,
        taskListElemText
      } = action.payload;
      state.boards = updateCard(state.boards, boardId, cardId, {
        taskId,
        listId,
        checked,
        taskTitle,
        taskListElemText
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    addCard(state, action) {
      const id = action.payload.id;
      let card = {
        id: "",
        order: 0,
        title: "",
        description: "",
        tasks: [],
        tags: []
      };
      let newBoards = [];

      if (action.payload.hasOwnProperty("card")) {
        newBoards = state.boards.map((board) => {
          if (board.id === id) {
            card = action.payload.card;
            card.order = `${board.cards.length + 1}`;
            card.divided = false;
            board.cards = [...board.cards, card];
          }
          return board;
        });
      } else {
        newBoards = state.boards.map((board) => {
          if (board.id === id) {
            card.id = `card#${Date.now()}`;
            card.order = `${board.cards.length + 1}`;
            card.title = `${lang.newCard} ${board.cards.length + 1}`;
            board.cards = [...board.cards, card];
          }
          return board;
        });
      }
      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
    },

    addDivider(state, action) {
      const { boardId, cardOrder } = action.payload;
      let divider = {
        id: `divider#${Date.now()}`,
        order: 0,
        divider: true
      };
      state.boards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards.splice(cardOrder, 0, divider);
          let index = 1;
          board.cards = board.cards.map((card) => {
            if (card.order === cardOrder) {
              if (card.divider === undefined) {
                card.divided = true;
              }
            }
            card.order = index++;
            return card;
          });
        }
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    removeDivider(state, action) {
      const { boardId, cardOrder } = action.payload;

      state.boards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards = board.cards.filter((card) => card.order !== cardOrder);

          let index = 1;
          board.cards = board.cards.map((card) => {
            if (parseFloat(card.order) === cardOrder - 1) {
              card.divided = false;
            }
            card.order = index++;
            return card;
          });
        }
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    setSortedCards(state, action) {
      const { boardId, sortedCards } = action.payload;

      state.boards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards = [...sortedCards];
        }
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    removeTaskListElement(state, action) {
      const { boardId, cardId, taskId, listId } = action.payload;
      state.boards = updateCard(state.boards, boardId, cardId, {
        taskId,
        removeListId: listId
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    addTag(state, action) {
      const { boardId, cardId, newTagText, newTagColor } = action.payload;
      state.boards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards = board.cards.map((card) => {
            if (card.id === cardId) {
              card.tags.push({
                id: `tag#${Date.now()}`,
                text: newTagText,
                color: newTagColor
              });
            }
            return card;
          });
        }
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    updateTag(state, action) {
      const { boardId, cardId, tagId, newTagText, newTagColor } =
        action.payload;
        state.boards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards = board.cards.map((card) => {
            if (card.id === cardId) {
              card.tags = card.tags.map((tag) => {
                if (tag.id === tagId) {
                  tag.text = newTagText;
                  tag.color = newTagColor;
                }
                return tag;
              });
            }
            return card;
          });
        }
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    },

    removeTag(state, action) {
      const { boardId, cardId, tagId } = action.payload;
      state.boards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards = board.cards.map((card) => {
            if (card.id === cardId) {
              card.tags = card.tags.filter((tag) => tag.id !== tagId);
            }
            return card;
          });
        }
        return board;
      });
      setLSData(LOCAL_STORAGE_KEYS.boards, state.boards);
    }
  }
});

export const {
  initState,
  addBoard,
  removeBoard,
  swapBoards,
  addTitleBoard,
  addTitleCard,
  addCard,
  swapCards,
  addPhantomCard,
  addPhantomCardOnce,
  resetFlagIsPhantomCreatedOnce,
  removePhantomCardAndReplaceCardToOtherBoard,
  addPhantomBoard,
  removePhantomBoard,
  removePhantomCard,
  setSortedCards,
  addDescriptionCard,
  addTask,
  removeTaskList,
  updateTask,
  addTaskListElement,
  removeTaskListElement,
  addTag,
  updateTag,
  removeTag,
  addDivider,
  removeDivider
} = homeSlice.actions;

export default homeSlice.reducer;
