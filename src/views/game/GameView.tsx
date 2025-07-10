import GameBoard from "@/components/game/GameBoard";
import classes from "./GameView.module.scss";

const GameView = () => {
  return (
    <div className={classes.layout}>
      <div className={classes.gameBoardContainer}>
        <GameBoard />
      </div>
    </div>
  );
};

export default GameView;
