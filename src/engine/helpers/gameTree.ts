import type { GameState, Units } from "@/types/game";
import { getValidUnitActions } from "./actions";
import { gameEngine } from "../core";
import type { UnitId } from "@/types/id";

type GameTreeNode = GameState;

export function expandUnitBranchNodes(
  state: GameState,
  unitId: UnitId
): GameTreeNode[] {
  const res: GameTreeNode[] = [];
  const stateSet = new Set<Units>();
  const unit = state.units[unitId];

  const singleActions = getValidUnitActions(state, unit);

  singleActions.forEach((singleAction) => {
    const curState = gameEngine(state, singleAction);

    if (!stateSet.has(curState.units)) {
      const subStates = expandUnitBranchNodes(curState, unitId);
      res.push(...subStates);
      res.push(curState);
      stateSet.add(curState.units);
    }
  });

  return res;
}

export const getChildNodes = (rootState: GameState): GameTreeNode[] => {
  if (rootState.outcome.status === "finished") return [];
  const nodes: GameTreeNode[] = [];

  const units = rootState.units;
  const currentPlayerId = rootState.turn.currentPlayerId;

  Object.values(units).forEach((unit) => {
    if (unit.ownerId === currentPlayerId) {
      const unitBranchNodes = expandUnitBranchNodes(rootState, unit.id);
      nodes.push(...unitBranchNodes);
    }
  });

  return nodes;
};
