import { useState, useEffect } from "react";
import io from "socket.io-client";
import Player from "./component/Player";
import GameBoard from "./component/GameBoard";
import Log from "./component/Log";
import { WINNING_COMBINATIONS } from "../winning-combinations.js";
import GameOver from "./component/GameOver.jsx";
import ModeSelection from './component/ModeSelection';
import DifficultySelection from './component/DifficultySelection';
import RoomIdForm from './component/RoomIDForm';
import JoinMethodSelection from './component/JoinMethodSelection';

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

function App() {
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
  const [playerSymbols, setPlayerSymbols] = useState('X');
  const [rematchRequested, setRematchRequested] = useState(false);
  const [waitingForRematch, setWaitingForRematch] = useState(false);
  const [joinMethod, setJoinMethod] = useState(null);


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
      
      socket.on('startGame', () => {
        setWaitingForOpponent(false);
      });
    
      socket.on('gameMove', (move) => {
        console.log('Move received:', move);
        setGameTurns(prevTurns => {
          const updatedTurns = [move, ...prevTurns];
      
          // Determine if this is the first move and set player symbols
          if (updatedTurns.length === 1) {
            setPlayerSymbols('O');
          }
          
          return updatedTurns;
        });
      });

    
      socket.on('gameUpdate', (gameTurns) => {
        setGameTurns(gameTurns);
      });
    
      socket.on('gameRestarted', () => {
        setGameTurns([]);
      });

      socket.on('playerNameUpdated', ({ symbol, newName }) => {
        setPlayers(prevPlayers => ({
          ...prevPlayers,
          [symbol]: newName
        }));
      });

      // Clean up event listeners on component unmount
      return () => {
        socket.off('updatePlayerList');
        socket.off('gameMove');
        socket.off('gameUpdate');
        socket.off('gameRestarted');
        socket.off('playerNameUpdated');
        socket.off('startGame');
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
    if (mode === 'computer' && activePlayer !== 'X') {
      return;
    }
    const currentPlayer = deriveActivePlayer(gameTurns);
    if (mode === 'human' && playerSymbols !== currentPlayer) {
      return; // Invalid move attempt; return early
    }
    const newMove = { square: { row: rowIndex, col: colIndex }, player: currentPlayer };
    console.log('Move made:', newMove);
    setGameTurns(prevTurns => [newMove, ...prevTurns]);

    // Emit the move to the server, including the room ID
    socket.emit('gameMove', { move: newMove, roomId });
  }
  useEffect(() => {
    socket.on('rematchAccepted', () => {
      setGameTurns([]);
      setPlayerSymbols('X')
      setRematchRequested(false);
      setWaitingForRematch(false);
    });
  
    socket.on('rematchRequested', () => {
      if (!rematchRequested) {
        setRematchRequested(false);
        setWaitingForRematch(true);
      } else {
        socket.emit('acceptRematch', { roomId });
        setGameTurns([]);
        setRematchRequested(true);
        setWaitingForRematch(false);
      }
    });
  
    // Cleanup socket listeners on unmount
    return () => {
      socket.off('rematchAccepted');
      socket.off('rematchRequested');
    };
  }, [rematchRequested, roomId]);

  useEffect(() => {
    socket.on('playerDisconnected', () => {
      // Reset the game state
      handleRestart();
    });
  
    socket.on('resetGameBoard', () => {
      // Reset the game state and show a waiting message
      handleChangeRoomID(); // Implement this function to reset the game state
    });

    return () => {
      socket.off('playerDisconnected');
      socket.off('resetGameBoard');
    };
  }, [socket]);

  useEffect(() => {
    if (roomId && connectedPlayers.length <= 2) {
      setGameTurns([]); // Reset game turns if condition is met
      setPlayerSymbols('X');
    }
  }, [roomId, connectedPlayers.length]);

  function handleRestart() {
    setGameTurns([]);
    socket.emit('restartGame');
  }

  function handleJoinRandomRoom() {
    socket.emit('joinRandomRoom');
    
    socket.on('assignRoomId', (assignedRoomId) => {
      setRoomId(assignedRoomId);
    });
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => ({
      ...prevPlayers,
      [symbol]: newName
    }));
    
    // Emit the name change to the server
    if (roomId) {
      socket.emit('updatePlayerName', { roomId, symbol, newName });
    }
  
    if (roomId) {
      socket.emit('changePlayerName', { symbol, newName, roomId });
    }
  }
  

  const handleModeSelection = (selectedMode) => {
    setMode(selectedMode);
    setDifficulty(null); // Reset difficulty when changing mode
    setGameTurns([]); // Reset game turns when changing mode
  };

  const handleSelectJoinMethod = (method) => {
    setJoinMethod(method);
  };
  
  const handleDifficultySelection = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
  };

  const handleJoinRoom = (newRoomId) => {
    setRoomId(newRoomId);
    socket.emit('joinRoom', newRoomId);
  };
  function handleRematch() {
    if (mode === 'human') {
      setRematchRequested(true);
      socket.emit('requestRematch', { roomId });
      setWaitingForRematch(true);
    } else {
      handleRestart();
    }
  }
  
  const handleChangeMode = () => {
    if (roomId) {
      socket.emit('leaveRoom', { roomId });
    }
    setMode(null);
    setDifficulty(null);
    setGameTurns([]);
    setRoomId(null);
    setWaitingForOpponent(true);
    setConnectedPlayers([]);
    setErrorMessage('');
    setRoomId('');
    setRematchRequested(false);
    setWaitingForRematch(false);
    setJoinMethod(false)
  };

  const handleChangeRoomID = () => {
    setDifficulty(null);
    setGameTurns([]);
    setRoomId(null);
    setWaitingForOpponent(true);
    setConnectedPlayers([]);
    setErrorMessage('');
    setRoomId('');
    setRematchRequested(false);
    setWaitingForRematch(false);
  };
  return (
    <div>
      {!mode ? (
        <ModeSelection onSelectMode={handleModeSelection} />
      ) : mode === 'human' && !roomId ? (
        !joinMethod ? (
          <JoinMethodSelection onSelectJoinMethod={handleSelectJoinMethod} onJoinRandomRoom={handleJoinRandomRoom} />
        ) : joinMethod === 'roomId' ? (
          <RoomIdForm 
          onJoinRoom={handleJoinRoom}
          connectedPlayers={connectedPlayers}
          />
        ) : null
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
        <main>
          <div id="game-container">
            {(winner || hasDraw) && (
              <GameOver
                winner={winner}
                players={players}
                playerSymbols={playerSymbols}
                onRestart={handleRematch}
                onChangeMode={handleChangeMode}
                isWaitingForRematch={waitingForRematch}
                rematchRequested={rematchRequested}
              />
            )}
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