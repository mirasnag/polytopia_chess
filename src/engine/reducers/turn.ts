// types
import type { Players, Turn } from "@/types/game";
import type { UnitAction } from "@/types/action";

// utils

export function getInitialTurn(): Turn {
  return {
    counter: 1,
    currentPlayerId: 0,
    actingUnitId: null,
    actions: [],
  };
}

export function advanceTurn(turn: Turn, playerOrder: Players): Turn {
  const isNextTurn = turn.currentPlayerId + 1 === playerOrder.length;

  const nextOrderIndex = isNextTurn ? 0 : turn.currentPlayerId + 1;
  const nextCounter = isNextTurn ? turn.counter + 1 : turn.counter;

  return {
    ...turn,
    counter: nextCounter,
    currentPlayerId: nextOrderIndex,
    actingUnitId: null,
    actions: [],
  };
}

export function registerUnitAction(turn: Turn, action: UnitAction): Turn {
  return {
    ...turn,
    actions: [...turn.actions, action],
    actingUnitId: action.payload.unitId,
  };
}
