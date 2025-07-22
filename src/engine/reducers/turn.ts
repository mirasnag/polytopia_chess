// types
import type { Players, Turn } from "@/types/game";
import type { PlayerId, UnitId } from "@/types/id";
import type { UnitActionKey } from "@/types/action";

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

export function registerUnitAction(
  turn: Turn,
  unitId: UnitId,
  actionKey: UnitActionKey
): Turn {
  if (turn.actions.length > 3) {
    throw new Error(`Too many actions: ${turn.actions}`);
  }
  return {
    ...turn,
    actions: [...turn.actions, actionKey],
    actingUnitId: unitId,
  };
}
