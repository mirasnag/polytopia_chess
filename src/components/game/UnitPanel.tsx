// components
import UnitModel from "../unit/UnitModel";

// data
import { getUnitBaseStats, getUnitSkills } from "@/data/unitBaseStats";
import { UNIT_ACTIONS } from "@/data/unitActions";

// types
import type { Unit } from "@/types/game";

// styles
import classes from "./UnitPanel.module.scss";

interface Props {
  unit: Unit;
}

const UnitPanel: React.FC<Props> = ({ unit }) => {
  const unitType = unit.type;
  const { hp, movement, range, attack, defense } = getUnitBaseStats(unitType);
  const skillKeys = getUnitSkills(unitType);
  const skills = skillKeys.map((skillKey) => UNIT_ACTIONS[skillKey]);

  return (
    <div className={classes.layout}>
      <div className={classes.container}>
        <div className={classes.unitType}>
          <h2>{unitType}</h2>
        </div>

        <div className={classes.unitModel}>
          <UnitModel unitType={unitType} />
        </div>

        <div className={classes.skillList}>
          {skills.map((skill, index) => (
            <div key={index} className={classes.skill}>
              <span>{skillKeys[index]}</span>
              <div className={classes.skillTooltip}>{skill.description}</div>
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
