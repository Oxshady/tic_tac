import React from 'react';
import './css/DifficultySelection.css';

function DifficultySelection({ onSelectDifficulty }) {
  return (
    <div id="difficulty-selection">
        <h2 className='title-hard'>Select Difficulty</h2>
        <button className='easy-btn' onClick={() => onSelectDifficulty('easy')}>Easy</button>
        <button className='hard-btn' onClick={() => onSelectDifficulty('hard')}>Hard</button>
    </div>
  );
}

export default DifficultySelection;


/*
.mode-option {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 1rem auto;
    width: 50%;
    padding: 1rem;
    border-radius: 8px;
    background-color: #7ef0ff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, background-color 0.2s;
}

*/