// components
import UnitModel from "../unit/UnitModel";

// data
import { getUnitBaseStats, getUnitTraits } from "@/data/unitBaseStats";

// types
import type { Unit } from "@/types/game";

// styles
import classes from "./UnitPanel.module.scss";
import { UNIT_TRAITS } from "@/data/unitTraits";

interface Props {
  unit: Unit;
}

const UnitPanel: React.FC<Props> = ({ unit }) => {
  const unitType = unit.type;
  const { hp, movement, range, attack, defense } = getUnitBaseStats(unitType);
  const traitKeys = getUnitTraits(unitType);
  const traits = traitKeys.map((traitKey) => UNIT_TRAITS[traitKey]);

  return (
    <div className={classes.layout}>
      <div className={classes.container}>
        <div className={classes.unitType}>
          <h2>{unitType}</h2>
        </div>

        <div className={classes.unitModel}>
          <UnitModel unitType={unitType} />
        </div>

        <div className={classes.traitList}>
          {traits.map((trait, index) => (
            <div key={index} className={classes.trait}>
              <span>{traitKeys[index]}</span>
              <div className={classes.traitTooltip}>{trait.description}</div>
            </div>
          ))}
        </div>

        <div className={classes.statList}>
          <h3 className={classes.statLine}>
            <span>Health:</span>
            <span>{hp}</span>
          </h3>
          <h3 className={classes.statLine}>
            <span>Attack:</span>
            <span>{attack}</span>
          </h3>
          <h3 className={classes.statLine}>
            <span>Defense:</span>
            <span>{defense}</span>
          </h3>
          <h3 className={classes.statLine}>
            <span>Movement:</span>
            <span>{movement}</span>
          </h3>
          <h3 className={classes.statLine}>
            <span>Range:</span>
            <span>{range}</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default UnitPanel;
