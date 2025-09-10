// types
import type { GameState } from "@/types/game";
import type {
  AttackActionKey,
  MoveActionKey,
  UnitAction,
} from "@/types/action";

// helpers
import { getValidAttacks } from "./combat";
import { getValidMoves } from "./movement";
import type { UnitId } from "@/types/id";

const attackActionKey: AttackActionKey = "attack";
const moveActionKey: MoveActionKey = "move";

export function getValidUnitActions(
  state: GameState,
  unitId: UnitId
): UnitAction[] {
  const unit = state.units.get(unitId);

  if (!unit) return [];

  const validActions: UnitAction[] = [];
  const validUnitAttacks = getValidAttacks(state, unit);
  validUnitAttacks.forEach((attackingTile) => {
    validActions.push({
      type: attackActionKey,
      payload: {
        unitId: unit.id,
        to: { x: attackingTile.x, y: attackingTile.y },
      },
    });
  });

  const validUnitMoves = getValidMoves(state, unit);
  validUnitMoves.forEach((movingTile) => {
    validActions.push({
      type: moveActionKey,
      payload: {
        unitId: unit.id,
        to: { x: movingTile.x, y: movingTile.y },
      },
    });
  });

  return validActions;
}

export function getAllValidUnitActions(state: GameState): UnitAction[] {
  if (state.outcome.status === "finished") return [];

  const { turn, units } = state;
  const { currentPlayerId, actingUnitId } = turn;

  if (actingUnitId) {
    const actingUnit = units.get(actingUnitId);

    return actingUnit ? getValidUnitActions(state, actingUnit.id) : [];
  }

  const validActions: UnitAction[] = [];
  units.forEach((unit) => {
    if (unit.ownerId === currentPlayerId) {
      const validUnitActions = getValidUnitActions(state, unit.id);

      validActions.push(...validUnitActions);
    }
  });

  return validActions;
}
