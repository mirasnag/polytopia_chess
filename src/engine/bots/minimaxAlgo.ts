// helpers
import { gameEngine } from "../core";
import { ChildGenerator } from "../helpers/gameTree";
import { getPlayerScore } from "../helpers/evaluation";

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
  const currentPlayerId = state.turn.currentPlayerId;
  const playerOrder = state.players;

  const playerCnt = playerOrder.length;
  const depth = playerCnt * turnDepth;

  start = performance.now();
  const { actions } = minimaxIterativeDeepening(state, depth, currentPlayerId);

  return actions;
};

// minimax with iterative deepening
export const minimaxIterativeDeepening = (
  state: GameState,
  depth: number,
  mainPlayerId: PlayerId
): MinimaxReturn => {
  let alpha = -Infinity;
  let beta = Infinity;
  const delta = 10;
  let bestActions: MinimaxReturn["actions"] = [];
  let bestScore: MinimaxReturn["score"] = 0;

  for (let curDepth = 1; curDepth <= depth; curDepth++) {
    let { score, actions } = minimax(
      state,
      curDepth,
      mainPlayerId,
      alpha,
      beta
    );
    if (score <= alpha || score >= beta) {
      ({ score, actions } = minimax(state, curDepth, mainPlayerId));
    }

    alpha = score - delta;
    beta = score + delta;

    bestActions = actions;
    bestScore = score;
  }

  return { score: bestScore, actions: bestActions };
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
