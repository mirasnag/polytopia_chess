// utils
import { createBrandedId } from "@/utils/common.util";
import { getUnitBaseStats, getUnitTraits } from "@/data/unitBaseStats";
import { calculateDamage } from "@/engine/helpers/combat";

// types
import type { Turn, Unit, Units } from "@/types/game";
import type { PlayerId, UnitId } from "@/types/id";
import type { UnitType } from "@/types/unit";

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

    units[unitId] = {
      id: unitId,
      type: unitType,
      ownerId: owner,
      position: { x: col, y: row },
      stats: getUnitBaseStats(unitType),
      canAttack: true,
      canMove: true,
    };
  }
}

export function createUnits(playerA: PlayerId, playerB: PlayerId): Units {
  const units: Units = {};

  placeRowUnits(units, playerA, edgeRowUnits, 0);
  placeRowUnits(units, playerA, warriorRowUnits, 1);

  placeRowUnits(units, playerB, edgeRowUnits, 7);
  placeRowUnits(units, playerB, warriorRowUnits, 6);

  return units;
}

function resetUnitState(unit: Unit): Unit {
  const baseStats = getUnitBaseStats(unit.type);

  return {
    ...unit,
    canMove: true,
    canAttack: true,
    stats: {
      ...baseStats,
      hp: unit.stats.hp,
    },
  };
}

export function resetAllUnitState(units: Units): Units {
  const updatedUnits = Object.fromEntries(
    Object.entries(units).map(([id, unit]) => [id, resetUnitState(unit)])
  );

  return updatedUnits;
}

export function moveUnit(
  units: Units,
  movingUnitId: UnitId,
  to: { x: number; y: number },
  turn: Turn
): Units {
  const traits = getUnitTraits(units[movingUnitId].type);
  const hasAttacked = turn.actionsByUnit[movingUnitId]?.has("attack") ?? false;

  const movingUnit = {
    ...units[movingUnitId],
    canAttack: !hasAttacked && traits.includes("dash"),
    canMove: false,
    position: to,
  };

  return {
    ...units,
    [movingUnitId]: movingUnit,
  };
}

export function attackUnit(
  units: Units,
  attackingUnitId: UnitId,
  defendingUnitId: UnitId
): Units {
  const attackingUnit = units[attackingUnitId];
  const defendingUnit = units[defendingUnitId];

  const damage = calculateDamage(attackingUnit, defendingUnit);

  const isKilled = defendingUnit.stats.hp <= damage;
  const isMeleeRangedUnit = attackingUnit.stats.range === 1;

  const traits = getUnitTraits(attackingUnit.type);

  const updatedUnits: Units = {
    ...units,
    [attackingUnitId]: {
      ...attackingUnit,
      position:
        isKilled && isMeleeRangedUnit
          ? defendingUnit.position
          : attackingUnit.position,
      canAttack: isKilled && traits.includes("persist"),
      canMove: traits.includes("escape"),
    },
  };

  if (!isKilled) {
    updatedUnits[defendingUnitId] = {
      ...defendingUnit,
      stats: {
        ...defendingUnit.stats,
        hp: defendingUnit.stats.hp - damage,
      },
    };
  } else {
    delete updatedUnits[defendingUnitId];
  }

  return updatedUnits;
}
