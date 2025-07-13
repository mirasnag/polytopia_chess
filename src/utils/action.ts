// data
import { UNIT_ACTIONS } from "@/data/unitActions";

// types
import type { Turn } from "@/types/game";
import type { UnitId } from "@/types/id";
import type { UnitActionKey } from "@/types/unit";

export function canDoAction(
  unitId: UnitId,
  actionKey: UnitActionKey,
  turn: Turn
): boolean {
  const { actionsByUnit, actionPointsRemaining } = turn;
  const actionCost = UNIT_ACTIONS[actionKey].cost;

  if (actionPointsRemaining < actionCost) return false;

  if (!actionsByUnit[unitId]) return true;

  if (actionsByUnit[unitId].has(actionKey)) return false;

  return true;
}
