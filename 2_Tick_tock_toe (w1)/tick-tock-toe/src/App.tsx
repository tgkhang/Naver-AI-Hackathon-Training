import { useState } from "react";
import "./App.css";
import Game from "./components/Game";
import { type Difficulty } from "./utils/ai";
import Menu from "./components/Menu";
import { useGameScore } from "./hooks/useGameScore";

type Screen = "menu" | "game";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("hard");

  const handleBackToMenu = () => {
    setCurrentScreen("menu");
  };

  const handleStartGame = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentScreen("game");
  };

  const { score, addWin, addLoss, addDraw, resetScore } = useGameScore();

  return (
    <>
      {currentScreen === "menu" ? (
        <Menu
          onStartGame={handleStartGame}
          wins={score.wins}
          losses={score.losses}
          draws={score.draws}
          currentStreak={score.currentStreak}
          onResetScore={resetScore}
        />
      ) : (
        <Game
          difficulty={selectedDifficulty}
          onWin={addWin}
          onLoss={addLoss}
          onDraw={addDraw}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </>
  );
}

export default App;
