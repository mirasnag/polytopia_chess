import type { Unit } from "@/types/game";
import classes from "./UnitView.module.scss";
import { getUnitFullbodyModel } from "@/data/unitModels";

interface Props {
  unit: Unit;
}

const UnitView: React.FC<Props> = ({ unit }) => {
  const unitModel = getUnitFullbodyModel(unit.type);

  return (
    <div className={classes.container}>
      <img src={unitModel} className={classes.unitModel} />
    </div>
  );
};

export default UnitView;
