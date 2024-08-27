
import { useState, useEffect } from "react";
import io from "socket.io-client";
 
import GameBoard from "./GameBoard.jsx";
import Log from "./Log";
import { WINNING_COMBINATIONS } from "../../WINNING_COMBINATIONS.js";
import GameOver from "./GameOver.jsx";
import ModeSelection from './ModeSelection';
import DifficultySelection from './DifficultySelection';
import RoomIdForm from './RoomIdForm.jsx';

import './css/game.css';

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

const socket = io('http://localhost:3000'); // Connect to the server

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

function GameSelection() {
  const [players, setPlayers] = useState({
    'X': 'Player1',
    'O': 'Player2'
  });

  const [gameTurns, setGameTurns] = useState([]);
  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(true);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    if (roomId) {
      socket.emit('joinRoom', roomId);
    
      socket.on('updatePlayerList', (playersInRoom) => {
        setConnectedPlayers(playersInRoom);
        setWaitingForOpponent(playersInRoom.length < 2);
      });

      socket.on('roomFull', () => {
        setErrorMessage('The room is already full. Please enter a different room ID ');
      });
      
      socket.on('gameMove', (move) => {
        console.log('Move received:', move);
        setGameTurns(prevTurns => [move, ...prevTurns]);
      });
    
      socket.on('gameUpdate', (gameTurns) => {
        setGameTurns(gameTurns);
      });
    
      socket.on('gameRestarted', () => {
        setGameTurns([]);
      });
    
      // Clean up event listeners on component unmount
      return () => {
        socket.off('updatePlayerList');
        socket.off('gameMove');
        socket.off('gameUpdate');
        socket.off('gameRestarted');
      };
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId && waitingForOpponent) {
      socket.on('gameMove', () => {
        setWaitingForOpponent(false);
      });
    }
  }, [roomId, waitingForOpponent]);

  function handleSelectSquare(rowIndex, colIndex) {
    if (winner || hasDraw || gameBoard[rowIndex][colIndex]) {
      return;
    }

    const currentPlayer = deriveActivePlayer(gameTurns);
    const newMove = { square: { row: rowIndex, col: colIndex }, player: currentPlayer };
    console.log('Move made:', newMove);
    setGameTurns(prevTurns => [newMove, ...prevTurns]);

    // Emit the move to the server, including the room ID
    socket.emit('gameMove', { move: newMove, roomId });
  }

  function handleRestart() {
    setGameTurns([]);
    socket.emit('restartGame');
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

  const handleJoinRoom = (newRoomId) => {
    setRoomId(newRoomId);
    socket.emit('joinRoom', newRoomId);
  };

  const handleChangeMode = () => {
    setMode(null);
    setDifficulty(null);
    setGameTurns([]);
    setRoomId(null);
    setWaitingForOpponent(true);
    setConnectedPlayers([]);
    setErrorMessage('');
  };

  const handleChangeRoomID = () => {
    setDifficulty(null);
    setGameTurns([]);
    setRoomId(null);
    setWaitingForOpponent(true);
    setConnectedPlayers([]);
    setErrorMessage('');
  };

  return (
    <div>
      {!mode ? (
        <ModeSelection onSelectMode={handleModeSelection} />
      ) : mode === 'human' && !roomId ? (
        <RoomIdForm onJoinRoom={handleJoinRoom} connectedPlayers={connectedPlayers} />
      ) : errorMessage ? (
        <div className="error-message">
          {errorMessage}
          <button onClick={handleChangeRoomID}>OK</button>
        </div>
      ) : roomId && connectedPlayers.length <= 2 ? (
        <div className="waiting-message">Waiting for another player to join...</div>
      ) : mode === 'computer' && difficulty === null ? (
        <DifficultySelection onSelectDifficulty={handleDifficultySelection} />
      ) : (
        <>
          <div id="game-container">
            {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} onChangeMode={handleChangeMode} />}
            <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} mode={mode} />
          </div>
          <Log turns={gameTurns} />
        </>
      )}
    </div>
  );
}

export default GameSelection;
