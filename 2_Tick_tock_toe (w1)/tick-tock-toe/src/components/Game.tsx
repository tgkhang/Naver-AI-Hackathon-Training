import { useEffect, useState } from "react";
import Board from "./Board";
import {
  createEmptyBoard,
  type WinningLine,
  type Board as BoardType,
  type Player,
  makeMove,
  checkWinner,
  isDraw,
} from "../utils/gameLogic";
import { getAIMove, type Difficulty } from "../utils/ai";
import PerformanceMetrics from "./PerformanceMetrics";
import GameInfo from "./GameInfo";

interface GameProps {
  difficulty: Difficulty;
  onWin: () => void;
  onLoss: () => void;
  onDraw: () => void;
  onBackToMenu: () => void;
}

function Game({ difficulty, onWin, onLoss, onDraw, onBackToMenu }: GameProps) {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameStatus, setGameStatus] = useState<string>("Your turn!");
  const [aiMetrics, setAiMetrics] = useState({
    positionsEvaluated: 0,
    thinkingTime: 0,
  });

  // ingame state
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [isGameActive, setIsGameActive] = useState<boolean>(true);

  const [gameResultReported, setGameResultReported] = useState<boolean>(false);

  useEffect(() => {
    const winner = checkWinner(board);

    if (winner && !gameResultReported) {
      setWinningLine(winner);
      setIsGameActive(false);
      setGameResultReported(true);

      if (winner.winner === "X") {
        setGameStatus("You win!");
        onWin();
      } else {
        setGameStatus("AI wins!");
        onLoss();
      }
    } else if (isDraw(board) && !gameResultReported) {
      setGameStatus("It's a draw!");
      setIsGameActive(false);
      setGameResultReported(true);
      onDraw();
    }
  }, [board, onWin, onLoss, onDraw, gameResultReported]);

  //AI turn
  useEffect(() => {
    if (
      currentPlayer === "O" &&
      isGameActive &&
      !checkWinner(board) &&
      !isDraw(board)
    ) {
      // small delay to make the game feel more natural
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board, "O", difficulty);
        const newBoard = makeMove(board, aiMove.position, "O");

        setBoard(newBoard);
        setCurrentPlayer("X");
        setAiMetrics({
          positionsEvaluated: aiMove.positionsEvaluated,
          thinkingTime: aiMove.thinkingTime,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, isGameActive, board, difficulty]);

  //function
  const handleNewGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setWinningLine(null);
    setGameStatus("Your turn!");
    setIsGameActive(true);
    setAiMetrics({ positionsEvaluated: 0, thinkingTime: 0 });
    setGameResultReported(false);
  };

  const handleCellClick = (index: number) => {
    if (!isGameActive || currentPlayer !== "X" || board[index] !== null) {
      return;
    }

    const newBoard = makeMove(board, index, "X");
    setBoard(newBoard);
    setCurrentPlayer("O");
    setGameStatus("AI is thinking...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToMenu}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg
                     hover:bg-gray-300 active:scale-95 transition-all font-semibold"
          >
            ← Back to Menu
          </button>

          <div
            className={`px-4 py-2 rounded-lg font-semibold text-white ${
              difficulty === "easy" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {difficulty === "easy" ? "Easy Mode" : "Hard Mode"}
          </div>
        </div>

        <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
          Tic Tac Toe
        </h1>

        <GameInfo
          currentPlayer={currentPlayer}
          gameStatus={gameStatus}
          isPlayerTurn={currentPlayer === "X"}
        />

        <Board
          board={board}
          onCellClick={handleCellClick}
          winningLine={winningLine}
          disabled={!isGameActive || currentPlayer !== "X"}
        />

        <PerformanceMetrics
          positionsEvaluated={aiMetrics.positionsEvaluated}
          thinkingTime={aiMetrics.thinkingTime}
          difficulty={difficulty}
        />

        <div className="flex justify-center mt-6 mx-auto gap-4 max-w-md">
          <button
            onClick={handleNewGame}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold
                     hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
