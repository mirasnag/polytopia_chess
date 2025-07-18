// helpers
import {
  advanceReducer,
  attackReducer,
  createReducer,
  moveReducer,
  resignReducer,
} from "./helpers";

// types
import type { GameState } from "@/types/game";
import type { GameAction } from "@/types/action";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "create":
      return createReducer();
    case "resign":
      return resignReducer(state);
    case "advance":
      return advanceReducer(state);
    case "move":
      const { unitId, to } = action.payload;
      return moveReducer(state, unitId, to);
    case "attack":
      const { attackingUnitId, defendingUnitId } = action.payload;
      return attackReducer(state, attackingUnitId, defendingUnitId);

    default:
      return state;
  }
}
