// styles
import classes from "./BoardTile.module.scss";

interface Props {
  type: "move" | "attack";
}

const TileCircle: React.FC<Props> = ({ type }) => {
  return (
    <div className={`${classes.circleContainer} ${classes[type]}`}>
      <div className={classes.outerCircle}></div>
      <div className={classes.innerCircle}></div>
    </div>
  );
};

export default TileCircle;
