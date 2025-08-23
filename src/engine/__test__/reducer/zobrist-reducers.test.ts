import { Map as IMap } from "immutable";

import {
  createZobristTable,
  computeZobristKey,
  getUnitZIndex,
  updateZobristKeyUnits,
  ZtableLength,
} from "@/engine/reducers/zobrist";
import { UnitRecord } from "@/types/unit";
import type { PlayerId, UnitId } from "@/types/id";

// Helper: build a UnitRecord conveniently
function makeUnitRecord(opts: {
  id: string;
  ownerId: PlayerId;
  type: any;
  x: number;
  y: number;
  hp: number;
  attack?: number;
  defense?: number;
  movement?: number;
  range?: number;
}) {
  const {
    id,
    ownerId,
    type,
    x,
    y,
    hp,
    attack = 1,
    defense = 0,
    movement = 1,
    range = 1,
  } = opts;

  // UnitRecord constructor expects the full Unit shape
  return new UnitRecord({
    id: id as UnitId,
    type,
    ownerId,
    position: { x, y },
    stats: {
      hp,
      attack,
      defense,
      movement,
      range,
    },
  });
}

function makeUnitsMap(units: ReturnType<typeof makeUnitRecord>[]) {
  return IMap(units.map((u) => [u.id, u]));
}

describe("Zobrist integration tests (Units shape: UnitRecord, Units: Immutable.Map)", () => {
  test("zTable length matches exported ZtableLength", () => {
    const zTable = createZobristTable();
    expect(zTable.length).toBe(ZtableLength);
  });

  test("computeZobristKey deterministic for same units & zTable", () => {
    const zTable = createZobristTable();
    const u1 = makeUnitRecord({
      id: "u1",
      ownerId: 0,
      type: "warrior",
      x: 0,
      y: 0,
      hp: 1,
    });
    const u2 = makeUnitRecord({
      id: "u2",
      ownerId: 1,
      type: "archer",
      x: 3,
      y: 4,
      hp: 5,
    });

    const units = makeUnitsMap([u1, u2]);

    const k1 = computeZobristKey(zTable, units, 0);
    const k2 = computeZobristKey(zTable, units, 0);
    expect(k1).toBe(k2);
  });

  test("changing hp changes the key", () => {
    const zTable = createZobristTable();
    const u1 = makeUnitRecord({
      id: "u1",
      ownerId: 0,
      type: "warrior",
      x: 1,
      y: 1,
      hp: 1,
    });
    const unitsA = makeUnitsMap([u1]);
    const kA = computeZobristKey(zTable, unitsA, 0);

    const u1b = makeUnitRecord({
      id: "u1",
      ownerId: 0,
      type: "warrior",
      x: 1,
      y: 1,
      hp: 2,
    });
    const unitsB = makeUnitsMap([u1b]);
    const kB = computeZobristKey(zTable, unitsB, 0);

    expect(kA).not.toBe(kB);
  });

  test("moving a unit changes the key", () => {
    const zTable = createZobristTable();
    const u = makeUnitRecord({
      id: "u1",
      ownerId: 0,
      type: "rider",
      x: 2,
      y: 2,
      hp: 3,
    });
    const k1 = computeZobristKey(zTable, makeUnitsMap([u]), 0);

    const moved = makeUnitRecord({
      id: "u1",
      ownerId: 0,
      type: "rider",
      x: 2,
      y: 3,
      hp: 3,
    });
    const k2 = computeZobristKey(zTable, makeUnitsMap([moved]), 0);

    expect(k1).not.toBe(k2);
  });

  test("adding or removing a unit changes the key", () => {
    const zTable = createZobristTable();
    const a = makeUnitRecord({
      id: "a",
      ownerId: 0,
      type: "warrior",
      x: 0,
      y: 0,
      hp: 1,
    });
    const b = makeUnitRecord({
      id: "b",
      ownerId: 0,
      type: "archer",
      x: 1,
      y: 1,
      hp: 1,
    });

    const k1 = computeZobristKey(zTable, makeUnitsMap([a]), 0);
    const k2 = computeZobristKey(zTable, makeUnitsMap([a, b]), 0);
    expect(k1).not.toBe(k2);
  });

  test("getUnitZIndex returns index inside non-reserved range", () => {
    const u = makeUnitRecord({
      id: "u1",
      ownerId: 0,
      type: "warrior",
      x: 0,
      y: 0,
      hp: 1,
    });
    const idx = getUnitZIndex(u as any);
    // last index is reserved for turn XOR; index should be < ZtableLength - 1
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(ZtableLength - 1);
  });

  test("updateZobristKeyUnits matches recompute for a move (single unit changed)", () => {
    const zTable = createZobristTable();

    const beforeUnit = makeUnitRecord({
      id: "u1",
      ownerId: 0,
      type: "warrior",
      x: 2,
      y: 2,
      hp: 4,
    });
    const unitsBefore = makeUnitsMap([beforeUnit]);
    const fullBefore = computeZobristKey(zTable, unitsBefore, 0);

    // simulate moveReducer: unit moved from (2,2) -> (3,2)
    const afterUnit = makeUnitRecord({
      id: "u1",
      ownerId: 0,
      type: "warrior",
      x: 3,
      y: 2,
      hp: 4,
    });
    const unitsAfter = makeUnitsMap([afterUnit]);

    // update using arrays as moveReducer does
    const newKeyViaUpdater = updateZobristKeyUnits(
      fullBefore,
      zTable,
      [beforeUnit],
      [afterUnit]
    );

    const fullAfter = computeZobristKey(zTable, unitsAfter, 0);
    expect(newKeyViaUpdater).toBe(fullAfter);
  });

  test("updateZobristKeyUnits matches recompute for attack that kills a unit", () => {
    const zTable = createZobristTable();

    // attacker and defender before
    const attackerBefore = makeUnitRecord({
      id: "a",
      ownerId: 0,
      type: "warrior",
      x: 1,
      y: 1,
      hp: 5,
    });
    const defenderBefore = makeUnitRecord({
      id: "d",
      ownerId: 1,
      type: "archer",
      x: 1,
      y: 2,
      hp: 2,
    });

    const unitsBefore = makeUnitsMap([attackerBefore, defenderBefore]);
    const fullBefore = computeZobristKey(zTable, unitsBefore, 0);

    // after attack: defender is removed (undefined), attacker might have same stats (or changed if your engine reduces hp)
    const attackerAfter = makeUnitRecord({
      id: "a",
      ownerId: 0,
      type: "warrior",
      x: 1,
      y: 1,
      hp: 5,
    });
    const unitsAfter = makeUnitsMap([attackerAfter]);

    const newKeyViaUpdater = updateZobristKeyUnits(
      fullBefore,
      zTable,
      [attackerBefore, defenderBefore],
      [attackerAfter, undefined] // mirrors call in your attackReducer
    );

    const fullAfter = computeZobristKey(zTable, unitsAfter, 0);
    expect(newKeyViaUpdater).toBe(fullAfter);
  });
});
