// types
import type { Turn, Unit } from "@/types/game";

export function canMove(unit: Unit, turn: Turn): boolean {
  const { actionPointsRemaining, actionsByUnit } = turn;

  const unitHasActed = actionsByUnit[unit.id] !== undefined;
  const actionCost = 1;

  if (actionPointsRemaining < actionCost && !unitHasActed) return false;

  return unit.canMove;
}

export function canAttack(unit: Unit, turn: Turn): boolean {
  const { actionPointsRemaining, actionsByUnit } = turn;

  const unitHasActed = actionsByUnit[unit.id] !== undefined;
  const actionCost = 1;

  if (actionPointsRemaining < actionCost && !unitHasActed) return false;

  return unit.canAttack;
}
