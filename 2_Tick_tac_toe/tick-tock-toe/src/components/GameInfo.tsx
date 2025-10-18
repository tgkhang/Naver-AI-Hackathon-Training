import type { Player } from "../utils/gameLogic";

interface GameInfoProps {
  currentPlayer: Player;
  gameStatus: string;
  isPlayerTurn: boolean;
}

function GameInfo({ currentPlayer, gameStatus, isPlayerTurn }: GameInfoProps) {
  return (
    <div className=" text-center mb-6">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">{gameStatus}</h2>

      {currentPlayer &&
        !gameStatus.includes("wins") &&
        !gameStatus.includes("Draw") && (
          <p className="text-lg text-gray-600">
            {isPlayerTurn
              ? "Your turn (You're X)"
              : "AI is thinking... (AI is O)"}
          </p>
        )}
    </div>
  );
}

export default GameInfo;
