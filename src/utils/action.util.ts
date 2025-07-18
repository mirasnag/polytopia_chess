// data
import { getUnitBaseStats } from "@/data/unitBaseStats";

// types
import type { GameState, Turn, Unit } from "@/types/game";
import type { Tile } from "@/types/tile";
import type {
  AttackActionKey,
  MoveActionKey,
  UnitAction,
} from "@/types/action";

const attackActionKey: AttackActionKey = "attack";
const moveActionKey: MoveActionKey = "move";

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

export function getValidAttacks(state: GameState, unit: Unit): Set<Tile> {
  const validAttacks = new Set<Tile>();

  if (state.outcome.status === "finished") return validAttacks;

  if (!canAttack(unit, state.turn)) return validAttacks;

  const { range } = getUnitBaseStats(unit.type);
  const { x, y } = unit.position;
  const { width, height, tiles } = state.map;
  const units = state.units;

  const minX = Math.max(0, x - range);
  const maxX = Math.min(width - 1, x + range);
  const minY = Math.max(0, y - range);
  const maxY = Math.min(height - 1, y + range);

  for (let nx = minX; nx <= maxX; nx++) {
    for (let ny = minY; ny <= maxY; ny++) {
      const anotherUnitId = tiles[ny][nx].occupantId;
      if (!anotherUnitId) continue;

      if (units[anotherUnitId].ownerId !== unit.ownerId) {
        validAttacks.add(tiles[ny][nx]);
      }
    }
  }

  return validAttacks;
}

export function getValidMoves(state: GameState, unit: Unit): Set<Tile> {
  const validMoves = new Set<Tile>();

  if (state.outcome.status === "finished") return validMoves;

  if (!canMove(unit, state.turn)) return validMoves;

  const { movement } = getUnitBaseStats(unit.type);
  const { x, y } = unit.position;
  const { width, height, tiles } = state.map;

  const minX = Math.max(0, x - movement);
  const maxX = Math.min(width - 1, x + movement);
  const minY = Math.max(0, y - movement);
  const maxY = Math.min(height - 1, y + movement);

  for (let nx = minX; nx <= maxX; nx++) {
    for (let ny = minY; ny <= maxY; ny++) {
      if (!tiles[ny][nx].occupantId) {
        validMoves.add(tiles[ny][nx]);
      }
    }
  }

  return validMoves;
}

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
  const validActions: UnitAction[] = [];
  const { turn, units } = state;
  const currentPlayerId = turn.playerOrder[turn.orderIndex];

  if (turn.actionPointsRemaining === 0) return validActions;
  if (state.outcome.status === "finished") return validActions;

  Object.values(units).forEach((unit) => {
    if (unit.ownerId === currentPlayerId) {
      const validUnitActions = getValidUnitActions(state, unit);

      validActions.push(...validUnitActions);
    }
  });

  return validActions;
}
