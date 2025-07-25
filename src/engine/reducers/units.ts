// libraries
import { Map as IMap } from "immutable";

// utils
import { createBrandedId } from "@/utils/common.util";
import { getUnitBaseStats } from "@/data/unitBaseStats";
import { calculateDamage } from "@/engine/helpers/combat";

// types
import type { PlayerId, UnitId } from "@/types/id";
import { UnitRecord, type UnitType, type Units } from "@/types/unit";

const edgeRowUnits: UnitType[] = [
  "catapult",
  "rider",
  "archer",
  "knight",
  "mindBender",
  "archer",
  "rider",
  "catapult",
];

const warriorRowUnits: UnitType[] = [
  "warrior",
  "warrior",
  "warrior",
  "warrior",
  "warrior",
  "warrior",
  "warrior",
  "warrior",
];

function placeRowUnits(
  units: Units,
  owner: PlayerId,
  unitTypes: UnitType[],
  row: number
) {
  for (let col = 0; col < unitTypes.length; col++) {
    const unitId = createBrandedId("unit");
    const unitType = unitTypes[col];

    const u = new UnitRecord({
      id: unitId,
      type: unitType,
      ownerId: owner,
      position: { x: col, y: row },
      stats: getUnitBaseStats(unitType),
    });

    units = units.set(unitId, u);
  }

  return units;
}

export function createUnits(playerA: PlayerId, playerB: PlayerId): Units {
  let units = IMap<UnitId, UnitRecord>();

  units = placeRowUnits(units, playerA, edgeRowUnits, 0);
  units = placeRowUnits(units, playerA, warriorRowUnits, 1);

  units = placeRowUnits(units, playerB, edgeRowUnits, 7);
  units = placeRowUnits(units, playerB, warriorRowUnits, 6);

  return units;
}

export function moveUnit(
  units: Units,
  movingUnitId: UnitId,
  to: { x: number; y: number }
): Units {
  return units.update(movingUnitId, (u) => u?.move(to));
}

export function attackUnit(
  units: Units,
  attackingUnitId: UnitId,
  defendingUnitId: UnitId
): Units {
  const attackingUnit = units.get(attackingUnitId);
  const defendingUnit = units.get(defendingUnitId);

  if (!attackingUnit || !defendingUnit) {
    throw new Error("Unit not found");
  }

  const damage = calculateDamage(attackingUnit, defendingUnit);
  const isKilled = defendingUnit.stats.hp <= damage;

  if (isKilled) {
    if (attackingUnit.stats.range === 1) {
      units = units.set(
        attackingUnitId,
        attackingUnit.set("position", defendingUnit.position)
      );
    }
    units = units.delete(defendingUnitId);
  } else {
    const damagedDefender = defendingUnit.set("stats", {
      ...defendingUnit.stats,
      hp: defendingUnit.stats.hp - damage,
    });
    units = units.set(defendingUnitId, damagedDefender);
  }

  return units;
}
