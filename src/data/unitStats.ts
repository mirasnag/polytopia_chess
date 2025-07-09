import type { UnitStats, UnitType } from "@/types/unit";

export const UNIT_STATS: Record<UnitType, UnitStats> = {
  warrior: { hp: 10, attack: 2, defense: 2, movement: 1, range: 1 },
  archer: { hp: 10, attack: 2, defense: 1, movement: 1, range: 2 },
  rider: { hp: 10, attack: 2, defense: 1, movement: 2, range: 1 },
  catapult: { hp: 10, attack: 4, defense: 0, movement: 1, range: 3 },
  knight: { hp: 10, attack: 3, defense: 1, movement: 3, range: 1 },
  swordsman: { hp: 15, attack: 3, defense: 3, movement: 1, range: 1 },
};
