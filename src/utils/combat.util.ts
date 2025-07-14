// data
import { getUnitBaseStats } from "@/data/unitBaseStats";

// types
import type { GameState, Unit } from "@/types/game";
import type { Tile } from "@/types/tile";

// utils
import { canDoAction } from "./action.util";

const baseDamage = 5;

export function calculateDamage(
  attackingUnit: Unit,
  defendingUnit: Unit
): number {
  const attack = getUnitBaseStats(attackingUnit.type).attack;
  const defense = getUnitBaseStats(defendingUnit.type).defense;

  return Math.max(0, baseDamage + attack - defense);
}

export function getValidAttacks(state: GameState, unit: Unit): Set<Tile> {
  const validAttacks = new Set<Tile>();

  if (state.outcome.status === "finished") return validAttacks;

  if (!canDoAction(unit.id, "attack", state.turn)) return validAttacks;

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
