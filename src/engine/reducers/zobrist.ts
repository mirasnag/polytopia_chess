import type { ZobristKey, ZobristTable } from "@/types/game";
import type { PlayerId } from "@/types/id";
import type { Unit, UnitType, Units } from "@/types/unit";
import { randomBigInt } from "@/utils/bigint.util";

export const unitTypeIdx: Record<UnitType, number> = {
  warrior: 0,
  archer: 1,
  rider: 2,
  catapult: 3,
  knight: 4,
  mindBender: 5,
};

export const PLAYER_BUCKETS = 2;
export const UNIT_TYPE_BUCKETS = Object.keys(unitTypeIdx).length; // 6
export const BOARD_SQUARES = 8 * 8;
export const HP_BUCKETS = 10;
export const PLAYER_ORDER_BUCKETS = 1;

export const ZtableLength =
  PLAYER_BUCKETS * UNIT_TYPE_BUCKETS * BOARD_SQUARES * HP_BUCKETS +
  PLAYER_ORDER_BUCKETS;

export function createZobristTable(): ZobristTable {
  const table = new BigInt64Array(ZtableLength);
  for (let i = 0; i < ZtableLength; i++) table[i] = randomBigInt();
  return table;
}

export function getUnitZIndex(unit: Unit) {
  return (
    ((unit.ownerId * UNIT_TYPE_BUCKETS + unitTypeIdx[unit.type]) *
      BOARD_SQUARES +
      unit.position.x * 8 +
      unit.position.y) *
      HP_BUCKETS +
    unit.stats.hp -
    1
  );
}

export function computeZobristKey(
  zTable: ZobristTable,
  units: Units,
  currentPlayerId: PlayerId
): ZobristKey {
  let zKey = BigInt(0);

  for (const [_, unit] of units) {
    const zIndex = getUnitZIndex(unit);
    zKey ^= zTable[zIndex];
  }

  if (currentPlayerId === 1) {
    zKey ^= zTable[ZtableLength - 1];
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
