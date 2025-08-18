// helpers
import { gameEngine } from "../core";
import { ChildGenerator } from "../helpers/gameTree";
import { getPlayerScore, isMateScore } from "../helpers/evaluation";

// types
import type { GameState } from "@/types/game";
import type { GameAction, TurnActions } from "@/types/action";
import type { PlayerId } from "@/types/id";

interface MinimaxReturn {
  score: number;
  actions: TurnActions;
}

const advanceAction: GameAction = { type: "advance", payload: {} };

let start = performance.now();
const maxSearchTime = 5000; // milliseconds

export const minimaxBotAlgo = (
  state: GameState,
  turnDepth: number = 1
): TurnActions => {
  const playerOrder = state.players;

  const playerCnt = playerOrder.length;
  const depth = playerCnt * turnDepth;

  start = performance.now();
  const { actions } = minimaxIterativeDeepening(state, depth);

  return actions;
};

// minimax with iterative deepening
export const minimaxIterativeDeepening = (
  state: GameState,
  depth: number,
  mainPlayerId: PlayerId = state.turn.currentPlayerId
): MinimaxReturn => {
  if (depth <= 1) return minimax(state, depth, mainPlayerId);

  let bestResult: MinimaxReturn = minimax(state, 1, mainPlayerId);
  let prevScore = bestResult.score;

  let alpha = -Infinity;
  let beta = Infinity;
  const deltas = [10, 20, 40];

  for (let curDepth = 2; curDepth <= depth; curDepth++) {
    let res: MinimaxReturn | null = null;
    let failed = true;

    for (const delta of deltas) {
      alpha = prevScore - delta;
      beta = prevScore + delta;

      res = minimax(state, curDepth, mainPlayerId, alpha, beta);
      prevScore = res.score;

      if (alpha < res.score && res.score < beta) {
        failed = false;
        break;
      }
    }

    if (res === null || failed) {
      res = minimax(state, curDepth, mainPlayerId);
      break;
    }

    bestResult = res;

    // logIter(curDepth, bestResult.score, alpha, beta, 0, failed);

    if (isMateScore(bestResult.score)) break;
  }

  return bestResult;
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

  if (depth === 0 || outcome.status === "finished") {
    return { score: getPlayerScore(state, mainPlayerId), actions: [] };
  }

  const isMainPlayer = turn.currentPlayerId === mainPlayerId;
  const gen = new ChildGenerator(state);
  let childState: GameState | null = gen.next();
  let res: MinimaxReturn;

  if (isMainPlayer) {
    let bestScore = -Infinity;
    let bestActions: MinimaxReturn["actions"] = [];

    while (childState) {
      const { score: childScore } = minimax(
        gameEngine(childState, advanceAction),
        depth - 1,
        mainPlayerId,
        alpha,
        beta
      );

      if (childScore > bestScore) {
        bestScore = childScore;
        bestActions = childState.turn.actions;
      }

      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;

      childState = gen.next();
    }

    res = {
      score: bestScore,
      actions: bestActions,
    };
  } else {
    let worstScore = Infinity;
    let worstActions: MinimaxReturn["actions"] = [];

    while (childState) {
      const { score: childScore } = minimax(
        gameEngine(childState, advanceAction),
        depth - 1,
        mainPlayerId,
        alpha,
        beta
      );

      if (childScore < worstScore) {
        worstScore = childScore;
        worstActions = childState.turn.actions;
      }

      beta = Math.min(beta, worstScore);
      if (beta <= alpha) break;

      childState = gen.next();
    }

    res = {
      score: worstScore,
      actions: worstActions,
    };
  }

  return res;
};

export function logIter(
  depth: number,
  score: number,
  alpha: number,
  beta: number,
  tried?: number,
  failed?: boolean
) {
  console.log(
    JSON.stringify(
      { depth, score, alpha, beta, tries: tried, failed },
      (_, value) => {
        if (value === Infinity) return "Infinity";
        if (value === -Infinity) return "Infinity";
        return value;
      }
    )
  );
}
