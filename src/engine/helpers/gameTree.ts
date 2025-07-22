import type { GameState } from "@/types/game";
import { getAllTurnActions } from "./actions";
import { gameEngine } from "../core";
import type { GameAction, TurnActions } from "@/types/action";

export interface GameTreeNode {
  state: GameState;
  actions: TurnActions; // actions to reach this state from root state
}

const advanceAction: GameAction = { type: "advance", payload: {} };

export const getChildNodes = (rootState: GameState): Set<GameTreeNode> => {
  const allTurnActions = getAllTurnActions(rootState);
  const nodes = new Set<GameTreeNode>();

  if (allTurnActions.length === 0) {
    nodes.add({
      state: rootState,
      actions: [],
    });

    return nodes;
  }

  allTurnActions.forEach((curTurnActions) => {
    const curState = gameEngine(rootState, curTurnActions);
    nodes.add({
      state: gameEngine(curState, advanceAction),
      actions: curTurnActions,
    });
  });

  return nodes;
};
