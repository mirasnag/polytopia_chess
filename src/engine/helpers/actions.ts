// types
import type { GameState, Unit } from "@/types/game";
import type {
  AttackActionKey,
  MoveActionKey,
  TurnActions,
  UnitAction,
} from "@/types/action";

// helpers
import { getValidAttacks } from "./combat";
import { getValidMoves } from "./movement";
import { gameEngine } from "../core";
import type { UnitId } from "@/types/id";

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
  const { currentPlayerId, actingUnitId } = turn;

  if (actingUnitId) {
    return getValidUnitActions(state, units[actingUnitId]);
  }

  Object.values(units).forEach((unit) => {
    if (unit.ownerId === currentPlayerId) {
      const validUnitActions = getValidUnitActions(state, unit);

      validActions.push(...validUnitActions);
    }
  });

  return validActions;
}

export function getUnitTurnActions(
  state: GameState,
  unitId: UnitId
): TurnActions[] {
  const validActions: TurnActions[] = [];
  const stateSet = new Set<GameState>();
  const unit = state.units[unitId];

  const singleActions = getValidUnitActions(state, unit);

  singleActions.forEach((singleAction) => {
    const subState = gameEngine(state, singleAction);

    if (!stateSet.has(subState)) {
      const subTurnActions = getUnitTurnActions(subState, unitId);

      subTurnActions.forEach((subTurnAction) => {
        validActions.push([singleAction, ...subTurnAction]);
      });
      validActions.push([singleAction]);

      stateSet.add(subState);
    }
  });

  return validActions;
}

export function getAllTurnActions(state: GameState): TurnActions[] {
  if (state.outcome.status === "finished") return [];

  const validActions: TurnActions[] = [];
  const units = state.units;
  const currentPlayerId = state.turn.currentPlayerId;

  Object.values(units).forEach((unit) => {
    if (unit.ownerId === currentPlayerId) {
      const validUnitActions = getUnitTurnActions(state, unit.id);

      validActions.push(...validUnitActions);
    }
  });

  return validActions;
}
