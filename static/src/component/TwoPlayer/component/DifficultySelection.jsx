import React from 'react';

function DifficultySelection({ onSelectDifficulty }) {
  return (
    <div id="difficulty-selection">
      <h2>Select Difficulty</h2>
      <button onClick={() => onSelectDifficulty('easy')}>Easy</button>
      <button onClick={() => onSelectDifficulty('hard')}>Hard</button>
    </div>
  );
}

export default DifficultySelection;
