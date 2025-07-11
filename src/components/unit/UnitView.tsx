// data
import { getUnitFullbodyModel } from "@/data/unitModels";

// types
import type { Unit } from "@/types/game";

// styles
import classes from "./UnitView.module.scss";

interface Props {
  unit: Unit;
  isReady: boolean;
}

const UnitView: React.FC<Props> = ({ unit, isReady = false }) => {
  const unitModel = getUnitFullbodyModel(unit.type);

  return (
    <div className={classes.container}>
      <div className={classes.hp}>{unit.hp}</div>

      <div className={classes.modelContainer}>
        <img
          src={unitModel}
          className={`${classes.model} ${isReady ? classes.ready : ""}`}
        />
      </div>
    </div>
  );
};

export default UnitView;
