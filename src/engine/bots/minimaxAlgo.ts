import type { GameAction, TurnActions } from "@/types/action";
import type { GameState } from "@/types/game";
import { getChildNodes } from "../helpers/gameTree";
import { getPlayerScore } from "../helpers/evaluation";
import type { PlayerId } from "@/types/id";
import { getRandomArrayEntry } from "@/utils/common.util";
import { gameEngine } from "../core";

interface MinimaxReturn {
  score: number;
  actions: TurnActions[];
}

const advanceAction: GameAction = { type: "advance", payload: {} };

let start = performance.now();
const maxSearchTime = 3000; // milli seconds

export const minimaxBotAlgo = (
  state: GameState,
  turnDepth: number = 1
): TurnActions => {
  const { currentPlayerId, playerOrder } = state.turn;
  const playerCnt = playerOrder.length;
  const depth = playerCnt * turnDepth;
  const { actions } = minimax(state, depth, currentPlayerId);
  const randomBestAction = getRandomArrayEntry(actions);

  return randomBestAction;
};

export const minimax = (
  state: GameState,
  depth: number,
  mainPlayerId: PlayerId,
  alpha = -Infinity,
  beta = Infinity
): MinimaxReturn => {
  if (performance.now() - start > maxSearchTime) {
    return { score: getPlayerScore(state, mainPlayerId), actions: [] };
  }

  const { outcome, turn } = state;
  const isFinished = outcome.status === "finished";

  if (depth === 0 || isFinished) {
    return { score: getPlayerScore(state, mainPlayerId), actions: [] };
  }

  const isMainPlayer = turn.currentPlayerId === mainPlayerId;
  const childStates = getChildNodes(state);

  if (isMainPlayer) {
    let bestScore = -Infinity;
    let bestActions: TurnActions[] = [];

    for (const childState of childStates) {
      const { score: childScore } = minimax(
        gameEngine(childState, advanceAction),
        depth - 1,
        mainPlayerId,
        alpha,
        beta
      );

      if (childScore > bestScore) {
        bestScore = childScore;
        bestActions = [childState.turn.actions];
      } else if (childScore === bestScore) {
        bestActions.push(childState.turn.actions);
      }

      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }

    return {
      score: bestScore,
      actions: bestActions,
    };
  } else {
    let worstScore = Infinity;
    let worstActions: TurnActions[] = [];

    for (const childState of childStates) {
      const { score: childScore } = minimax(
        gameEngine(childState, advanceAction),
        depth - 1,
        mainPlayerId,
        alpha,
        beta
      );

      if (childScore < worstScore) {
        worstScore = childScore;
        worstActions = [childState.turn.actions];
      } else if (childScore === worstScore) {
        worstActions.push(childState.turn.actions);
      }

      beta = Math.min(beta, worstScore);
      if (beta <= alpha) break;
    }

    return {
      score: worstScore,
      actions: worstActions,
    };
  }
};
