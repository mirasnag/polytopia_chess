import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";
import { createInitialGameState, moveUnit } from "./helpers";

export type GameAction =
  | { type: "Create"; payload: never }
  | { type: "Move"; payload: { unitId: UnitId; to: { x: number; y: number } } }
  | {
      type: "Attack";
      payload: { unitId: UnitId; to: { x: number; y: number } };
    };

export function gameReducer(state: GameState, action: GameAction): GameState {
  const { type, payload } = action;

  switch (type) {
    case "Create":
      return createInitialGameState();
    case "Move":
      return moveUnit(state, payload.unitId, payload.to.x, payload.to.y);
    case "Attack":
    default:
      return state;
  }
}
