import React from 'react';
import './css/ModeSelection.css';
import {Link} from 'react-router-dom';

// Import icons or images
import humanIcon from '../../img/room.jpg'; // Adjust the path to your image
import computerIcon from '../../img/multiplayer.png'; // Adjust the path to your image

export default function ModeSelection({ onSelectMode }) {
  return (
    <div id="mode-selection">
        <h2>Select Game Mode</h2>
      <div className="mode-option">
        <img src={humanIcon} alt="Play vs Human" className="mode-icon" />
        
        <Link to="humans" className='human-mode'>Play vs Human</Link>
        
      </div>
      
      {/* <div className="mode-option" onClick={() => onSelectMode('computer')}>
        <img src={computerIcon} alt="Play vs Computer" className="mode-icon" />
        <p>Play vs Computer</p>
      </div> */}
    </div>
  );
}