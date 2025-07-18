// types
import type { GameState, Unit } from "@/types/game";
import type {
  AttackActionKey,
  MoveActionKey,
  UnitAction,
} from "@/types/action";

// helpers
import { getValidAttacks } from "./combat";
import { getValidMoves } from "./movement";

const attackActionKey: AttackActionKey = "attack";
const moveActionKey: MoveActionKey = "move";

export function getValidUnitActions(
  state: GameState,
  unit: Unit
): UnitAction[] {
  const validActions: UnitAction[] = [];

  const validUnitAttacks = getValidAttacks(state, unit);
  validUnitAttacks.forEach((attackingTile) => {
    validActions.push({
      type: attackActionKey,
      payload: {
        attackingUnitId: unit.id,
        defendingUnitId: attackingTile.occupantId,
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

  const validActions: UnitAction[] = [];
  const { turn, units } = state;
  const currentPlayerId = turn.playerOrder[turn.orderIndex];

  Object.values(units).forEach((unit) => {
    if (unit.ownerId === currentPlayerId) {
      const validUnitActions = getValidUnitActions(state, unit);

      validActions.push(...validUnitActions);
    }
  });

  return validActions;
}
