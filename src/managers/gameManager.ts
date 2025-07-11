// types
import type { GameState } from "@/types/game";

const STORAGE_KEY = "gameState";

export const gameManager = {
  load(): GameState | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GameState;
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
