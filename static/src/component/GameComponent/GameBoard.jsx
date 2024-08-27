import React, { useState, useEffect } from "react";
import "./css/GameBoard.css";
import xImage from "../../img/x.png";
import oImage from "../../img/o.png";
import player1Image from "../../img/player1.jpg";
import player2Image from "../../img/player2.png";
import { useNavigate } from "react-router-dom";

// Utility functions
const getRandomMove = (board) => {
  const availableMoves = board
    .map((value, index) => (value === null ? index : null))
    .filter(value => value !== null);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const checkWinner = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((square) => square)) {
    return "Draw";
  }

  return null;
};

function GameBoard() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [timer, setTimer] = useState(15);
  const [winner, setWinner] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const navigate = useNavigate();

  const handleQuit = () => {
    navigate("/");
  };

  useEffect(() => {
    if (isGameOver) return;

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 15));
    }, 1000);

    if (timer === 0) {
      if (isXNext) {
        // If it is X's turn and time runs out, switch to O's turn and reset timer
        setIsXNext(false);
        setTimer(15);
      } else {
        // If it is O's turn and time runs out, make a move for the computer
        const computerMove = getRandomMove(board);
        if (computerMove !== undefined) {
          const newBoard = [...board];
          newBoard[computerMove] = "O";
          setBoard(newBoard);
          setIsXNext(true);
          setLastMoveTime(Date.now());
          setTimer(15);
        }
      }
    }

    return () => clearInterval(countdown);
  }, [timer, isXNext, isGameOver, board]);

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setWinner(winner);
      setIsGameOver(true);
    }
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || isGameOver || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXNext(false);
    setLastMoveTime(Date.now());
    setTimer(15);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsGameOver(false);
    setTimer(15);
  };

  return (
    <div className="game-container">
      {isGameOver && <div className="overlay" />}
      {isGameOver && (
        <div className="winner-popup">
          <h2 className="main-pop">{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>
          <button className="winner-btn" onClick={resetGame}>Try Again</button>
          <button className="Quit-btn" onClick={handleQuit}>Quit</button>
        </div>
      )}
      <div className="player-info">
        <div className={`player ${isXNext ? "act" : ""}`}>
          <img src={player1Image} alt="Player 1" />
          <p>Player 1 (X)</p>
        </div>
        <div className="timer">
          <p>{timer}</p>
        </div>
        <div className={`player ${!isXNext ? "act" : ""}`}>
          <img src={player2Image} alt="Player 2" />
          <p>Player 2 (O)</p>
        </div>
      </div>
      <div className="game-board">
        <div className="board-row">
          {board.slice(0, 3).map((_, index) => renderSquare(index))}
        </div>
        <div className="board-row">
          {board.slice(3, 6).map((_, index) => renderSquare(index + 3))}
        </div>
        <div className="board-row">
          {board.slice(6, 9).map((_, index) => renderSquare(index + 6))}
        </div>
      </div>
    </div>
  );

  function renderSquare(index) {
    const player = board[index];
    const squareClass = player
      ? `square ${player === "X" ? "square-x" : "square-o"}`
      : "square";
    return (
      <div className={squareClass} onClick={() => handleClick(index)}>
        {board[index] && (
          <img
            src={board[index] === "X" ? xImage : oImage}
            alt={board[index]}
          />
        )}
      </div>
    );
  }
}

export default GameBoard;
