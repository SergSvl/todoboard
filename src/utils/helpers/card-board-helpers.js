export const deleteCardFromBoard = (boards, boardId, { cardId, cardOrder, cardDivided }) => {
  const filteredBoards = boards.map((board) => {
    if (board.id === boardId) {
      const newBoard = {...board};
      const newCards = newBoard.cards.filter((card) => card.id !== cardId ? true : false);
      newBoard.cards = newCards;
      let counter = 1;
      let prevCardOrder = 0;

      // if (cardDivided && cardOrder > 1) {
      if (cardDivided) {
        prevCardOrder = cardOrder - 1;
      }

      const orderedCards = newBoard.cards.map((card) => {
        const newCard = {...card};
        
        if (newCard.order === prevCardOrder) {
          newCard.divided = true;
        }
        newCard.order = ''+counter++;
        return newCard;
      });
      newBoard.cards = orderedCards;
      return newBoard;
    } else {
      return board;
    }
  });
  return filteredBoards;
}

export const updateCard = (boards, boardId, cardId, { cardTitle, description, task, taskId, listId, checked, newTaskListText, taskTitle, removeTaskId, taskListElemText, removeListId }) => {
  console.log("updateCard:", { cardTitle, description, task, taskId, listId, checked, newTaskListText, removeTaskId, taskListElemText, removeListId });
  const updatedBoards = boards.map((board) => {

    if (board.id === boardId) {
      const newBoard = board.cards.map((card) => {
        if (card.id === cardId) {
          if (cardTitle !== undefined) { card.title = cardTitle }
          if (description !== undefined) { card.description = description }
          if (task !== undefined) { card.tasks.push(task) }
          if (checked !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                const newList = task.list.map((listElem) => {
                  if (listElem.id === listId) {
                    listElem.checked = checked;
                  }
                  return listElem;
                });
                task.list = newList;
              }
              return task;
            });
            card.tasks = newTasks;
          }
          if (newTaskListText !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.list.push({
                  id: `${task.list.length+1}`,
                  text: newTaskListText,
                  checked: false
                });
              }
              return task;
            });
            card.tasks = newTasks;
          }
          if (taskTitle !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.title = taskTitle;
              }
              return task;
            });
            card.tasks = newTasks;
          }
          if (removeTaskId !== undefined) {
            card.tasks = card.tasks.filter((task) => task.id !== removeTaskId ? true : false);
          }
          if (taskListElemText !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                const newList = task.list.map((listElem) => {
                  if (listElem.id === listId) {
                    listElem.text = taskListElemText;
                  }
                  return listElem;
                });
                task.list = newList;
              }
              return task;
            });
            card.tasks = newTasks;
          }
          if (removeListId !== undefined) {
            const newTasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.list = task.list.filter((listElem) => listElem.id !== removeListId ? true : false);
              }
              return task;
            });
            card.tasks = newTasks;
          }
        }
        return card;
      });
      board.cards = newBoard;
    }
    return board;
  });
  return updatedBoards;
}

export const addPhantom = (boards, destinationOrder, sourceOrder = null) => {
  /*
    Для эл-та с position = absolute фантом может располагаться на любом месте в массиве досок и он всегда будет занимать место поднятого мышкой эл-та,
    Но для других эл-тов это не работает, т.к. положение фантома имеет значение на порядок его отображения на странице, т.е. с эл-там с position = relative он должен идти следующим номером за тем эл-том, место которого он долэен занять на странице
  */
  const newBoard = {
    id: 'group#phontom',
    // up = sourceOrder > destinationOrder, down - sourceOrder < destinationOrder
    order: sourceOrder < destinationOrder ? parseInt(destinationOrder) + 0.5 : parseInt(destinationOrder) - 0.5,
    // height,
    // height: `h-[${height}px]`,
    title: '',
    cards: [],
  }
  return [...boards, newBoard].sort(sortElements);
}

export const swapElements = ({ elements, fromBoardId, fromBoardOrder, toBoardId, toBoardOrder }) => {
  if (!isNaN(fromBoardOrder) && !isNaN(toBoardOrder)) {
    const changedElements = elements.map((current) => {
      if (current.id === toBoardId) {
        return { ...current, order: fromBoardOrder };
      }
      if (current.id === fromBoardId) {
        return { ...current, order: toBoardOrder };
      }
      return current;
    });
    return changedElements.sort(sortElements);
  }
  return elements;
}

export const reorder = (elements) => {
  let index = 1;
  const reorderedElements = elements.map((element) => {
    element.order = index++;
    return element;
  });
  return reorderedElements;
}

export const sortElements = (a, b) => {
  return a.order > b.order ? 1 : -1;
};