import { type Player } from "../utils/gameLogic"

interface CustomBoardProps {
  board: Player[]
  onCellClick: (index: number) => void
  winningLine: number[] | null
  disabled: boolean
  size: number
}

function CustomBoard({
  board,
  onCellClick,
  winningLine,
  disabled,
  size,
}: CustomBoardProps) {
  const isWinningCell = (index: number): boolean => {
    return winningLine?.includes(index) ?? false
  }

  // Calculate cell size based on board size
  const cellSize = size === 10 ? "50px" : "60px"
  const fontSize = size === 10 ? "text-xl" : "text-6xl"

  return (
    <div
      className='grid gap-1 mx-auto p-4 bg-gray-100 rounded-lg shadow-lg'
      style={{
        gridTemplateColumns: `repeat(${size}, ${cellSize})`,
        gridTemplateRows: `repeat(${size}, ${cellSize})`,
        width: "fit-content",
      }}
    >
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell != null}
          className={`border-2 border-gray-300 rounded
            ${fontSize} font-bold
            transition-all duration-200
            hover:bg-gray-100 active:scale-95
            disabled:cursor-not-allowed
            ${isWinningCell(index) ? "bg-green-200 border-green-500" : "bg-white"}
            ${cell === "X" ? "text-red-500" : "text-blue-500"}
            `}
          style={{
            width: cellSize,
            height: cellSize,
          }}
          aria-label={cell ? `Cell with ${cell}` : "Empty cell"}
        >
          {cell}
        </button>
      ))}
    </div>
  )
}

export default CustomBoard
