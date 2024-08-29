import React, { useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { updateGameStats } from '../../store/userSlice';


function WinnerPop({ winner, resetGame, handleQuit }) {
  const dispatch = useDispatch();
  



  // Update game stats based on winner
  useEffect(() => {
    if (winner) {
      if (winner === 'X') {
        dispatch(updateGameStats({ result: 'win' }));
      } else if (winner === "Draw") {
        dispatch(updateGameStats({ result: 'draw' }));
      } else {
        dispatch(updateGameStats({ result: 'lose' }));
      }
    }
  }, [winner, dispatch]);

  // Trigger mutation after game stats update


  return (
    <div className="winner-popup">
        <h2 className="main-pop">{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>
        <button className="winner-btn" onClick={resetGame}>Try Again</button>
        <button className="Quit-btn" onClick={handleQuit}>Quit</button>
    </div>
  );
}

export default WinnerPop;
