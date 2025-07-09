import { GameProvider } from "@/context/game/GameContext";
import GameView from "@/views/game/GameView";

const GamePage = () => {
  return (
    <GameProvider>
      <GameView />
    </GameProvider>
  );
};

export default GamePage;
