import type { TurnActions } from "@/types/action";
import type { GameState } from "@/types/game";
import { getChildNodes } from "../helpers/gameTree";
import { getPlayerScore } from "../helpers/evaluation";
import type { PlayerId } from "@/types/id";
import { getRandomArrayEntry } from "@/utils/common.util";

export const minimaxBotAlgo = (state: GameState): TurnActions => {
  const { currentPlayerId } = state.turn;
  const bestActionCandidates = minimax(state, currentPlayerId);
  const randomBestAction = getRandomArrayEntry(bestActionCandidates);

  return randomBestAction;
};

export const minimax = (
  state: GameState,
  playerId: PlayerId
): TurnActions[] => {
  const nodes = getChildNodes(state);

  let bestScore = -Infinity;
  let bestTurnActionCandidates: TurnActions[] = [];

  nodes.forEach((node) => {
    const curScore = worstPlayerScore(node.state, playerId);
    if (bestScore < curScore) {
      bestScore = curScore;
      bestTurnActionCandidates = [node.actions];
    } else if (bestScore === curScore) {
      bestTurnActionCandidates.push(node.actions);
    }
  });

  return bestTurnActionCandidates;
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
