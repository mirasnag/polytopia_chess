// helpers
import {
  attackUnit,
  createInitialGameState,
  moveUnit,
  resign,
} from "./helpers";

// types
import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";

export type GameAction =
  | { type: "Create" }
  | { type: "Move"; payload: { unitId: UnitId; to: { x: number; y: number } } }
  | {
      type: "Attack";
      payload: { attackingUnitId: UnitId; defendingUnitId: UnitId };
    }
  | { type: "Resign" };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "Create":
      return createInitialGameState();
    case "Move":
      const { unitId, to } = action.payload;
      return moveUnit(state, unitId, to.x, to.y);
    case "Attack":
      const { attackingUnitId, defendingUnitId } = action.payload;
      return attackUnit(state, attackingUnitId, defendingUnitId);
    case "Resign":
      return resign(state);

    default:
      return state;
  }
}
