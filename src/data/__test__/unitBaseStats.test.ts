// __tests__/unitBaseStats.test.ts
import {
  getAllUnitBaseStats,
  getUnitBaseStats,
  getUnitTraits,
} from "@/data/unitBaseStats";
import { UNIT_BASE_STATS } from "@/data/unitBaseStats";
import type { UnitType } from "@/types/unit";

describe("unitBaseStats helpers", () => {
  it("getAllUnitBaseStats returns the full stats object", () => {
    const all = getAllUnitBaseStats();
    expect(all).toBe(UNIT_BASE_STATS);
    // spot-check a couple of known unit types
    expect(all.warrior).toHaveProperty("attack", expect.any(Number));
    expect(all.knight).toHaveProperty("movement", 3);
  });

  it("getUnitBaseStats(unitType) returns the correct entry", () => {
    (Object.keys(UNIT_BASE_STATS) as UnitType[]).forEach((type) => {
      expect(getUnitBaseStats(type)).toBe(UNIT_BASE_STATS[type]);
    });
  });

  it("getUnitTraits returns defined traits or empty array", () => {
    // 1) If a unit has traits
    // Monkey-patch one entry to have traits
    const fakeType = "warrior" as UnitType;
    const original = UNIT_BASE_STATS[fakeType].traits;
    UNIT_BASE_STATS[fakeType].traits = ["dash"];
    expect(getUnitTraits(fakeType)).toEqual(["dash"]);

    // 2) If undefined, returns []
    delete UNIT_BASE_STATS[fakeType].traits;
    expect(getUnitTraits(fakeType)).toEqual([]);

    // restore
    if (original) {
      UNIT_BASE_STATS[fakeType].traits = original;
    } else {
      delete UNIT_BASE_STATS[fakeType].traits;
    }
  });
});
