import React from 'react';

function GamePage() {
  return (
    <div className="game-page">
      <h1>Game Page</h1>
      <p>Welcome to the Game Page! Here you can find and play various games.</p>
      
      {/* Example game content */}
      <div className="game-list">
        <div className="game-item">
          <h2>Game 1</h2>
          <p>Game 1 description...</p>
          <button>Play Game 1</button>
        </div>
        <div className="game-item">
          <h2>Game 2</h2>
          <p>Game 2 description...</p>
          <button>Play Game 2</button>
        </div>
        {/* Add more games as needed */}
      </div>
    </div>
  );
}

export default GamePage;
