// __tests__/units.test.ts
import { Map as IMap } from "immutable";
import { moveUnit, attackUnit, createUnits } from "@/engine/reducers/units";
import { UnitRecord } from "@/types/unit";
import { getUnitBaseStats } from "@/data/unitBaseStats";
import type { UnitType } from "@/types/unit";
import type { UnitId } from "@/types/id";

// Helper to build a tiny board for tests
const tinyBoard = [
  ["__", "__", "__"],
  ["w0", "a1", "__"],
  ["__", "__", "__"],
];

describe("engine/reducers/units", () => {
  let units: IMap<UnitId, UnitRecord>;
  beforeEach(() => {
    units = createUnits(tinyBoard);
  });

  it("createUnitsStr places exactly two units with correct types", () => {
    expect(units.size).toBe(2);

    const arr = units.valueSeq().toArray();
    const types = arr.map((u) => u.type).sort();
    expect(types).toEqual(["archer", "warrior"]);

    // Find warrior at (0,1)
    const warrior = arr.find((u) => u.type === ("warrior" as UnitType))!;
    expect(warrior.position).toEqual({ x: 0, y: 1 });
    expect(warrior.ownerId).toBe(0);

    // Find archer at (1,1)
    const archer = arr.find((u) => u.type === ("archer" as UnitType))!;
    expect(archer.position).toEqual({ x: 1, y: 1 });
    expect(archer.ownerId).toBe(1);
  });

  it("moveUnit moves the correct unit immutably", () => {
    const [unitId] = units.keySeq().toArray();
    const orig = units.get(unitId)!;
    const newPos = { x: orig.position.x + 1, y: orig.position.y };

    const after = moveUnit(units, unitId, newPos);
    const moved = after.get(unitId)!;

    expect(moved.position).toEqual(newPos);
    // other fields unchanged
    expect(moved.type).toBe(orig.type);
    expect(moved.stats).toEqual(orig.stats);

    // original untouched
    expect(units.get(unitId)!.position).toEqual(orig.position);
  });

  describe("attackUnit", () => {
    let atkId: UnitId, defId: UnitId;
    let atk: UnitRecord, def: UnitRecord;
    beforeEach(() => {
      // reset units
      units = createUnits(tinyBoard);
      // pick warrior as attacker, archer as defender
      const arr = units.valueSeq().toArray();
      atk = arr.find((u) => u.type === "warrior")!;
      def = arr.find((u) => u.type === "archer")!;
      atkId = atk.id;
      defId = def.id;
    });

    it("reduces HP of defending unit when damage is non-lethal", () => {
      // make defender tough: bump hp
      const bigHP = getUnitBaseStats(def.type).hp + 100;
      units = units.set(defId, def.set("stats", { ...def.stats, hp: bigHP }));

      const after = attackUnit(units, atkId, defId);
      const newDef = after.get(defId)!;

      expect(newDef.stats.hp).toBeLessThan(bigHP);
      // attacker unchanged
      expect(after.get(atkId)!.position).toEqual(atk.position);
      expect(after.size).toBe(2);
    });

    it("removes defending unit when damage is lethal", () => {
      // set defender hp to 1 so that any damage kills
      units = units.set(defId, def.set("stats", { ...def.stats, hp: 1 }));

      const after = attackUnit(units, atkId, defId);
      expect(after.has(defId)).toBe(false);
      // only attacker remains
      expect(after.size).toBe(1);
    });

    it("slides melee attacker into defender square on kill", () => {
      // for a ranged unit (range > 1) we can override stats to simulate melee
      const meleeAtk = atk.set("stats", { ...atk.stats, range: 1 });
      units = units.set(atkId, meleeAtk);
      units = units.set(defId, def.set("stats", { ...def.stats, hp: 1 }));

      const after = attackUnit(units, atkId, defId);
      const finalAtt = after.get(atkId)!;
      // attacker should end up at defender's former position
      expect(finalAtt.position).toEqual(def.position);
    });

    it("throws if attacker or defender not found", () => {
      expect(() => attackUnit(units, "nope" as any, defId)).toThrow();
      expect(() => attackUnit(units, atkId, "nope" as any)).toThrow();
    });
  });
});
