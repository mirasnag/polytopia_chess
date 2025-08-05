// __tests__/combat.test.ts
import { Map as IMap } from "immutable";
import {
  calculateDamage,
  canAttack,
  getValidAttacks,
  getValidAttacksMask,
} from "@/engine/helpers/combat";
import * as ubs from "@/data/unitBaseStats";
import { UnitRecord, type Unit } from "@/types/unit";
import type { GameState, Turn } from "@/types/game";
import type { UnitId } from "@/types/id";

// Helper: create a minimal GameState
function makeState(
  units: IMap<string, UnitRecord>,
  occupancy: IMap<string, string>,
  turn: Turn,
  finished = false
): GameState {
  return {
    schemaVersion: { major: 1, minor: 0 },
    players: [], // unused here
    config: {} as any,
    zKey: BigInt(0),
    zTable: new BigInt64Array(0),
    units,
    map: {
      width: 3,
      height: 3,
      occupancy,
    },
    turn,
    outcome: finished ? { status: "finished" } : { status: "ongoing" },
  } as any;
}

describe("combat helpers", () => {
  let uA: UnitRecord, uB: UnitRecord;
  let units: IMap<string, UnitRecord>;
  let occupancy: IMap<string, string>;
  const posA = { x: 1, y: 1 };
  const posB = { x: 2, y: 1 };
  const idA = "unit-A" as UnitId;
  const idB = "unit-B" as UnitId;

  beforeEach(() => {
    // Build two units: A and B, different owners
    uA = new UnitRecord({
      id: idA,
      type: "warrior",
      ownerId: 0,
      position: posA,
      stats: ubs.getUnitBaseStats("warrior"),
    });
    uB = new UnitRecord({
      id: idB,
      type: "archer",
      ownerId: 1,
      position: posB,
      stats: ubs.getUnitBaseStats("archer"),
    });
    units = IMap([
      [idA, uA],
      [idB, uB],
    ]);
    occupancy = IMap([
      [`${posA.y},${posA.x}`, idA],
      [`${posB.y},${posB.x}`, idB],
    ]);
  });

  describe("calculateDamage()", () => {
    it("returns base + attack - defense but not less than 0", () => {
      // normal case
      const dmg = calculateDamage(uA, uB);
      const expected = Math.max(
        0,
        5 +
          ubs.getUnitBaseStats("warrior").attack -
          ubs.getUnitBaseStats("archer").defense
      );
      expect(dmg).toBe(expected);

      const atk = new UnitRecord({
        ...(uA.toJS() as Unit),
        stats: { ...uA.stats, attack: 1 },
      });
      const def = new UnitRecord({
        ...(uB.toJS() as Unit),
        stats: { ...uB.stats, defense: 100 },
      });
      // defense so high => 0 damage
      expect(calculateDamage(atk, def)).toBe(0);
    });
  });

  describe("canAttack()", () => {
    let turn: Turn;

    beforeEach(() => {
      turn = {
        counter: 1,
        currentPlayerId: 0,
        actingUnitId: null,
        actions: [],
      };
    });

    it("allows attack when unit has not acted", () => {
      expect(canAttack(uA, turn)).toBe(true);
    });

    it("denies attack after acting with a different unit", () => {
      turn.actingUnitId = "unit-X" as UnitId;
      expect(canAttack(uA, turn)).toBe(false);
    });

    it("denies attack after unit already attacked", () => {
      turn.actingUnitId = idA;
      turn.actions = [{ type: "attack", payload: {} } as any];
      expect(canAttack(uA, turn)).toBe(false);
    });

    it("allows dash attack if unit has 'dash' trait and only moved", () => {
      // monkey-patch that warrior has dash
      const spy = jest
        .spyOn(ubs, "getUnitTraits")
        .mockImplementation((t) => (t === uA.type ? ["dash"] : []));
      turn.actingUnitId = idA;
      turn.actions = [{ type: "move", payload: {} } as any];
      expect(canAttack(uA, turn)).toBe(true);
      spy.mockRestore();
    });

    it("allows persist attack if last action was kill and unit has 'persist'", () => {
      const spy = jest
        .spyOn(ubs, "getUnitTraits")
        .mockImplementation((t) => (t === uA.type ? ["persist"] : []));
      turn.actingUnitId = idA;
      turn.actions = [
        { type: "move", payload: {} } as any,
        { type: "kill", payload: {} } as any,
      ];
      expect(canAttack(uA, turn)).toBe(true);
      spy.mockRestore();
    });
  });

  describe("getValidAttacks() & getValidAttacksMask()", () => {
    let state: GameState;

    beforeEach(() => {
      // start with no actions and ongoing
      state = makeState(
        units,
        occupancy,
        {
          counter: 0,
          currentPlayerId: 0,
          actingUnitId: null,
          actions: [],
        },
        false
      );
    });

    it("returns empty set/mask when game is finished", () => {
      const finished = makeState(units, occupancy, state.turn, true);
      expect(getValidAttacks(finished, uA).size).toBe(0);
      const mask = getValidAttacksMask(finished, uA);
      expect(mask.flat().every((b) => b === false)).toBe(true);
    });

    it("returns only enemy tiles within range", () => {
      const attacks = getValidAttacks(state, uA);
      expect(attacks.size).toBe(1);
      // mask should mark [1][2] true
      const mask = getValidAttacksMask(state, uA);
      expect(mask[posB.y][posB.x]).toBe(true);
      // other positions false
      expect(mask[0][0]).toBe(false);
    });

    it("returns empty if canAttack is false", () => {
      state.turn.actingUnitId = idA;
      state.turn.actions = [{ type: "attack", payload: {} } as any];
      const attacks = getValidAttacks(state, uA);
      expect(attacks.size).toBe(0);
      expect(
        getValidAttacksMask(state, uA)
          .flat()
          .every((b) => !b)
      ).toBe(true);
    });
  });
});
