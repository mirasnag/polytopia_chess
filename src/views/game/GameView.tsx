// hooks
import { useEffect } from "react";
import { useGame } from "@/context/game/GameContext";

// components
import GameBoard from "@/components/game/GameBoard";
import HUD from "@/components/game/HUD";
import BackButton from "@/components/game/BackButton";
import MenuButtons from "@/components/game/MenuButtons";

// styles
import classes from "./GameView.module.scss";

const GameView = () => {
  const { state } = useGame();

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
        <GameBoard />
      </div>
    </div>
  );
};

export default GameView;
