// library imports
import { Map as IMap, List } from "immutable";

// types
import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";
import { UnitRecord, type Unit } from "@/types/unit";
import { serializeBigIntData } from "@/utils/bigint.util";
import type { Tile } from "@/types/tile";

const STORAGE_KEY = "gameState";

export const gameManager = {
  load(): GameState | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const objState = JSON.parse(raw);
      const unitsRaw = Object.values(objState.units) as Unit[];
      const tilesRaw = objState.map.tiles as Tile[][];

      return {
        ...objState,
        units: IMap<UnitId, UnitRecord>(
          unitsRaw.map((value) => [value.id, new UnitRecord(value)])
        ),
        map: {
          ...objState.map,
          tiles: List<List<Tile>>(tilesRaw.map((row) => List<Tile>(row))),
        },
      };
    } catch {
      console.warn("Invalid game state in storage");
      return null;
    }
  },

  save(state: GameState) {
    localStorage.setItem(STORAGE_KEY, serializeBigIntData(state));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  hasSavedGame(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },
};
