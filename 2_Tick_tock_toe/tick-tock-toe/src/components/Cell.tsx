import type { Player } from "../utils/gameLogic";

interface CellProps {
  value: Player;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

/*
 Without transition-all: Changes happen instantly
 With transition-all: Changes animate smoothly
*/
function Cell({ value, onClick, isWinning, disabled }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value != null}
      className={` border-2 border-gray-300 rounded-lg
        w-full text-6xl font-bold
        aspect-square
        transition-all duration-200
        hover:bg-gray-100 active:scale-95
        disabled:cursor-not-allowed
        ${isWinning ? "bg-green-200 border-green-500" : "bg-white"}
        ${value === "X" ? "text-red-500" : "text-blue-500"}
        `}
      aria-label={value ? `Cell with ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

export default Cell;
