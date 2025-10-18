import { useEffect, useRef, useState } from "react"
import { createEmptyBoard } from "../utils/gameLogic"
import type { Player, WinningLine } from "../utils/gameLogic"
import { type Board as BoardType } from "../utils/gameLogic"
import GameInfo from "./GameInfo"
import Board from "./Board"
import { WebSocketService } from "../utils/websocket"

interface OnlineGameProps {
  onWin: () => void
  onLoss: () => void
  onDraw: () => void
  onBackToMenu: () => void
}

function OnlineGame({ onWin, onLoss, onDraw, onBackToMenu }: OnlineGameProps) {
  //player
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [playerSymbol, setPlayerSymbol] = useState<Player>(null)

  //server
  const [isWaiting, setIsWaiting] = useState<boolean>(true)

  const [gameStatus, setGameStatus] = useState<string>(
    "Connecting to server..."
  )
  //game
  const [board, setBoard] = useState<BoardType>(createEmptyBoard())
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null)
  const [isGameActive, setIsGameActive] = useState<boolean>(false)

  const wsService = useRef<WebSocketService | null>(null)
  const gameResultReportedRef = useRef<boolean>(false)
  const playerSymbolRef = useRef<Player>(null)

  // Store callbacks in refs to avoid dependency issues
  const callbacksRef = useRef({ onWin, onLoss, onDraw })
  useEffect(() => {
    callbacksRef.current = { onWin, onLoss, onDraw }
  }, [onWin, onLoss, onDraw])

  useEffect(() => {
    let isActive = true
    console.log('OnlineGame: useEffect running, setting up WebSocket...')

    const initWebSocket = async () => {
      if (!isActive) {
        console.log('Effect already cleaned up, aborting connection...')
        return
      }

      wsService.current = new WebSocketService()

      //waiting   gameStart  moveMade gameOver rematchStated, opponnent disconected, erro
      wsService.current.onConnectionStatus((status) => {
        switch (status) {
          case "connecting":
            setGameStatus("Connecting to server...")
            break
          case "connected":
            setGameStatus("Connected! Waiting for opponent...")
            break
          case "disconnected":
            setGameStatus("Disconnected from server")
            setIsGameActive(false)
            break

          case "error":
            setGameStatus("Connection Error. Retrying...")
            setIsGameActive(false)
            break
          default:
            break
        }
      })

      wsService.current.on("gameStart", (data) => {
        setIsWaiting(false)
        setIsGameActive(true)
        setPlayerSymbol(data.playerSymbol)
        playerSymbolRef.current = data.playerSymbol
        setCurrentPlayer("X") //x start first
        setGameStatus(data.message)
        setBoard(Array(9).fill(null))
        setWinningLine(null)
        gameResultReportedRef.current = false
      })

      wsService.current.on("waiting", (data) => {
        setIsWaiting(true)
        setGameStatus(data.message || "Waiting for opponent...")
      })

      wsService.current.on("error", (data) => {
        setGameStatus(`Error: ${data.message}`)
      })

      wsService.current.on("gameOver", (data) => {
        setBoard(data.board)
        setIsGameActive(false)

        if (data.winner) {
          const winningLine: WinningLine = {
            indices: data.winningLine,
            winner: data.winner,
          }
          setWinningLine(winningLine)

          if (data.winner === playerSymbolRef.current) {
            setGameStatus("You win!")
            if (!gameResultReportedRef.current) {
              callbacksRef.current.onWin()
              gameResultReportedRef.current = true
            }
          } else {
            setGameStatus("You lose!")
            if (!gameResultReportedRef.current) {
              callbacksRef.current.onLoss()
              gameResultReportedRef.current = true
            }
          }
        } else {
          setGameStatus("It's a draw!")
          if (!gameResultReportedRef.current) {
            callbacksRef.current.onDraw()
            gameResultReportedRef.current = true
          }
        }
      })

      wsService.current.on("moveMade", (data) => {
        setBoard(data.board)
        setCurrentPlayer(data.currentPlayer)

        if (data.currentPlayer === playerSymbolRef.current) {
          setGameStatus("Your turn!")
        } else {
          setGameStatus("Opponent is thinking...")
        }
      })

      wsService.current.on("opponentDisconnected", (data) => {
        setGameStatus(data.message)
        setIsGameActive(false)
        if (!gameResultReportedRef.current) {
          callbacksRef.current.onWin()
          gameResultReportedRef.current = true
        }
      })

      // connect to server
      try {
        if (!isActive) {
          console.log('Component unmounted during setup, aborting...')
          return
        }

        console.log("Attempting to connect to WebSocket server...")
        await wsService.current.connect()

        if (!isActive) {
          console.log('Component unmounted during connection, disconnecting...')
          wsService.current.disconnect()
          return
        }

        console.log("WebSocket connected successfully, sending join message...")
        wsService.current.send("join")
      } catch (error) {
        if (!isActive) {
          console.log('Component unmounted, ignoring connection error')
          return
        }
        console.error("Failed to connect to server:", error)
        setGameStatus("Failed to connect to server. Retrying...")
      }
    }

    initWebSocket()

    //cleanup
    return () => {
      console.log("Cleanup: marking effect as inactive and disconnecting WebSocket")
      isActive = false
      if (wsService.current) {
        wsService.current.disconnect()
        wsService.current = null
      }
    }
  }, []) // Empty dependency array - only run once on mount

  const handleCellClick = (index: number) => {
    if (
      board[index] !== null ||
      !isGameActive ||
      currentPlayer !== playerSymbol
    )
      return

    //send
    wsService.current?.send("move", { position: index })
  }

  const handleBackToMenu = () => {
    if (wsService.current) {
      wsService.current.disconnect()
    }
    onBackToMenu()
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <button
            onClick={handleBackToMenu}
            className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg
                     hover:bg-gray-300 active:scale-95 transition-all font-semibold'
          >
            ← Back to Menu
          </button>

          <div className='bg-purple-600 font-semibold text-white px-4 py-2 rounded-lg'>
            Online Mode
          </div>
        </div>

        <h1 className='text-5xl font-bold text-center mb-8 text-gray-800'>
          Tic Tac Toe
        </h1>

        {/* Player Info */}
        {playerSymbol && (
          <div className='bg-white rounded-lg shadow-md p-4 mb-6 text-center'>
            <p className='text-lg text-gray-700'>
              You are playing as{" "}
              <span className='font-bold text-blue-600'> {playerSymbol}</span>
            </p>
          </div>
        )}

        {/* Waiting Screen */}
        {isWaiting && (
          <div className='bg-white rounded-lg shadow-md p-8 mb-6 text-center'>
            <div className='animate-pulse mb-4'>
              <div className='inline-block h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            </div>
            <p className='text-xl font-semibold text-gray-700'>{gameStatus}</p>
          </div>
        )}

        {!isWaiting && (
          <>
            <GameInfo
              currentPlayer={currentPlayer}
              gameStatus={gameStatus}
              isPlayerTurn={currentPlayer === playerSymbol}
            />

            <Board
              board={board}
              onCellClick={handleCellClick}
              winningLine={winningLine}
              disabled={!isGameActive || currentPlayer !== playerSymbol}
            />

            <div className='flex gap-4 justify-center mt-6 max-w-md mx-auto'>
              {!isGameActive && !isWaiting && (
                <button
                  onClick={handleBackToMenu}
                  className='w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold
                           hover:bg-blue-700 active:scale-95 transition-all shadow-md'
                >
                  Back to Menu
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OnlineGame
