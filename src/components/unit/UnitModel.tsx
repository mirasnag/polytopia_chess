import { getUnitFullbodyModel } from "@/data/unitModels";
import classes from "./UnitModel.module.scss";
import type { UnitType } from "@/types/unit";

interface Props {
  unitType?: UnitType;
  isReady?: boolean;
}

const UnitModel: React.FC<Props> = ({
  unitType = "warrior",
  isReady = false,
}) => {
  const unitModel = getUnitFullbodyModel(unitType);
  return (
    <img
      src={unitModel}
      className={`${classes.model} ${isReady ? classes.ready : ""}`}
    />
  );
};

export default UnitModel;
