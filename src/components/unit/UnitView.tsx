import type { Unit } from "@/types/game";
import classes from "./UnitView.module.scss";
import { getUnitFullbodyModel } from "@/data/unitModels";

interface Props {
  unit: Unit;
  handleUnitClick: (unit: Unit) => void;
}

const UnitView: React.FC<Props> = ({ unit, handleUnitClick }) => {
  const unitModel = getUnitFullbodyModel(unit.type);

  return (
    <div className={classes.container} onClick={() => handleUnitClick(unit)}>
      <img src={unitModel} className={classes.unitModel} />
    </div>
  );
};

export default UnitView;
