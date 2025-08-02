import { useGame } from "@/context/game/GameContext";
import styles from "./GameCreationView.module.scss";
import { type PlayerType } from "@/types/game";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const playerTypes: Record<PlayerType, string> = {
  "easy-bot": "Easy bot",
  "normal-bot": "Normal bot",
  "hard-bot": "Hard bot",
  "crazy-bot": "Crazy bot",
  human: "Human",
};

interface Props {}

const GameCreationView: React.FC<Props> = () => {
  const { dispatch } = useGame();
  const [selectedPlayerTypes, setSelectedPlayerTypes] = useState<PlayerType[]>([
    "human",
    "easy-bot",
  ]);
  const navigate = useNavigate();

  const handleStartButtonClick = () => {
    dispatch({
      type: "create",
      payload: {
        config: {
          playerTypes: selectedPlayerTypes,
        },
      },
    });

    navigate("/game");
  };

  const handleSelectChange = (playerId: number, newValue: PlayerType) => {
    const newPlayerTypes = selectedPlayerTypes.slice();
    newPlayerTypes[playerId] = newValue;
    setSelectedPlayerTypes(newPlayerTypes);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.contentWrapper}>
        <div className={styles.playerSelectors}>
          <select
            name="playerSelector"
            className={`${styles.playerSelector} button`}
            defaultValue={selectedPlayerTypes[0]}
            onChange={(e) =>
              handleSelectChange(0, e.target.value as PlayerType)
            }
          >
            {Object.entries(playerTypes).map(([type, title], index) => {
              return (
                <option key={index} value={type}>
                  {title}
                </option>
              );
            })}
          </select>
          <p className={styles.vsText}>VS</p>
          <select
            name="playerSelector"
            className={`${styles.playerSelector} button`}
            defaultValue={selectedPlayerTypes[1]}
            onChange={(e) =>
              handleSelectChange(1, e.target.value as PlayerType)
            }
          >
            {Object.entries(playerTypes).map(([type, title], index) => {
              return (
                <option key={index} value={type}>
                  {title}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.startButtonWrapper}>
          <button onClick={() => handleStartButtonClick()}>Start</button>
        </div>
      </div>
    </div>
  );
};

export default GameCreationView;
