export const deleteCardFromBoard = (
  boards,
  boardId,
  { cardId, cardOrder, cardDivided }
) => {
  const filteredBoards = boards.map((board) => {
    if (board.id === boardId) {
      const newBoard = { ...board };
      newBoard.cards = newBoard.cards.filter((card) => card.id !== cardId);
      let counter = 1;
      let prevCardOrder = 0;

      if (cardDivided) {
        prevCardOrder = cardOrder - 1;
      }

      newBoard.cards = newBoard.cards.map((card) => {
        const newCard = { ...card };

        if (newCard.order === prevCardOrder) {
          newCard.divided = true;
        }
        newCard.order = "" + counter++;
        return newCard;
      });
      return newBoard;
    } else {
      return board;
    }
  });
  return filteredBoards;
};

export const updateCard = (
  boards,
  boardId,
  cardId,
  {
    cardTitle,
    description,
    task,
    taskId,
    listId,
    checked,
    newTaskListText,
    taskTitle,
    removeTaskId,
    taskListElemText,
    removeListId
  }
) => {
  return boards.map((board) => {
    if (board.id === boardId) {
      board.cards = board.cards.map((card) => {
        if (card.id === cardId) {
          if (cardTitle !== undefined) {
            card.title = cardTitle;
          }
          if (description !== undefined) {
            card.description = description;
          }
          if (task !== undefined) {
            card.tasks.push(task);
          }
          if (checked !== undefined) {
            card.tasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.list = task.list.map((listElem) => {
                  if (listElem.id === listId) {
                    listElem.checked = checked;
                  }
                  return listElem;
                });
              }
              return task;
            });
          }
          if (newTaskListText !== undefined) {
            card.tasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.list.push({
                  id: `${task.list.length + 1}`,
                  text: newTaskListText,
                  checked: false
                });
              }
              return task;
            });
          }
          if (taskTitle !== undefined) {
            card.tasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.title = taskTitle;
              }
              return task;
            });
          }
          if (removeTaskId !== undefined) {
            card.tasks = card.tasks.filter((task) => task.id !== removeTaskId);
          }
          if (taskListElemText !== undefined) {
            card.tasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.list = task.list.map((listElem) => {
                  if (listElem.id === listId) {
                    listElem.text = taskListElemText;
                  }
                  return listElem;
                });
              }
              return task;
            });
          }
          if (removeListId !== undefined) {
            card.tasks = card.tasks.map((task) => {
              if (task.id === taskId) {
                task.list = task.list.filter((listElem) => listElem.id !== removeListId);
              }
              return task;
            });
          }
        }
        return card;
      });
    }
    return board;
  });
};

export const addPhantom = (
  type,
  elements,
  { sourceOrder = null, destinationOrder, divided, dividedMyself = false, dividedOnTheLeft = false }
) => {
  let phantom = {};
  // up = sourceOrder > destinationOrder, down - sourceOrder < destinationOrder
  const order =
    sourceOrder < destinationOrder
      ? dividedOnTheLeft
        ? parseFloat(destinationOrder) + 1.5
        : parseFloat(destinationOrder) + 0.5
      : dividedMyself
        ? parseFloat(destinationOrder) - 1.5
        : parseFloat(destinationOrder) - 0.5;

  switch (type) {
    case "board":
      phantom = {
        id: "group#phantom",
        order,
        // height,
        title: "",
        cards: []
      };
      break;
    case "card":
      phantom = {
        id: "card#phantom",
        order,
        // height,
        title: "",
        description: "",
        divided,
        tasks: [],
        tags: []
      };
      break;
    default:
  }
  return [...elements, phantom].sort(sortElements);
};

export const moveElement = ({ elements, elementId, newElementOrder }) => {
  if (!isNaN(newElementOrder)) {
    const changedElements = elements.map((current) => {
      if (current.id === elementId) {
        return { ...current, order: parseFloat(newElementOrder) };
      }
      return current;
    });
    return changedElements.sort(sortElements);
  }
  return elements;
};

export const reorder = (elements) => {
  let index = 1;
  return elements.map((element) => {
    element.order = index++;
    return element;
  });
};

export const sortElements = (a, b) => {
  return a.order > b.order ? 1 : -1;
};
