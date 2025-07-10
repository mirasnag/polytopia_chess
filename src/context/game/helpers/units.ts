// utils
import { createBrandedId } from "@/utils/common";
import { getUnitBaseStats } from "@/data/unitBaseStats";

// types
import type { Units } from "@/types/game";
import type { PlayerId } from "@/types/id";
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
      hp: getUnitBaseStats(unitType).hp,
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
