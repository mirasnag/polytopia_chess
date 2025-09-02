import type { GameState } from "@/types/game";
import type { Unit, UnitType } from "@/types/unit";
import { useEffect } from "react";

interface UnitLog {
  // ID: UnitId,
  Type: UnitType;
  // Owner: PlayerId,
  X: number;
  Y: number;
  HP: number;
}

export function prettyLogUnits(state: GameState): void {
  // Convert units record into an array of display rows
  const rows: UnitLog[] = [];

  state.units.forEach((u: Unit) =>
    rows.push({
      Type: u.type,
      X: u.position.x,
      Y: u.position.y,
      HP: u.stats.hp,
    })
  );

  console.groupCollapsed(`Units (${rows.length})`);
  console.table(rows);
  console.groupEnd();
}

const EMPTY_CELL = "·";

export function prettyLogBoard(state: {
  map: GameState["map"];
  units: GameState["units"];
}): void {
  const { map, units } = state;
  const { width, height } = map;

  // 1. Initialize an empty board
  const board: string[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => EMPTY_CELL)
  );

  // 2. Fill in unit symbols (first letter of type, uppercase)
  units.forEach((u) => {
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
