import React from 'react';

function GameOver({ winner, onRestart, onChangeMode }) {
  return (
    <div id="game-over">
      <h2>{winner ? `${winner} Wins!` : 'It\'s a Draw!'}</h2>
      <p>{winner ? `Congratulations ${winner}!` : 'No winner this time!'}</p>
      <button onClick={onRestart}>Rematch</button>
      <button onClick={onChangeMode}>Change Mode</button>
    </div>
  );
}

export default GameOver;
