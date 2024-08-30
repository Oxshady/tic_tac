import React from 'react';

function GameOver({ winner, players, playerSymbols, onRestart, onChangeMode, isWaitingForRematch, rematchRequested }) {
  console.log('rematchRequested:', rematchRequested);
  console.log('isWaitingForRematch:', isWaitingForRematch);
  
  const playerWon = winner === players[playerSymbols];
  const message = playerWon ? 'You won!' : 'You lost.';
  return (
    <div id="game-over">
      <h2>{winner ? `${message}` : 'It\'s a Draw!'}</h2>
      <p>{winner ? (playerWon ? `Congratulations!` : `Sorry, better luck next time!`) : 'No winner this time!'}</p>
      {isWaitingForRematch && rematchRequested ? (
        <p className="waiting-rematch">Waiting for the other player to accept rematch...</p>
      ) : (
        <>
          <button onClick={onRestart}>Rematch</button>
          <button onClick={onChangeMode}>Change Mode</button>
          {isWaitingForRematch && (
          <p className="rematch-request">Your opponent requested a rematch...</p>
          )}
        </>
      )}
    </div>
  );
}

export default GameOver;
