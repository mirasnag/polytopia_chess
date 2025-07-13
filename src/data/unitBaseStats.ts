// types
import type { UnitStats, UnitType } from "@/types/unit";

// shoud not be exported or modified
const UNIT_BASE_STATS: Record<UnitType, UnitStats> = {
  warrior: {
    hp: 10,
    attack: 2,
    defense: 2,
    movement: 1,
    range: 1,
    skills: ["dash", "charge"],
  },
  archer: {
    hp: 10,
    attack: 2,
    defense: 1,
    movement: 1,
    range: 2,
    skills: ["dash", "multiAttack"],
  },
  rider: {
    hp: 10,
    attack: 2,
    defense: 1,
    movement: 2,
    range: 1,
    skills: ["dash", "escape"],
  },
  catapult: {
    hp: 10,
    attack: 4,
    defense: 0,
    movement: 1,
    range: 3,
    skills: ["longShot"],
  },
  knight: {
    hp: 10,
    attack: 3,
    defense: 1,
    movement: 3,
    range: 1,
    skills: ["dash", "persistant"],
  },
  mindBender: {
    hp: 10,
    attack: 0,
    defense: 0,
    movement: 1,
    range: 1,
    skills: ["heal"],
  },
  swordsman: { hp: 15, attack: 3, defense: 3, movement: 1, range: 1 },
  defender: { hp: 15, attack: 1, defense: 3, movement: 1, range: 1 },
};

export const getAllUnitBaseStats = () => UNIT_BASE_STATS;

export const getUnitBaseStats = (unitType: UnitType) =>
  UNIT_BASE_STATS[unitType];
