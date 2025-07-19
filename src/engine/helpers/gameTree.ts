import type { GameState } from "@/types/game";
import { getAllValidUnitActions } from "./actions";
import { gameEngine } from "../core";
import type { TurnActions } from "@/types/action";

export interface GameTreeNode {
  state: GameState;
  actions: TurnActions; // actions to reach this state from root state
}

export const getChildNodes = (rootState: GameState): Set<GameTreeNode> => {
  const allUnitActions = getAllValidUnitActions(rootState);
  const nodes = new Set<GameTreeNode>();
  const nodeStates = new Set<GameState>();

  if (allUnitActions.length === 0) {
    nodes.add({
      state: rootState,
      actions: [],
    });

    return nodes;
  }

  allUnitActions.forEach((curAction) => {
    const subState = gameEngine(rootState, curAction);

    const subNodes = getChildNodes(subState);

    subNodes.forEach((subNode) => {
      if (!nodeStates.has(subNode.state)) {
        nodeStates.add(subNode.state);

        nodes.add({
          state: subNode.state,
          actions: [curAction, ...subNode.actions],
        });
      }
    });
  });

  return nodes;
};
