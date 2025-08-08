// types
import type { GameState, Players, Turn } from "@/types/game";
import type { UnitAction } from "@/types/action";

type Undo = () => void;

export function getInitialTurn(): Turn {
  return {
    counter: 1,
    currentPlayerId: 0,
    actingUnitId: null,
    actions: [],
  };
}

export function advanceTurnCommand(turn: Turn, playerOrder: Players): Undo {
  const prevCounter = turn.counter;
  const prevPlayerId = turn.currentPlayerId;
  const prevActing = turn.actingUnitId;
  const prevActions = turn.actions.splice(0, turn.actions.length);

  // apply
  const isNext = prevPlayerId + 1 === playerOrder.length;
  turn.counter = isNext ? prevCounter + 1 : prevCounter;
  turn.currentPlayerId = isNext ? 0 : prevPlayerId + 1;
  turn.actingUnitId = null;
  // actions already cleared by splice

  // undo
  return () => {
    turn.counter = prevCounter;
    turn.currentPlayerId = prevPlayerId;
    turn.actingUnitId = prevActing;
    turn.actions = prevActions;
  };
}

export function registerUnitActionCommand(
  state: GameState,
  action: UnitAction
): Undo {
  const prevActing = state.turn.actingUnitId;

  // apply
  state.turn.actions.push(action);
  state.turn.actingUnitId = action.payload.unitId;

  // undo
  return () => {
    state.turn.actions.pop();
    state.turn.actingUnitId = prevActing;
  };
}
