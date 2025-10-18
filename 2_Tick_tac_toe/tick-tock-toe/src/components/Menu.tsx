import { useEffect, useState } from "react"
import type { Difficulty } from "../utils/ai"
import { WebSocketService } from "../utils/websocket"

interface MenuProps {
  onStartGame: (difficulty: Difficulty) => void
  onStartOnlineGame: () => void
  wins: number
  losses: number
  draws: number
  currentStreak: number
  onResetScore: () => void
}

function Menu({
  onStartGame,
  onStartOnlineGame,
  wins,
  losses,
  draws,
  currentStreak,
  onResetScore,
}: MenuProps) {
  const [isServerAvailable, setIsServerAvailable] = useState<boolean>(false)

  useEffect(() => {
    console.log('Menu: Testing WebSocket server connection...')
    WebSocketService.testConnection()
      .then((available) => {
        console.log('Menu: Server availability:', available)
        setIsServerAvailable(available)
      })
      .catch((error) => {
        console.error('Menu: Server test failed:', error)
        setIsServerAvailable(false)
      })
  }, [])

  return (
    <div
      className='
        flex items-center justify-center
        py-8 px-4
        min-h-screen bg-gradient-to-br
        from-blue-50 to-purple-50
    '
    >
      {/* Max width = medium Element can shrink smaller, but won't grow beyond 448px*/}
      <div className='w-full max-w-md'>
        <h1 className='text-6xl font-bold text-center mb-4 text-gray-800'>
          Tic Tac Toe
        </h1>
        <p className='text-center text-gray-600 mb-12 text-lg'>
          Challenge AI and test your skills
        </p>

        {/* Statistic */}
        <div>
          <h2 className='text-xl font-bold text-center mb-4 text-gray-800'>
            Your Statistic
          </h2>
          <div className='grid grid-cols-3 gap-4 mb-4'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-green-600'>{wins}</div>
              <div className='text-sm text-gray-600'>Wins</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-red-600'>{losses}</div>
              <div className='text-sm text-gray-600'>Losses</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl font-bold text-gray-600'>{draws}</div>
              <div className='text-sm text-gray-600'>Draws</div>
            </div>
          </div>

          <div className='text-center pt-4 border-t border-gray-400'>
            <div className='text-sm text-gray-600'>Current Streaks</div>
            <div
              className={`text-2xl font-bold ${
                currentStreak > 0 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {currentStreak > 0 ? `${currentStreak} 🔥` : "0"}
            </div>
          </div>
        </div>

        {/* Difficult Selection */}
        <div className='space-y-4 mb-6'>
          <h2 className='text-2xl font-bold text-center text-gray-800 mb-4'>
            Choose Difficulty
          </h2>

          <button
            onClick={() => onStartGame("easy")}
            className='w-full py-4 px-6 bg-green-600 text-white rounded-lg font-bold text-xl
                     hover:bg-green-700 active:scale-95 transition-all shadow-lg
                     flex items-center justify-between'
          >
            <span>Easy Mode</span>
            <span className='text-sm font-normal'>Beatable AI</span>
          </button>

          <button
            onClick={() => onStartGame("hard")}
            className='w-full py-4 px-6 bg-red-600 text-white rounded-lg font-bold text-xl
                     hover:bg-red-700 active:scale-95 transition-all shadow-lg
                     flex items-center justify-between'
          >
            <span>Hard Mode</span>
            <span className='text-sm font-normal'>Unbeatable AI</span>
          </button>

          <button
            onClick={onStartOnlineGame}
            className={`w-full py-4 px-6 rounded-lg font-bold text-xl
                     active:scale-95 transition-all shadow-lg
                     flex items-center justify-between
                     ${
                       isServerAvailable === false
                         ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                         : "bg-purple-600 text-white hover:bg-purple-700"
                     }`}
            disabled={isServerAvailable === false}
          >
            <span>Play Online</span>
            <span className='text-sm font-normal'>
              {isServerAvailable === null
                ? "Checking..."
                : isServerAvailable
                ? 'Play with real person'
                : "Server Offline"}
            </span>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={onResetScore}
          className='w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg
        hover:bg-gray-300 active:scale-95 transition-all'
        >
          Reset All Scores
        </button>

        {/* Info */}
        <div className='mt-8 text-center text-sm text-gray-500'>
          <p>You play as X</p>
          <p>Opponent/AI plays as O</p>
        </div>
      </div>
    </div>
  )
}

export default Menu
