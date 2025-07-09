// main library
import { useNavigate } from "react-router-dom";

// styles
import classes from "./HomeView.module.scss";

const HomeView = () => {
  const navigate = useNavigate();

  const handleNewGameClick = () => {
    navigate("game");
  };

  return (
    <div className={classes.layout}>
      <div className={classes.gameButtons}>
        <button className={classes.button} onClick={handleNewGameClick}>
          New Game
        </button>
        <button className={classes.button}>Resume Game</button>
      </div>
    </div>
  );
};

export default HomeView;
