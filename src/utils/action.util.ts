// types
import type { Turn, Unit } from "@/types/game";

export function canMove(unit: Unit, turn: Turn): boolean {
  const { actionPointsRemaining } = turn;
  const actionCost = 1;

  if (actionPointsRemaining < actionCost) return false;

  return unit.canMove;
}

export function canAttack(unit: Unit, turn: Turn): boolean {
  const { actionPointsRemaining } = turn;
  const actionCost = 1;

  if (actionPointsRemaining < actionCost) return false;

  return unit.canAttack;
}
