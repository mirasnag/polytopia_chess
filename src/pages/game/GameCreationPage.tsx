import { GameProvider } from "@/context/game/GameContext";
import GameCreationView from "@/views/game/GameCreationView";

const GameCreationPage = () => {
  return (
    <GameProvider>
      <GameCreationView />
    </GameProvider>
  );
};

export default GameCreationPage;
