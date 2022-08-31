export const deleteCardFromBoard = (boards, boardId, cardId) => {
  const filteredBoards = boards.map((board) => {
    if (board.id === boardId) {
      const newBoard = {...board};
      const newCards = newBoard.cards.filter((card) => {
        return card.id !== cardId ? true : false;
      });
      newBoard.cards = newCards;
      let counter = 1;

      const orderedBoard = newBoard.cards.map((board) => {
        const orderBoard = {...board};
        orderBoard.order = ''+counter++;
        return orderBoard;
      });
      newBoard.cards = orderedBoard;
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

export const sortElements = (a, b) => {
  if (a.order > b.order) {
    return 1;
  } else {
    return -1;
  }
};