// data
import { UNIT_ACTIONS } from "@/data/unitActions";

// types
import type { Players, Turn } from "@/types/game";
import type { PlayerId, UnitId } from "@/types/id";
import type { UnitActionKey } from "@/types/unit";

// utils
import { shuffleArray } from "@/utils/common.util";

const basePoints = 3;

export function getInitialTurn(players: Players): Turn {
  const order = Object.keys(players) as PlayerId[];
  const shuffledOrder = shuffleArray(order);

  return {
    counter: 1,
    playerOrder: shuffledOrder,
    orderIndex: 0,
    actionPointsTotal: basePoints,
    actionPointsRemaining: basePoints,
    actionsByUnit: {},
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
    actionPointsTotal: basePoints,
    actionPointsRemaining: basePoints,
    actionsByUnit: {},
  };
}

export function registerUnitAction(
  turn: Turn,
  unitId: UnitId,
  key: UnitActionKey
): Turn {
  const cost = UNIT_ACTIONS[key].cost;

  const unitActions = new Set(turn.actionsByUnit[unitId] ?? []).add(key);

  return {
    ...turn,
    actionPointsRemaining: turn.actionPointsRemaining - cost,
    actionsByUnit: {
      ...turn.actionsByUnit,
      [unitId]: unitActions,
    },
  };
}
