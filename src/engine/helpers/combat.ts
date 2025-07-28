// data
import { getUnitBaseStats, getUnitTraits } from "@/data/unitBaseStats";

// types
import type { GameState, Turn } from "@/types/game";
import type { Tile } from "@/types/tile";
import type { Unit } from "@/types/unit";

const baseDamage = 5;

export function calculateDamage(
  attackingUnit: Unit,
  defendingUnit: Unit
): number {
  const attack = getUnitBaseStats(attackingUnit.type).attack;
  const defense = getUnitBaseStats(defendingUnit.type).defense;

  return Math.max(0, baseDamage + attack - defense);
}

export function canAttack(unit: Unit, turn: Turn): boolean {
  const { actions, actingUnitId } = turn;

  if (actingUnitId && actingUnitId !== unit.id) return false;

  const unitTraits = getUnitTraits(unit.type);

  // by default, unit cannot attack if it acted
  const hasActed = actingUnitId !== null;

  const actionKeys = actions.map((action) => action.type);

  // unit can attack using dash if it did not attacked
  const canDash =
    unitTraits.includes("dash") &&
    !actionKeys.includes("attack") &&
    !actionKeys.includes("kill");

  // unit can attack using persistant if unit killed in last turn
  const canPersist =
    unitTraits.includes("persist") &&
    actionKeys[actionKeys.length - 1] === "kill";

  return !hasActed || canDash || canPersist;
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
      const tile = tiles.getIn([ny, nx]) as Tile;
      const anotherUnitId = tile.occupantId;
      if (!anotherUnitId) continue;

      if (units.get(anotherUnitId)?.ownerId !== unit.ownerId) {
        validAttacks.add(tile);
      }
    }
  }

  return validAttacks;
}

export function getValidAttacksMask(
  state: GameState,
  unit: Unit | null
): boolean[][] {
  const { width, height } = state.map;
  const mask = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  if (!unit) return mask;

  const validAttacks = getValidAttacks(state, unit);

  validAttacks.forEach((attack) => {
    mask[attack.y][attack.x] = true;
  });

  return mask;
}
