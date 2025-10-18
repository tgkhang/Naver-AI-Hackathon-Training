import { type Board as BoardType, type WinningLine } from "../utils/gameLogic";
import Cell from "./Cell";

interface BoardProps {
  board: BoardType;
  onCellClick: (index: number) => void;
  winningLine: WinningLine | null;
  disabled: boolean;
}

function Board({ board, onCellClick, winningLine, disabled }: BoardProps) {
  const isWinningCell = (index: number): boolean => {
    return winningLine?.indices.includes(index) ?? false;
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto p-4">
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          isWinning={isWinningCell(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default Board;
