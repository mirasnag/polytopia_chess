import type { GameState } from "@/types/game";
import { getAllTurnActions } from "./actions";
import { gameEngine } from "../core";

type GameTreeNode = GameState;

export const getChildNodes = (rootState: GameState): Set<GameTreeNode> => {
  const allTurnActions = getAllTurnActions(rootState);
  const nodes = new Set<GameTreeNode>();

  if (allTurnActions.length === 0) {
    nodes.add(rootState);
    return nodes;
  }

  allTurnActions.forEach((curTurnActions) => {
    const curState = gameEngine(rootState, curTurnActions);
    nodes.add(curState);
  });

  return nodes;
};
