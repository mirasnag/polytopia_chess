// library imports
import { Map as IMap } from "immutable";

// types
import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";
import type { TileKey } from "@/types/tile";
import { UnitRecord, type Unit } from "@/types/unit";

// utils
import { serializeBigIntData } from "@/utils/bigint.util";

const STORAGE_KEY = "gameState";

export const gameManager = {
  load(): GameState | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const objState = JSON.parse(raw);
      const unitsRaw = Object.values(objState.units) as Unit[];
      const occupancyRaw = objState.map.occupancy as [TileKey, UnitId][];

      return {
        ...objState,
        units: IMap<UnitId, UnitRecord>(
          unitsRaw.map((value) => [value.id, new UnitRecord(value)])
        ),
        map: {
          ...objState.map,
          occupancy: IMap(occupancyRaw),
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
