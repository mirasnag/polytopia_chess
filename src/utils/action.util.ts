// data
import { UNIT_ACTIONS } from "@/data/unitActions";

// types
import type { Turn, Unit } from "@/types/game";
import type {
  AttackActionKey,
  MoveActionKey,
  UnitActionKey,
} from "@/types/unit";

const moveActionKey: MoveActionKey = "move";
const attackActionKey: AttackActionKey = "attack";

export function canDoAction(
  unit: Unit,
  actionKey: UnitActionKey,
  turn: Turn
): boolean {
  const { actionsByUnit, actionPointsRemaining } = turn;
  const actionCost = UNIT_ACTIONS[actionKey].cost;

  if (actionPointsRemaining < actionCost) return false;

  if (!actionsByUnit[unit.id]) return true;

  if (actionsByUnit[unit.id].has(actionKey)) return false;

  return true;
}

export function canMove(unit: Unit, turn: Turn): boolean {
  const { actionPointsRemaining } = turn;
  const actionCost = UNIT_ACTIONS[moveActionKey].cost;

  if (actionPointsRemaining < actionCost) return false;

  return unit.canMove;
}

export function canAttack(unit: Unit, turn: Turn): boolean {
  const { actionPointsRemaining } = turn;
  const actionCost = UNIT_ACTIONS[attackActionKey].cost;

  if (actionPointsRemaining < actionCost) return false;

  return unit.canAttack;
}
