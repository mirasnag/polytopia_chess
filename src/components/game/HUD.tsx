import { useGame } from "@/context/game/GameContext";
import classes from "./HUD.module.scss";

const HUD = () => {
  const { players, turn } = useGame();

  const {
    counter,
    playerOrder,
    orderIndex,
    actionPointsRemaining,
    actionPointsTotal,
  } = turn;

  const currentPlayerId = playerOrder[orderIndex];
  const { name: currentPlayerName } = players[currentPlayerId];

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
