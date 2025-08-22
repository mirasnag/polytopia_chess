import type { ZobristKey, ZobristTable } from "@/types/game";
import type { Unit, UnitType, Units } from "@/types/unit";
import { randomBigInt } from "@/utils/bigint.util";

export const ZtableLength = 2 * 6 * 64 * 10 + 1;

export function createZobristTable(): ZobristTable {
  const table = new BigInt64Array(ZtableLength);

  for (let i = 0; i < ZtableLength; i++) {
    table[i] = randomBigInt();
  }

  return table;
}

export const unitTypeIdx: Record<UnitType, number> = {
  warrior: 0,
  archer: 1,
  rider: 2,
  catapult: 3,
  knight: 4,
  mindBender: 5,
};

export function getUnitZIndex(unit: Unit) {
  return (
    ((unit.ownerId * 6 + unitTypeIdx[unit.type]) * 64 +
      unit.position.x * 8 +
      unit.position.y) *
      10 +
    unit.stats.hp
  );
}

export function computeZobristKey(
  zTable: ZobristTable,
  units: Units
): ZobristKey {
  let zKey = BigInt(0);

  for (const [_, unit] of units) {
    const zIndex = getUnitZIndex(unit);
    zKey ^= zTable[zIndex];
  }

  return zKey;
}

type OptionalUnit = Unit | null | undefined;

// assumes that unitsBefore and unisAfter have the same size and unitsBefore[i].id === unitsAfter[i].id
export function updateZobristKeyUnits(
  oldKey: ZobristKey,
  zTable: ZobristTable,
  unitsBefore: OptionalUnit[],
  unitsAfter: OptionalUnit[]
): ZobristKey {
  let newKey = oldKey;

  unitsBefore.forEach((unit) => {
    newKey = unit ? newKey ^ zTable[getUnitZIndex(unit)] : newKey;
  });

  unitsAfter.forEach((unit) => {
    newKey = unit ? newKey ^ zTable[getUnitZIndex(unit)] : newKey;
  });

  return newKey;
}

export function updateZobristKeyAdvanceTurn(
  oldKey: ZobristKey,
  zTable: ZobristTable
) {
  return oldKey ^ zTable[ZtableLength - 1];
}
