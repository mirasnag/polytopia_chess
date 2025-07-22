import { useGame } from "@/context/game/GameContext";
import styles from "./GameCreationView.module.scss";
import type { PlayerType } from "@/types/game";
import { useNavigate } from "react-router-dom";

interface Props {}

const GameCreationView: React.FC<Props> = () => {
  const { dispatch } = useGame();
  const navigate = useNavigate();

  const handleButtonClick = (opponentType: PlayerType) => {
    dispatch({
      type: "create",
      payload: {
        config: {
          playerTypes: ["human", opponentType],
        },
      },
    });

    navigate("/game");
  };

  return (
    <div className={styles.layout}>
      <div className={styles.buttons}>
        <button onClick={() => handleButtonClick("easy-bot")}>
          Play vs Easy Bot
        </button>
        <button onClick={() => handleButtonClick("normal-bot")}>
          Play vs Normal Bot
        </button>
        <button onClick={() => handleButtonClick("hard-bot")}>
          Play vs Hard Bot
        </button>
        <button onClick={() => handleButtonClick("crazy-bot")}>
          Play vs Crazy Bot
        </button>
        <button onClick={() => handleButtonClick("human")}>
          Play vs Human
        </button>
      </div>
    </div>
  );
};

export default GameCreationView;
