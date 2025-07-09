// utils
import { getUnitAttack, getUnitDefense } from "@/data/unitStats";

// types
import type { Unit } from "@/types/game";

export const schemaVersion = {
  major: 1,
  minor: 0,
};

const baseDamage = 5;

export function calculateDamage(
  attackingUnit: Unit,
  defendingUnit: Unit
): number {
  const attack = getUnitAttack(attackingUnit.type);
  const defense = getUnitDefense(defendingUnit.type);

  return Math.max(0, baseDamage + attack - defense);
}
