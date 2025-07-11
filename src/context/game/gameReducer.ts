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
  | { type: "Create"; payload: never }
  | { type: "Move"; payload: { unitId: UnitId; to: { x: number; y: number } } }
  | {
      type: "Attack";
      payload: { attackingUnitId: UnitId; defendingUnitId: UnitId };
    }
  | { type: "Resign"; payload: never };

export function gameReducer(state: GameState, action: GameAction): GameState {
  const { type, payload } = action;

  switch (type) {
    case "Create":
      return createInitialGameState();
    case "Move":
      return moveUnit(state, payload.unitId, payload.to.x, payload.to.y);
    case "Attack":
      return attackUnit(
        state,
        payload.attackingUnitId,
        payload.defendingUnitId
      );
    case "Resign":
      return resign(state);

    default:
      return state;
  }
}
