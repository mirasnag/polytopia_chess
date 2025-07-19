import { useGame } from "@/context/game/GameContext";
import classes from "./HUD.module.scss";

const HUD = () => {
  const { turn, currentPlayer } = useGame();

  const { counter, actionPointsRemaining, actionPointsTotal } = turn;

  const { name: currentPlayerName } = currentPlayer;

  return (
    <div className={classes.layout}>
      <h3 className={classes.text}>
        Turn:
        <span className={classes.highlightText}> {counter}</span>
      </h3>
      <h3 className={classes.text}>
        Player:
        <span className={classes.highlightText}> {currentPlayerName}</span>
      </h3>
      <h3 className={classes.text}>
        Action Points: {actionPointsRemaining} / {actionPointsTotal}
      </h3>
    </div>
  );
};

export default HUD;
