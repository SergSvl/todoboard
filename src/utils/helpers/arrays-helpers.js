export const deleteCardFromBoard = (boards, boardId, cardId) => {
  const filteredBoards = boards.map((board) => {
    if (board.id === boardId) {
      const newBoard = {...board};
      const newCards = newBoard.cards.filter((card) => {
        return card.id !== cardId ? true : false;
      });
      newBoard.cards = newCards;
      // console.log("newCards::", newCards);
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

export const updateCard = (boards, boardId, cardId, { title, description }) => {
  const updatedBoards = boards.map((board) => {
    console.log("title:", title);
    console.log("description:", description);

    if (board.id === boardId) {
      const newBoard = board.cards.map((card) => {
        if (card.id === cardId) {
          if (title !== undefined) { card.title = title }
          if (description !== undefined) { card.description = description }
        }
        return card;
      });
      board.cards = newBoard;
    }
    return board;
  });
  return updatedBoards;
}