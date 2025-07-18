// data
import { getUnitBaseStats } from "@/data/unitBaseStats";

// types
import type { Unit } from "@/types/game";

const baseDamage = 5;

export function calculateDamage(
  attackingUnit: Unit,
  defendingUnit: Unit
): number {
  const attack = getUnitBaseStats(attackingUnit.type).attack;
  const defense = getUnitBaseStats(defendingUnit.type).defense;

  return Math.max(0, baseDamage + attack - defense);
}
