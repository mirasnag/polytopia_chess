// helpers
import { getValidUnitActions } from "./actions";
import { gameEngine } from "../core";

// types
import type { GameState, ZobristKey } from "@/types/game";
import type { UnitId } from "@/types/id";
import type { Unit } from "@/types/unit";
import { shuffleArray } from "@/utils/common.util";

type GameTreeNode = GameState;

export class ChildGenerator {
  private root: GameState;
  private unitOrder: Unit[] = [];
  private unitIndex: number = 0;
  private currentBranch: GameTreeNode[] = [];
  private branchIndex: number = 0;

  constructor(state: GameState) {
    this.root = state;

    this.root.units.forEach((unit) => {
      if (unit.ownerId === this.root.turn.currentPlayerId) {
        this.unitOrder.push(unit);
      }
    });
    this.unitOrder = shuffleArray(this.unitOrder);

    this.currentBranch = this.expandUnitBranchNodes();
  }

  get currentUnit(): Unit {
    return this.unitOrder[this.unitIndex];
  }

  private expandUnitBranchNodes() {
    return this._expandUnitBranchNodes(this.root, this.currentUnit.id);
  }

  private _expandUnitBranchNodes(
    state: GameState,
    unitId: UnitId
  ): GameTreeNode[] {
    const res: GameTreeNode[] = [];
    const stateSet = new Set<ZobristKey>();
    const unit = state.units.get(unitId);

    if (!unit) {
      throw new Error("Unit not found!");
    }

    const singleActions = getValidUnitActions(state, unit);

    singleActions.forEach((singleAction) => {
      const curState = gameEngine(state, singleAction);

      if (!stateSet.has(curState.zKey)) {
        const subStates = this._expandUnitBranchNodes(curState, unitId);
        res.push(...subStates);
        res.push(curState);
        stateSet.add(curState.zKey);
      }
    });

    return res;
  }

  public next(): GameState | null {
    while (this.currentBranch.length === this.branchIndex) {
      this.unitIndex++;
      if (this.unitIndex === this.unitOrder.length) return null;

      this.currentBranch = this.expandUnitBranchNodes();
      this.currentBranch.sort(stateComp);
      this.branchIndex = 0;
    }

    return this.currentBranch[this.branchIndex++];
  }
}

function stateComp(a: GameState, b: GameState): number {
  if (a.outcome.status === "finished") return -1;
  if (b.outcome.status === "finished") return 1;

  let score = 0;
  a.turn.actions.forEach((action) => {
    if (action.type === "kill") score -= 5;
    if (action.type === "attack") score -= 1;
  });

  b.turn.actions.forEach((action) => {
    if (action.type === "kill") score += 5;
    if (action.type === "attack") score += 1;
  });

  return score;
}
