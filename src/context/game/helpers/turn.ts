import type { Players, Turn } from "@/types/game";
import type { PlayerId } from "@/types/id";

export function getInitialTurn(players: Players): Turn {
  const order = Object.keys(players) as PlayerId[];

  return {
    counter: 0,
    playerOrder: order,
    orderIndex: 0,
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
  };
}
