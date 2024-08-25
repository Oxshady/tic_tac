import { useState, useEffect } from "react";
import Player from "./component/Player";
import GameBoard from "./component/GameBoard";
import Log from "./component/Log";
import { WINNING_COMBINATIONS } from "../winning-combinations.js";
import GameOver from "./component/GameOver.jsx";
import ModeSelection from './component/ModeSelection';
import DifficultySelection from './component/DifficultySelection';

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Determine the active player
function deriveActivePlayer(gameTurns) {
  return gameTurns.length % 2 === 0 ? 'X' : 'O';
}

// Determine the winner of the game
function deriveWinner(gameBoard, players) {
  for (const combination of WINNING_COMBINATIONS) {
    const [firstSquare, secondSquare, thirdSquare] = combination;
    const firstSquareSymbol = gameBoard[firstSquare.row]?.[firstSquare.column];
    const secondSquareSymbol = gameBoard[secondSquare.row]?.[secondSquare.column];
    const thirdSquareSymbol = gameBoard[thirdSquare.row]?.[thirdSquare.column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      return players[firstSquareSymbol];
    }
  }
  return null;
}

// Convert game turns to game board state
function deriveGameBoard(gameTurns) {
  const gameBoard = initialGameBoard.map(row => [...row]);
  for (const turn of gameTurns) {
    const { square, player } = turn;
    gameBoard[square.row][square.col] = player;
  }
  return gameBoard;
}

// Get available moves from the current game board state
function getAvailableMoves(gameBoard) {
  const availableMoves = [];
  for (let row = 0; row < gameBoard.length; row++) {
    for (let col = 0; col < gameBoard[row].length; col++) {
      if (!gameBoard[row][col]) {
        availableMoves.push({ row, col });
      }
    }
  }
  return availableMoves;
}

// Check if the game board has a winning move
function checkWinner(gameBoard) {
  for (const combination of WINNING_COMBINATIONS) {
    const [firstSquare, secondSquare, thirdSquare] = combination;
    const firstSquareSymbol = gameBoard[firstSquare.row]?.[firstSquare.column];
    const secondSquareSymbol = gameBoard[secondSquare.row]?.[secondSquare.column];
    const thirdSquareSymbol = gameBoard[thirdSquare.row]?.[thirdSquare.column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      return firstSquareSymbol;
    }
  }
  return null;
}

// Minimax algorithm implementation
function minimax(gameBoard, depth, isMaximizing) {
  const winner = checkWinner(gameBoard);

  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (getAvailableMoves(gameBoard).length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of getAvailableMoves(gameBoard)) {
      gameBoard[move.row][move.col] = 'O';
      const score = minimax(gameBoard, depth + 1, false);
      gameBoard[move.row][move.col] = null;
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of getAvailableMoves(gameBoard)) {
      gameBoard[move.row][move.col] = 'X';
      const score = minimax(gameBoard, depth + 1, true);
      gameBoard[move.row][move.col] = null;
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}

// Find the best move for the computer
function findBestMove(gameBoard) {
  let bestMove = null;
  let bestScore = -Infinity;
  for (const move of getAvailableMoves(gameBoard)) {
    gameBoard[move.row][move.col] = 'O';
    const score = minimax(gameBoard, 0, false);
    gameBoard[move.row][move.col] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

function App() {
  const [players, setPlayers] = useState({
    'X': 'Player1',
    'O': 'Player2'
  });

  const [gameTurns, setGameTurns] = useState([]);
  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  useEffect(() => {
    if (mode === 'computer' && activePlayer === 'O' && !winner && !hasDraw) {
      if (difficulty === 'easy') {
        // Random move algorithm
        const availableMoves = getAvailableMoves(gameBoard);
        if (availableMoves.length > 0) {
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          setTimeout(() => {
            setGameTurns(prevTurns => [
              { square: randomMove, player: 'O' },
              ...prevTurns,
            ]);
          }, 500);
        }
      } else if (difficulty === 'hard') {
        // Minimax algorithm
        const bestMove = findBestMove(gameBoard);
        if (bestMove) {
          setTimeout(() => {
            setGameTurns(prevTurns => [
              { square: bestMove, player: 'O' },
              ...prevTurns,
            ]);
          }, 500);
        }
      }
    }
  }, [gameTurns, mode, activePlayer, gameBoard, difficulty, winner, hasDraw]);
  

  function handleSelectSquare(rowIndex, colIndex) {
    if (winner || hasDraw || gameBoard[rowIndex][colIndex]) {
      return;
    }

    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(gameTurns);
      return [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => ({
      ...prevPlayers,
      [symbol]: newName
    }));
  }

  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
    setDifficulty(null); // Reset difficulty when changing mode
    setGameTurns([]); // Reset game turns when changing mode
  };

  const handleDifficultySelection = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
  };

  return (
    <div>
      {!mode ? (
        <ModeSelection onSelectMode={handleModeSelection} />
      ) : mode === 'computer' && difficulty === null ? (
        <DifficultySelection onSelectDifficulty={handleDifficultySelection} />
      ) : (
        <main>
          <div id="game-container">
            <ol id="players" className="highlight-player">
              <Player initalName="Player 1" symbol="X" isActive={activePlayer === 'X'} onChangeName={handlePlayerNameChange} />
              <Player initalName="Player 2" symbol="O" isActive={activePlayer === 'O'} onChangeName={handlePlayerNameChange} />
            </ol>
            {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} onChangeMode={() => { setMode(null); setDifficulty(null); setGameTurns([]); }} />}
            <GameBoard 
              onSelectSquare={handleSelectSquare}  
              board={gameBoard}
              mode={mode}
            />
          </div>
          <Log turns={gameTurns} />
        </main>
      )}
    </div>
  );
}

export default App;
