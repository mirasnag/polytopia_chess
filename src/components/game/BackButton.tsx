import classes from "./BackButton.module.scss";

const BackButton = () => {
  return (
    <div className={classes.layout}>
      <button className={classes.backButton}>Back</button>
    </div>
  );
};

export default BackButton;
