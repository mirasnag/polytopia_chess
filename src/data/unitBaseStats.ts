// types
import type { UnitStats, UnitType } from "@/types/unit";

// shoud not be exported or modified
export const UNIT_BASE_STATS: Record<UnitType, UnitStats> = {
  warrior: {
    hp: 10,
    attack: 2,
    defense: 2,
    movement: 1,
    range: 1,
    traits: ["dash"],
  },
  archer: {
    hp: 10,
    attack: 2,
    defense: 1,
    movement: 1,
    range: 2,
    traits: ["dash"],
  },
  rider: {
    hp: 10,
    attack: 2,
    defense: 1,
    movement: 2,
    range: 1,
    traits: ["dash", "escape"],
  },
  catapult: {
    hp: 10,
    attack: 4,
    defense: 0,
    movement: 1,
    range: 3,
    traits: ["stiff"],
  },
  knight: {
    hp: 10,
    attack: 3,
    defense: 1,
    movement: 3,
    range: 1,
    traits: ["dash", "persist"],
  },
  mindBender: {
    hp: 10,
    attack: 0,
    defense: 0,
    movement: 1,
    range: 1,
    traits: ["stiff"],
  },
};

export const getAllUnitBaseStats = () => UNIT_BASE_STATS;

export const getUnitBaseStats = (unitType: UnitType) =>
  UNIT_BASE_STATS[unitType];

export const getUnitTraits = (unitType: UnitType) =>
  UNIT_BASE_STATS[unitType].traits ?? [];
