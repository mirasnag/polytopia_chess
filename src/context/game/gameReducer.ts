// helpers
import {
  advance,
  attackUnit,
  createInitialGameState,
  moveUnit,
  resign,
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
      return createInitialGameState();
    case "Resign":
      return resign(state);
    case "Advance":
      return advance(state);
    case "move":
      const { unitId, to } = action.payload;
      return moveUnit(state, unitId, to.x, to.y);
    case "attack":
      const { attackingUnitId, defendingUnitId } = action.payload;
      return attackUnit(state, attackingUnitId, defendingUnitId);

    default:
      return state;
  }
}
