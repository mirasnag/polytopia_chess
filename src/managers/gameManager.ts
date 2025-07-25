// library imports
import { Map as IMap } from "immutable";

// types
import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";
import { UnitRecord, type Unit } from "@/types/unit";

const STORAGE_KEY = "gameState";

export const gameManager = {
  load(): GameState | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const objState = JSON.parse(raw);
      const unitsArr = Object.values(objState.units) as Unit[];

      return {
        ...objState,
        units: IMap<UnitId, UnitRecord>(
          unitsArr.map((value) => [value.id, new UnitRecord(value)])
        ),
      };
    } catch {
      console.warn("Invalid game state in storage");
      return null;
    }
  },

  save(state: GameState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  hasSavedGame(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },
};
