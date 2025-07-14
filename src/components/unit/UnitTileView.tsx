// types
import type { Unit } from "@/types/game";

// styles
import classes from "./UnitTileView.module.scss";
import UnitModel from "./UnitModel";

interface Props {
  unit: Unit | null;
  isReady?: boolean;
}

const UnitView: React.FC<Props> = ({ unit, isReady = false }) => {
  return (
    <div className={classes.container}>
      <div className={classes.hp}>{unit?.stats.hp ?? 10}</div>

      <div className={classes.modelContainer}>
        <UnitModel unitType={unit?.type} isReady={isReady} />
      </div>
    </div>
  );
};

export default UnitView;
