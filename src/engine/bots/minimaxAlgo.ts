// library imports
import { LRUCache } from "lru-cache";

// helpers
import { gameEngine } from "../core";
import { ChildGenerator } from "../helpers/gameTree";
import { getPlayerScore, isMateScore } from "../helpers/evaluation";

// types
import type { GameState, ZobristKey } from "@/types/game";
import type { GameAction, TurnActions, UnitAction } from "@/types/action";

type NodeType = "EXACT" | "LOWERBOUND" | "UPPERBOUND";
interface GameStateCacheValue {
  score: number;
  depth: number;
  nodeType: NodeType;
  actions: TurnActions;
  state: GameState;
}

// tranposition table for game states
const tt = new LRUCache<ZobristKey, GameStateCacheValue>({
  max: 10000,
});

interface MinimaxReturn {
  score: number;
  actions: TurnActions;
}

const advanceAction: GameAction = { type: "advance", payload: {} };

let start = performance.now();
const maxSearchTime = 15000; // milliseconds

export const minimaxBotAlgo = (
  state: GameState,
  turnDepth: number = 1
): TurnActions => {
  const playerCnt = state.players.length;
  const depth = playerCnt * turnDepth;

  start = performance.now();
  const { actions } = minimaxIterativeDeepening(state, depth);

  // const searchTime = Math.round(performance.now() - start) / 1000;
  // console.log("Search Time:", searchTime, "seconds");
  // logActions(state, actions as UnitAction[]);

  return actions;
};

// minimax with iterative deepening
export const minimaxIterativeDeepening = (
  state: GameState,
  depth: number
): MinimaxReturn => {
  if (depth <= 1) return minimax(state, depth, -Infinity, Infinity);

  let bestResult: MinimaxReturn = minimax(state, 1, -Infinity, Infinity);

  let prevScore = bestResult.score;

  let alpha = -Infinity;
  let beta = Infinity;
  const deltas = [10, 20, 40];

  for (let curDepth = 2; curDepth <= depth; curDepth++) {
    if (isMateScore(bestResult.score)) break;

    let res: MinimaxReturn | null = null;
    let failed = true;

    for (const delta of deltas) {
      alpha = prevScore - delta;
      beta = prevScore + delta;

      res = minimax(state, curDepth, alpha, beta);

      if (alpha < res.score && res.score < beta) {
        failed = false;
        break;
      }
    }

    if (res === null || failed) {
      res = minimax(state, curDepth, -Infinity, Infinity);
    }

    bestResult = res;
    prevScore = res.score;

    // logIter(curDepth, bestResult.score, alpha, beta, 0, failed);
  }

  return bestResult;
};

export const minimax = (
  state: GameState,
  depth: number,
  alpha: number,
  beta: number
): MinimaxReturn => {
  const alphaOriginal = alpha;
  const mainPlayerId = state.turn.currentPlayerId;

  const entry = tt.get(state.zKey);
  if (entry && entry.depth >= depth) {
    if (entry.nodeType === "EXACT")
      return { score: entry.score, actions: entry.actions };
    else if (entry.nodeType === "LOWERBOUND") {
      alpha = Math.max(alpha, entry.score);
    } else if (entry.nodeType === "UPPERBOUND") {
      beta = Math.min(beta, entry.score);
    }

    if (alpha >= beta) {
      return { score: entry.score, actions: entry.actions ?? [] };
    }
  }

  if (performance.now() - start > maxSearchTime) {
    return { score: getPlayerScore(state, mainPlayerId), actions: [] };
  }

  if (depth === 0 || state.outcome.status === "finished") {
    const score = getPlayerScore(state, mainPlayerId);

    tt.set(state.zKey, {
      score: score,
      depth: depth == 0 ? 0 : Number.MAX_SAFE_INTEGER,
      actions: [],
      nodeType: "EXACT",
      state: state,
    });

    return { score, actions: [] };
  }

  const gen = new ChildGenerator(state);

  let childState: GameState | null = entry
    ? gameEngine(state, entry.actions)
    : gen.next();

  let res: MinimaxReturn;

  let bestScore = -Infinity;
  let bestActions: MinimaxReturn["actions"] = [];

  while (childState) {
    const res = minimax(
      gameEngine(childState, advanceAction),
      depth - 1,
      -beta,
      -alpha
    );
    const childScore = -res.score;

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

  const nodeType: NodeType =
    bestScore <= alphaOriginal
      ? "UPPERBOUND"
      : bestScore >= beta
      ? "LOWERBOUND"
      : "EXACT";

  if (
    !entry ||
    entry.depth < depth ||
    (entry.depth == depth && nodeType === "EXACT")
  ) {
    tt.set(state.zKey, {
      score: res.score,
      depth: depth,
      actions: res.actions,
      nodeType: nodeType,
      state: state,
    });
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
        if (value === -Infinity) return "-Infinity";
        return value;
      }
    )
  );
}

export function logActions(state: GameState, actions: UnitAction[]) {
  console.log("Logging Actions:");
  if (actions.length === 0) return;
  const unit = state.units.get(actions[0].payload.unitId)!;
  console.log(
    `${unit.type}, Initial position = ${[unit.position.y, unit.position.x]}`
  );
  for (const action of actions) {
    console.log(
      `${action.type}, to = ${[action.payload.to.y, action.payload.to.x]}`
    );
  }
}
