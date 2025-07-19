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

const EMPTY_CELL = "·";

export function prettyLogBoard(state: GameState): void {
  const { map, units } = state;
  const { width, height } = map;

  // 1. Initialize an empty board
  const board: string[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => EMPTY_CELL)
  );

  // 2. Fill in unit symbols (first letter of type, uppercase)
  Object.values(units).forEach((u) => {
    const { x, y } = u.position;
    const symbol = u.type.charAt(0).toUpperCase();
    board[y][x] = symbol;
  });

  // 3. Log with row & column headers
  const header = [" ", ...Array.from({ length: width }, (_, i) => i)].join(" ");
  console.groupCollapsed("Board State");
  console.log(header);
  board.forEach((row, rowIndex) => {
    console.log([rowIndex, ...row].join(" "));
  });
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
