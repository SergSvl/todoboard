import { createSlice, current } from "@reduxjs/toolkit";
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
      const boardId = `group#${Date.now()}`;
      const order = parseFloat(state.boards.length + 1);
      const newBoard = {
        id: boardId,
        order: order,
        title: groupTitle,
        // title: `${groupTitle} - ${boardId}`,
        cards: []
      };
      const boards = [...state.boards, newBoard];
      state.boards = boards;
      setLSData(LOCAL_STORAGE_KEYS.boards, boards);
    },

    removeBoard(state, action) {
      const { boardId } = action.payload;
      // console.log("removeBoard:", { boardId });
      const filteredBoard = state.boards.filter((board) =>
        board.id !== boardId ? true : false
      );
      let counter = 1;
      const orderedBoards = filteredBoard.map((board) => {
        board.order = "" + counter++;
        return board;
      });
      state.boards = orderedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, orderedBoards);
    },

    swapBoards(state, action) {
      const { sourceOrder, destinationOrder } = action.payload;
      // console.log("swapBoards:", { sourceOrder, destinationOrder });
      const filteredBoard = state.boards.filter((board) =>
        board.id !== "group#phantom" ? true : false
      );
      state.boards = filteredBoard;
      const sortedBoards = addPhantom(
        "board",
        state.boards,
        {
          sourceOrder,
          destinationOrder,
          divided: false
        }
      );
      state.boards = sortedBoards;
    },

    addPhantomBoard(state, action) {
      if (!state.isPhantomCreated) {
        const { order, height = "" } = action.payload;
        // console.log("addPhantomBoard:", { order });
        const sortedBoards = addPhantom(
          "board",
          state.boards,
          {
            sourceOrder: null,
            destinationOrder: order,
            divided: false
          }
        );
        state.boards = sortedBoards;
        state.isPhantomCreated = true;
      }
    },

    removePhantomBoard(state, action) {
      const { fromBoardId, toBoardOrder } = action.payload;
      // console.log("removePhantomBoard:", {
      //   fromBoardId,
      //   toBoardOrder
      // });
      const newBoards = state.boards.filter((board) =>
        board.id !== "group#phantom" ? true : false
      );
      const swappedBoards = moveElement({
        elements: newBoards,
        elementId: fromBoardId,
        newElementOrder: toBoardOrder
      });
      const reorderedBoards = reorder(swappedBoards);
      state.boards = reorderedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, reorderedBoards);
      state.isPhantomCreated = false;
    },

    swapCards(state, action) {
      const { boardId, sourceOrder, destinationOrder, divided, dividedMyself, dividedOnTheLeft } = action.payload;
      // console.log("swapCards:", { boardId, sourceOrder, destinationOrder, divided, dividedMyself, dividedOnTheLeft });
      const newBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          const filteredCards = board.cards.filter((card) =>
            card.id !== "card#phantom" ? true : false
          );
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
      state.boards = newBoards;
    },

    addPhantomCard(state, action) {
      const {
        boardId,
        order,
        divided,
        height = "",
      } = action.payload;
      if (!state.isPhantomCreated ) {
        // console.log("addPhantomCard:", {
        //   boardId,
        //   order,
        //   divided,
        //   height
        // });
        const newBoards = state.boards.map((board) => {
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
        state.boards = newBoards;
        state.isPhantomCreated = true;
      }
    },

    resetFlagIsPhantomCreatedOnce(state, action) {
      // console.log("resetFlagIsPhantomCreatedOnce:", state.isPhantomCreatedOnce);
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
        // console.log("addPhantomCardOnce:", {
        //   boardId,
        //   order,
        //   divided,
        //   height
        // });
        const newBoards = state.boards.map((board) => {
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
        state.boards = newBoards;
        state.isPhantomCreatedOnce = true;
      }
    },

    removePhantomCard(state, action) {
      const { boardId, fromCardId, toCardOrder } = action.payload;

      // console.log("removePhantomCard:", {
      //   boardId,
      //   fromCardId,
      //   toCardOrder
      // });

      const newBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          const filteredCards = board.cards.filter((card) =>
            card.id !== "card#phantom" ? true : false
          );
          const swappedCards = moveElement({
            elements: filteredCards,
            elementId: fromCardId,
            newElementOrder: toCardOrder
          });
          board.cards = reorder(swappedCards);
        }
        return board;
      });
      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
      state.isPhantomCreated = false;
    },

    removePhantomCardAndReplaceCardToOtherBoard(state, action) {
      const { fromBoardId, toBoardId, cardId, toCardOrder } = action.payload;
      let card = null;

      // console.log("removePhantomCardAndReplaceCardToOtherBoard:", {
      //   fromBoardId,
      //   toBoardId,
      //   cardId,
      //   toCardOrder
      // });

      const reductedBoards = state.boards.map((board) => {
        if (board.id === fromBoardId) {
          card = board.cards.filter((card) =>
            card.id === cardId ? true : false
          )[0];
          const newCards = board.cards.filter((card) =>
            card.id !== cardId ? true : false
          );
          board.cards = reorder(newCards);
        }
        return board;
      });

      state.boards = reductedBoards;

      const newBoards = state.boards.map((board) => {
        if (board.id === toBoardId) {
          const filteredCards = board.cards.filter((card) =>
            card.id !== "card#phantom" ? true : false
          );
          card.order = toCardOrder;
          const newCards = [ ...filteredCards, card ].sort(sortElements);
          board.cards = reorder(newCards);
        }
        return board;
      });

      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
      state.isPhantomCreated = false;
    },

    addTitleBoard(state, action) {
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

    addTitleCard(state, action) {
      const { cardId, boardId, cardTitle } = action.payload;
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        cardTitle
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    addDescriptionCard(state, action) {
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
      };
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        task: task
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    removeTaskList(state, action) {
      const { boardId, cardId, taskId } = action.payload;
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        removeTaskId: taskId
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    addTaskListElement(state, action) {
      const { boardId, cardId, taskId, newTaskListText } = action.payload;
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        taskId,
        newTaskListText
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
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
      // console.log("updateTask:", {
      //   boardId,
      //   cardId,
      //   taskId,
      //   listId,
      //   checked,
      //   taskTitle,
      //   taskListElemText
      // });
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        taskId,
        listId,
        checked,
        taskTitle,
        taskListElemText
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
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
            const cardId = `card#${Date.now()}`;
            card.id = cardId;
            card.order = `${board.cards.length + 1}`;
            card.title = `${lang.newCard} ${board.cards.length + 1} ${cardId}`;
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
      let newBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards.splice(cardOrder, 0, divider);
          let index = 1;
          const newCards = board.cards.map((card) => {
            if (card.order === cardOrder) {
              if (card.divider === undefined) {
                card.divided = true;
              }
            }
            card.order = index++;
            return card;
          });
          board.cards = newCards;
        }
        return board;
      });
      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
    },

    removeDivider(state, action) {
      const { boardId, cardOrder } = action.payload;

      let newBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          board.cards = board.cards.filter((card) =>
            card.order !== cardOrder ? true : false
          );

          let index = 1;
          const newCards = board.cards.map((card) => {
            if (parseFloat(card.order) === cardOrder - 1) {
              card.divided = false;
            }
            card.order = index++;
            return card;
          });
          board.cards = newCards;
        }
        return board;
      });
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

    removeTaskListElement(state, action) {
      const { boardId, cardId, taskId, listId } = action.payload;
      const updatedBoards = updateCard(state.boards, boardId, cardId, {
        taskId,
        removeListId: listId
      });
      state.boards = updatedBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, updatedBoards);
    },

    addTag(state, action) {
      const { boardId, cardId, newTagText, newTagColor } = action.payload;
      const newBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          const newCards = board.cards.map((card) => {
            if (card.id === cardId) {
              card.tags.push({
                id: `tag#${Date.now()}`,
                text: newTagText,
                color: newTagColor
              });
            }
            return card;
          });
          board.cards = newCards;
        }
        return board;
      });
      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
    },

    updateTag(state, action) {
      const { boardId, cardId, tagId, newTagText, newTagColor } =
        action.payload;
      const newBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          const newCards = board.cards.map((card) => {
            if (card.id === cardId) {
              const newTags = card.tags.map((tag) => {
                if (tag.id === tagId) {
                  tag.text = newTagText;
                  tag.color = newTagColor;
                }
                return tag;
              });
              card.tags = newTags;
            }
            return card;
          });
          board.cards = newCards;
        }
        return board;
      });
      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
    },

    removeTag(state, action) {
      const { boardId, cardId, tagId } = action.payload;
      // console.log("removeTag:", { boardId, cardId, tagId });
      const newBoards = state.boards.map((board) => {
        if (board.id === boardId) {
          const newCards = board.cards.map((card) => {
            if (card.id === cardId) {
              card.tags = card.tags.filter((tag) =>
                tag.id !== tagId ? true : false
              );
            }
            return card;
          });
          board.cards = newCards;
        }
        return board;
      });
      state.boards = newBoards;
      setLSData(LOCAL_STORAGE_KEYS.boards, newBoards);
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
