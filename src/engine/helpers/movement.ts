// data
import { getUnitBaseStats, getUnitTraits } from "@/data/unitBaseStats";

// types
import type { GameState, Turn, Unit } from "@/types/game";
import type { Tile } from "@/types/tile";

export function canMove(unit: Unit, turn: Turn): boolean {
  const { actions, actingUnitId } = turn;

  if (actingUnitId && actingUnitId !== unit.id) return false;

  // by default, unit cannot move after if it acted
  const hasActed = actions.length > 0;

  const actionKeys = actions.map((action) => action.type);

  // unit can escape if the last action is not move (attack or kill)
  const canEscape =
    actionKeys[actionKeys.length - 1] !== "move" &&
    getUnitTraits(unit.type).includes("escape");

  return !hasActed || canEscape;
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
