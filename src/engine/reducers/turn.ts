// types
import type { Players, Turn } from "@/types/game";
import type { PlayerId } from "@/types/id";
import type { UnitAction } from "@/types/action";

// utils
import { shuffleArray } from "@/utils/common.util";

export function getInitialTurn(players: Players): Turn {
  const order = Object.keys(players) as PlayerId[];
  const shuffledOrder = shuffleArray(order);

  return {
    counter: 1,
    playerOrder: shuffledOrder,
    orderIndex: 0,
    currentPlayerId: shuffledOrder[0],
    actingUnitId: null,
    actions: [],
  };
}

export function advanceTurn(turn: Turn): Turn {
  const isNextTurn = turn.orderIndex + 1 === turn.playerOrder.length;

  const nextOrderIndex = isNextTurn ? 0 : turn.orderIndex + 1;
  const nextCounter = isNextTurn ? turn.counter + 1 : turn.counter;

  return {
    ...turn,
    counter: nextCounter,
    orderIndex: nextOrderIndex,
    currentPlayerId: turn.playerOrder[nextOrderIndex],
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
