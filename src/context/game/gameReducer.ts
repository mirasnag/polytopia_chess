// helpers
import {
  advanceReducer,
  attackReducer,
  createReducer,
  moveReducer,
  resignReducer,
} from "./helpers";
import type { PayloadFor } from "./helpers/actionPayload";

// types
import type { GameState } from "@/types/game";
import type { UnitActionKey } from "@/types/unit";

export type GameAction =
  | { type: "Create" }
  | { type: "Resign" }
  | { type: "Advance" }
  | {
      [K in UnitActionKey]: { type: K; payload: PayloadFor<K> };
    }[UnitActionKey];

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "Create":
      return createReducer();
    case "Resign":
      return resignReducer(state);
    case "Advance":
      return advanceReducer(state);
    case "move":
      const { unitId, to } = action.payload;
      return moveReducer(state, unitId, to.x, to.y);
    case "attack":
      const { attackingUnitId, defendingUnitId } = action.payload;
      return attackReducer(state, attackingUnitId, defendingUnitId);

    default:
      return state;
  }
}
