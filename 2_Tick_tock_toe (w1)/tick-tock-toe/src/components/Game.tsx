import { useState } from "react";
import Board from "./Board";
import { createEmptyBoard, type Board as BoardType } from "../utils/gameLogic";
import type { Difficulty } from "../utils/ai";
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
        <GameInfo />
        
        <Board board={board} />

        <PerformanceMetrics />

        <div>
          <button>New Game</button>
        </div>
      </div>
    </div>
  );
}

export default Game;
