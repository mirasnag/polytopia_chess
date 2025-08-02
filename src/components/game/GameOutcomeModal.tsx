// hooks
import { useGame } from "@/context/game/GameContext";
import { useNavigate } from "react-router-dom";

// components
import Modal from "../utils/Modal";

// styles
import classes from "./GameOutcomeModal.module.scss";

const GameOutcomeModal = () => {
  const { players, outcome, config, dispatch } = useGame();
  const navigate = useNavigate();

  const winner =
    outcome.status === "finished" ? players[outcome.winnerId].name : "";

  const handleRestartClick = () => {
    dispatch({
      type: "create",
      payload: { config: config },
    });
  };

  const handleNewGameClick = () => {
    navigate("/game/creation");
  };

  return (
    <Modal size="full">
      <div className={classes.layout}>
        <h3 className={classes.title}>{`Game is ${
          winner ? "finished" : "ongoing"
        }`}</h3>
        {outcome.status === "finished" && (
          <div className={classes.message}>
            <div>Player {winner} won!</div>
          </div>
        )}
        <div className={classes.actions}>
          <button onClick={handleRestartClick}>Restart</button>
          <button onClick={handleNewGameClick}>New Game</button>
        </div>
      </div>
    </Modal>
  );
};

export default GameOutcomeModal;
