// __tests__/map.test.ts
import { Map as IMap } from "immutable";
import {
  createMap,
  moveTileOccupant,
  removeTileOccupant,
  replaceTileOccupant,
} from "@/engine/reducers/map";
import type { MapGrid } from "@/types/tile";
import type { UnitId } from "@/types/id";
import { UnitRecord } from "@/types/unit";
import { getUnitBaseStats } from "@/data/unitBaseStats";

describe("map helpers", () => {
  const width = 4;
  const height = 3;
  let unitsMap: IMap<UnitId, UnitRecord>;
  let mapGrid: MapGrid;

  beforeEach(() => {
    // create two units at (1,1) and (2,0)
    const u1id = "u1" as UnitId;
    const u1 = new UnitRecord({
      id: u1id,
      type: "warrior",
      ownerId: 0,
      position: { x: 1, y: 1 },
      stats: getUnitBaseStats("warrior"),
    });
    const u2id = "u2" as UnitId;
    const u2 = new UnitRecord({
      id: u2id,
      type: "archer",
      ownerId: 1,
      position: { x: 2, y: 0 },
      stats: getUnitBaseStats("archer"),
    });
    unitsMap = IMap<UnitId, UnitRecord>([
      [u1id, u1],
      [u2id, u2],
    ]);
    mapGrid = createMap(width, height, unitsMap);
  });

  test("createMap sets dimensions and occupancy correctly", () => {
    expect(mapGrid.width).toBe(width);
    expect(mapGrid.height).toBe(height);
    // occupancy keys should match unit positions
    expect(mapGrid.occupancy.get("1,1")).toBe("u1");
    expect(mapGrid.occupancy.get("0,2")).toBe("u2");
    // no other occupancy entries
    expect(mapGrid.occupancy.size).toBe(2);

    const emptyMap = createMap();
    expect(emptyMap.occupancy.size).toBe(0);
  });

  test("moveTileOccupant: moves unitId from old to new key", () => {
    const oldPos = { x: 1, y: 1 };
    const newPos = { x: 0, y: 2 };
    const movedMap = moveTileOccupant(mapGrid, oldPos, newPos);

    // old key no longer occupied
    expect(movedMap.occupancy.has("1,1")).toBe(false);

    // new key now holds the same unit
    expect(movedMap.occupancy.get(`${newPos.y},${newPos.x}`)).toBe("u1");

    // other units remain unchanged
    expect(movedMap.occupancy.get("0,2")).toBe("u2");
    expect(movedMap.occupancy.size).toBe(2);
  });

  test("removeTileOccupant deletes the occupant at given position", () => {
    const pos = { x: 2, y: 0 };
    const removed = removeTileOccupant(mapGrid, pos);
    expect(removed.occupancy.has("0,2")).toBe(false);
    expect(removed.occupancy.get("1,1")).toBe("u1");
    expect(removed.occupancy.size).toBe(1);
  });

  test("replaceTileOccupant moves occupant without throwing", () => {
    const from = { x: 1, y: 1 };
    const to = { x: 3, y: 2 };
    const replaced = replaceTileOccupant(mapGrid, from, to);
    expect(replaced.occupancy.has("1,1")).toBe(false);
    expect(replaced.occupancy.get(`${to.y},${to.x}`)).toBe("u1");
    // other unit unchanged
    expect(replaced.occupancy.get("0,2")).toBe("u2");
  });
});
