// hooks
import { useGame } from "@/context/game/GameContext";

// styles
import classes from "./MenuButtons.module.scss";

const MenuButtons = () => {
  const { dispatch } = useGame();

  const handleResignButtonClick = () => {
    dispatch({
      type: "Resign",
    });
  };

  return (
    <div className={classes.layout}>
      <button onClick={handleResignButtonClick}>Resign</button>
    </div>
  );
};

export default MenuButtons;
