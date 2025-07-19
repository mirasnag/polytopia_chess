import type { GameState } from "@/types/game";
import { getAllValidUnitActions } from "./actions";
import { gameEngine } from "../core";
import type { GameAction, TurnActions } from "@/types/action";

export interface GameTreeNode {
  state: GameState;
  actions: TurnActions; // actions to reach this state from root state
}

const getChildNodesBeforeAdvance = (
  rootState: GameState
): Set<GameTreeNode> => {
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

const advanceAction: GameAction = { type: "advance", payload: {} };

export const getChildNodes = (rootState: GameState): GameTreeNode[] => {
  const nodesBeforeAdvance = getChildNodesBeforeAdvance(rootState);

  const nodes: GameTreeNode[] = [];
  nodesBeforeAdvance.forEach((node) => {
    nodes.push({
      state: gameEngine(node.state, advanceAction),
      actions: node.actions,
    });
  });

  return nodes;
};
