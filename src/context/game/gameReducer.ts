import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";
import { createInitialGameState } from "./helpers";

export type GameAction =
  | { type: "Create" }
  | { type: "Move"; payload: { unitId: UnitId; x: number; y: number } }
  | { type: "Attack"; payload: { unitId: UnitId; x: number; y: number } };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "Create":
      return createInitialGameState();
    case "Move":
    case "Attack":
    default:
      return state;
  }
}
