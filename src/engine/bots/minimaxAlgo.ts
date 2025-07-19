import type { TurnActions } from "@/types/action";
import type { GameState } from "@/types/game";
import { getChildNodes } from "../helpers/gameTree";
import { getPlayerScore } from "../helpers/evaluation";
import type { PlayerId } from "@/types/id";
import { getRandomArrayEntry } from "@/utils/common.util";

interface MinimaxReturn {
  score: number;
  actions: TurnActions[];
}

export const minimaxBotAlgo = (
  state: GameState,
  turnDepth: number = 1
): TurnActions => {
  const { currentPlayerId, playerOrder } = state.turn;
  const playerCnt = playerOrder.length;
  const { actions } = minimax(state, playerCnt * turnDepth, currentPlayerId);
  const randomBestAction = getRandomArrayEntry(actions);

  return randomBestAction;
};

export const minimax = (
  state: GameState,
  depth: number,
  mainPlayerId: PlayerId
): MinimaxReturn => {
  const { outcome, turn } = state;
  const isFinished = outcome.status === "finished";

  if (depth === 0 || isFinished) {
    return { score: getPlayerScore(state, mainPlayerId), actions: [] };
  }

  const isMainPlayer = turn.currentPlayerId === mainPlayerId;
  const childNodes = getChildNodes(state);

  if (isMainPlayer) {
    let score = -Infinity;
    let actions: TurnActions[] = [];

    childNodes.forEach((childNode) => {
      const { score: childScore } = minimax(
        childNode.state,
        depth - 1,
        mainPlayerId
      );
      if (score < childScore) {
        score = childScore;
        actions = [childNode.actions];
      } else if (score === childScore) {
        actions.push(childNode.actions);
      }
    });

    return {
      score,
      actions,
    };
  } else {
    let score = Infinity;
    let actions: TurnActions[] = [];

    childNodes.forEach((childNode) => {
      const { score: childScore } = minimax(
        childNode.state,
        depth - 1,
        mainPlayerId
      );
      if (score > childScore) {
        score = childScore;
        actions = [childNode.actions];
      } else if (score === childScore) {
        actions.push(childNode.actions);
      }
    });

    return {
      score,
      actions,
    };
  }
};

export const bestPlayerScore = (
  state: GameState,
  playerId: PlayerId
): number => {
  const nodes = getChildNodes(state);

  let bestScore = -Infinity;

  nodes.forEach((node) => {
    const curScore = getPlayerScore(node.state, playerId);
    bestScore = Math.max(bestScore, curScore);
  });

  return bestScore;
};

export const worstPlayerScore = (
  state: GameState,
  playerId: PlayerId
): number => {
  const nodes = getChildNodes(state);

  let worstScore = Infinity;

  nodes.forEach((node) => {
    const curScore = getPlayerScore(node.state, playerId);
    worstScore = Math.min(worstScore, curScore);
  });

  return worstScore;
};
