// data
import { getUnitBaseStats } from "@/data/unitBaseStats";

// types
import type { GameState, Turn, Unit } from "@/types/game";
import type { Tile } from "@/types/tile";

export function canMove(unit: Unit, turn: Turn): boolean {
  const { actionPointsRemaining, actionsByUnit } = turn;

  const unitHasActed = actionsByUnit[unit.id] !== undefined;
  const actionCost = 1;

  if (actionPointsRemaining < actionCost && !unitHasActed) return false;

  return unit.canMove;
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
