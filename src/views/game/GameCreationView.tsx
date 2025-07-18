import styles from "./GameCreationView.module.scss";

interface Props {}

const GameCreationView: React.FC<Props> = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.buttons}>
        <button>Play vs Bot</button>
        <button>Play vs Human</button>
      </div>
    </div>
  );
};

export default GameCreationView;
