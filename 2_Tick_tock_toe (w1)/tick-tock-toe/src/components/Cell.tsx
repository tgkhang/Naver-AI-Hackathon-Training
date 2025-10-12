import type { Player } from "../utils/gameLogic";

interface CellProps {
  value: Player;
}

function Cell({ value }: CellProps) {
  return (
    <button
      className={` border-2 border-gray-300 rounded-lg
    
        `}
    >
      {value}
    </button>
  );
}

export default Cell;
