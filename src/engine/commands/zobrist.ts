import type { ZobristKey, ZobristTable } from "@/types/game";
import type { Unit, UnitType, Units } from "@/types/unit";
import { randomBigInt } from "@/utils/bigint.util";

export const ZtableLength = 2 * 6 * 64 * 10 + 1;

export type Undo = () => void;

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

export function getUnitZIndex(unit: Unit): number {
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
  for (const [, u] of units) {
    zKey ^= zTable[getUnitZIndex(u)];
  }
  return zKey;
}

export function updateZobristKeyUnitsCommand(
  state: { zKey: ZobristKey; zTable: ZobristTable },
  unitsBefore: (Unit | null | undefined)[],
  unitsAfter: (Unit | null | undefined)[]
): Undo {
  const prevKey = state.zKey;

  // apply
  for (const u of unitsBefore) {
    if (u) state.zKey ^= state.zTable[getUnitZIndex(u)];
  }
  for (const u of unitsAfter) {
    if (u) state.zKey ^= state.zTable[getUnitZIndex(u)];
  }

  // undo
  return () => {
    state.zKey = prevKey;
  };
}

export function updateZobristKeyAdvanceTurnCommand(state: {
  zKey: ZobristKey;
  zTable: ZobristTable;
}): Undo {
  // apply
  state.zKey ^= state.zTable[ZtableLength - 1];

  // undo
  return () => {
    state.zKey ^= state.zTable[ZtableLength - 1];
  };
}
