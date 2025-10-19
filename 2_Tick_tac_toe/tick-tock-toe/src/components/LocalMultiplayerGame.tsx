import { useState } from "react"
import CustomBoard from "./CustomBoard"
import { type Player } from "../utils/gameLogic"

const BOARD_SIZE = 10
const WIN_LENGTH = 5

type HistoryStep = {
  squares: Player[]
  location: { row: number; col: number } | null
}

function calculateWinner(squares: Player[]): {
  winner: Player
  line: number[] | null
} {
  // Check horizontal
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - WIN_LENGTH; col++) {
      const start = row * BOARD_SIZE + col
      const line = Array.from({ length: WIN_LENGTH }, (_, i) => start + i)
      if (checkLine(squares, line)) {
        return { winner: squares[line[0]], line }
      }
    }
  }

  // Check vertical
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
      const line = Array.from(
        { length: WIN_LENGTH },
        (_, i) => (row + i) * BOARD_SIZE + col
      )
      if (checkLine(squares, line)) {
        return { winner: squares[line[0]], line }
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
    for (let col = 0; col <= BOARD_SIZE - WIN_LENGTH; col++) {
      const line = Array.from(
        { length: WIN_LENGTH },
        (_, i) => (row + i) * BOARD_SIZE + (col + i)
      )
      if (checkLine(squares, line)) {
        return { winner: squares[line[0]], line }
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
    for (let col = WIN_LENGTH - 1; col < BOARD_SIZE; col++) {
      const line = Array.from(
        { length: WIN_LENGTH },
        (_, i) => (row + i) * BOARD_SIZE + (col - i)
      )
      if (checkLine(squares, line)) {
        return { winner: squares[line[0]], line }
      }
    }
  }

  return { winner: null, line: null }
}

function checkLine(squares: Player[], line: number[]) {
  const firstSquare = squares[line[0]]
  if (!firstSquare) return false
  return line.every((index) => squares[index] === firstSquare)
}

interface LocalMultiplayerGameProps {
  onBackToMenu?: () => void
}

function LocalMultiplayerGame({ onBackToMenu }: LocalMultiplayerGameProps = {}) {
  const [history, setHistory] = useState<HistoryStep[]>([
    {
      squares: Array(100).fill(null),
      location: null,
    },
  ])
  const [currentMove, setCurrentMove] = useState<number>(0)
  const [isAscending, setIsAscending] = useState(false)

  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove].squares

  function handlePlay(index:number) {
    if (calculateWinner(currentSquares).winner || currentSquares[index]) {
      return
    }

    const row = Math.floor(index / BOARD_SIZE)
    const col = index % BOARD_SIZE

    const nextSquares = currentSquares.slice()
    nextSquares[index] = xIsNext ? "X" : "O"

    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      {
        squares: nextSquares,
        location: { row, col },
      },
    ]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove:number) {
    setCurrentMove(nextMove)
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending)
  }

  function resetGame() {
    setHistory([
      {
        squares: Array(100).fill(null),
        location: null,
      },
    ])
    setCurrentMove(0)
  }

  const result = calculateWinner(currentSquares)
  const winner = result.winner
  const winningLine = result.line

  let status
  if (winner) {
    status = "Winner: " + winner
  } else if (currentSquares.every((square) => square !== null)) {
    status = "Draw! No one wins."
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  let moves = history.map((step, move) => {
    let description
    if (move > 0 && step.location) {
      const { row, col } = step.location
      description = `Go to move #${move} (${row}, ${col})`
    } else {
      description = "Go to game start"
    }

    // Current move should be text, not a button
    if (move === currentMove) {
      return (
        <li key={move}>
          <span className='inline-block px-4 py-2 bg-blue-500 text-white rounded font-bold text-sm'>
            You are at move #{move}
          </span>
        </li>
      )
    }

    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className='w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded text-sm text-left hover:bg-blue-50 hover:translate-x-1 transition-all shadow-sm'
        >
          {description}
        </button>
      </li>
    )
  })

  if (!isAscending) {
    moves = moves.reverse()
  }

  return (
    <div className='min-h-screen bg-gray-50 text-gray-900 p-8'>
      <div className='flex items-center justify-center mb-8 relative'>
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className='absolute left-0 px-4 py-2 bg-gray-600 text-white rounded-lg font-bold text-base hover:bg-gray-700 hover:-translate-y-0.5 transition-all shadow-lg'
          >
            ← Back to Menu
          </button>
        )}
        <h1 className='text-5xl font-bold text-blue-600'>
          10x10 Tic-Tac-Toe
        </h1>
      </div>

      <div className='flex flex-row gap-10 justify-center items-start max-w-7xl mx-auto'>
        <div className='flex-shrink-0'>
          {/* Game status */}
          <div className='text-2xl font-bold text-center text-blue-600 mb-4'>
            {status}
          </div>

          {/* New Game button */}
          <div className='flex justify-center mb-4'>
            <button
              onClick={resetGame}
              className='px-6 py-3 bg-green-600 text-white rounded-lg font-bold text-base hover:bg-green-700 hover:-translate-y-0.5 transition-all shadow-lg'
            >
              New Game
            </button>
          </div>

          {/* Board : using map, not hardcoded) */}
          <CustomBoard
            board={currentSquares}
            onCellClick={handlePlay}
            winningLine={winningLine}
            disabled={
              winner !== null ||
              currentSquares.every((square) => square !== null)
            }
            size={BOARD_SIZE}
          />
        </div>

        <div className='min-w-[280px]'>
          {/* Toggle button for sort order */}
          <button
            onClick={toggleSortOrder}
            className='w-full px-4 py-3 mb-4 bg-blue-600 text-white rounded-lg font-bold text-base hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg'
          >
            Sort: {isAscending ? "Ascending" : "Descending"}
          </button>

          {/* Move history with locations (Requirement #5: show row, col) */}
          <ol className='pl-5 max-h-[600px] overflow-y-auto space-y-2'>
            {moves}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default LocalMultiplayerGame
