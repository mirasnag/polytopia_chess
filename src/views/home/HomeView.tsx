// main library
import { useNavigate } from "react-router-dom";

// helpers
import { gameManager } from "@/managers/gameManager";

// styles
import classes from "./HomeView.module.scss";

const HomeView = () => {
  const navigate = useNavigate();

  const handleNewGameClick = () => {
    gameManager.clear();
    navigate("game");
  };

  const handleResumeGameClick = () => {
    navigate("game");
  };

  return (
    <div className={classes.layout}>
      <div className={classes.gameButtons}>
        <button className={classes.button} onClick={handleNewGameClick}>
          New Game
        </button>
        <button className={classes.button} onClick={handleResumeGameClick}>
          Resume Game
        </button>
      </div>
    </div>
  );
};

export default HomeView;
