import React from 'react';


export default function ModeSelection({ onSelectMode }) {
  return (
    <div id="mode-selection">
      <h2>Select Game Mode</h2>
      <button onClick={() => onSelectMode('human')}>Play vs Human</button>
      <button onClick={() => onSelectMode('computer')}>Play vs Computer</button>
    </div>
  );
}

