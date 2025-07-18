import type { GameState, Unit } from "@/types/game";
import { useEffect } from "react";

export function prettyLogUnits(state: GameState): void {
  // Convert units record into an array of display rows
  const rows = Object.values(state.units).map((u: Unit) => ({
    // ID: u.id,
    Type: u.type,
    // Owner: u.ownerId,
    X: u.position.x,
    Y: u.position.y,
    HP: u.stats.hp,
  }));

  console.groupCollapsed(`Units (${rows.length})`);
  console.table(rows);
  console.groupEnd();
}

export function useLogGameState(state: GameState) {
  useEffect(() => {
    const logGameState = () => {
      console.log("Game state:", state);
    };

    (window as any).gs = logGameState;

    return () => {
      delete (window as any).gs;
    };
  }, []);
}
