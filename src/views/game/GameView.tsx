// hooks
import { useEffect, useMemo, useState } from "react";
import { useGame } from "@/context/game/GameContext";

// components
import GameBoard from "@/components/game/GameBoard";
import HUD from "@/components/game/HUD";
import BackButton from "@/components/game/BackButton";
import MenuButtons from "@/components/game/MenuButtons";
import GameOutcomeModal from "@/components/game/GameOutcomeModal";
import UnitPanel from "@/components/game/UnitPanel";

// types
import type { Tile } from "@/types/tile";

// styles
import classes from "./GameView.module.scss";

const GameView = () => {
  const { state, units, currentPlayer, outcome } = useGame();
  const [activeTile, setActiveTile] = useState<Tile | null>(null);

  const activeUnitId = activeTile?.occupantId;

  const activeUnit = useMemo(() => {
    if (!activeUnitId) return null;
    const unit = units[activeUnitId];
    return unit?.ownerId === currentPlayer.id ? unit : null;
  }, [activeTile, units, currentPlayer]);

  useEffect(() => {
    const logGameState = () => {
      console.log("Game state:", state);
    };

    (window as any).gs = logGameState;

    return () => {
      delete (window as any).gs;
    };
  }, []);

  return (
    <div className={classes.layout}>
      <div className={classes.backButtonContainer}>
        <BackButton />
      </div>
      <div className={classes.HUDContainer}>
        <HUD />
      </div>
      <div className={classes.menuContainer}>
        <MenuButtons />
      </div>
      <div className={classes.boardContainer}>
        <GameBoard activeTile={activeTile} setActiveTile={setActiveTile} />
      </div>
      <div className={classes.leftPanel}>
        {activeUnit && <UnitPanel unit={activeUnit} />}
      </div>
      {outcome.status === "finished" && <GameOutcomeModal />}
    </div>
  );
};

export default GameView;
