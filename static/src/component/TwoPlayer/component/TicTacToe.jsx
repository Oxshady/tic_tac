import React, { useState } from 'react';

const TicTacToe = () => {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [board, setBoard] = useState(Array(9).fill(null));

  const handleClick = (index) => {
    if (board[index] !== null) return; // Prevent overwriting
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X'); // Switch turns
  };

  return (
    <div>
      <h1>Current Player: {currentPlayer}</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div key={index} onClick={() => handleClick(index)}>
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;
