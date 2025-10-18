import { useState } from "react"
import "./App.css"
import Game from "./components/Game"
import { type Difficulty } from "./utils/ai"
import Menu from "./components/Menu"
import { useGameScore } from "./hooks/useGameScore"
import OnlineGame from "./components/OnlineGame"

type Screen = "menu" | "game" | "online"

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu")
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("hard")

  const handleBackToMenu = () => {
    setCurrentScreen("menu")
  }

  const handleStartGame = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty)
    setCurrentScreen("game")
  }

  const handleStartOnlineGame = () => {
    setCurrentScreen("online")
  }

  const { score, addWin, addLoss, addDraw, resetScore } = useGameScore()

  return (
    <>
      {currentScreen === "menu" && (
        <Menu
          onStartGame={handleStartGame}
          onStartOnlineGame={handleStartOnlineGame}
          wins={score.wins}
          losses={score.losses}
          draws={score.draws}
          currentStreak={score.currentStreak}
          onResetScore={resetScore}
        />
      )}
      {currentScreen === "game" && (
        <Game
          difficulty={selectedDifficulty}
          onWin={addWin}
          onLoss={addLoss}
          onDraw={addDraw}
          onBackToMenu={handleBackToMenu}
        />
      )}
      {currentScreen === "online" && (
        <OnlineGame
          onWin={addWin}
          onLoss={addLoss}
          onDraw={addDraw}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </>
  )
}

export default App
