// hooks
import { useGame } from "@/context/game/GameContext";

// styles
import classes from "./MenuButtons.module.scss";

const MenuButtons = () => {
  const { dispatch } = useGame();

  const handleResignButtonClick = () => {
    dispatch({
      type: "resign",
      payload: {},
    });
  };

  const handleDoneButtonClick = () => {
    dispatch({
      type: "advance",
      payload: {},
    });
  };

  return (
    <div className={classes.layout}>
      <button className={classes.button} onClick={handleResignButtonClick}>
        Resign
      </button>
      <button className={classes.button} onClick={handleDoneButtonClick}>
        Done
      </button>
    </div>
  );
};

export default MenuButtons;
