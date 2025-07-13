import type { Players, Turn } from "@/types/game";
import type { PlayerId } from "@/types/id";
import { shuffleArray } from "@/utils/common";

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
