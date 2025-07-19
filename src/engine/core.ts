// helpers
import {
  advanceReducer,
  attackReducer,
  createReducer,
  moveReducer,
  resignReducer,
} from "@/engine/reducers/index";

// types
import type { GameState } from "@/types/game";
import type { GameAction } from "@/types/action";

export const gameEngine = (
  state: GameState,
  actions: GameAction | GameAction[]
): GameState => {
  return Array.isArray(actions)
    ? applySequenceOfActions(state, actions)
    : applyAction(state, actions);
};

export const applySequenceOfActions = (
  state: GameState,
  actions: GameAction[]
): GameState => {
  if (actions.length === 0) return state;

  let curState = state;
  actions.forEach((action) => {
    curState = applyAction(curState, action);
  });

  return curState;
};

export const applyAction = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "create":
      const { config } = action.payload;
      return createReducer(config);
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
};
