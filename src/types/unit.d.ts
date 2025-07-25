import type { PlayerId, UnitId } from "./id";

export type UnitType =
  | "warrior"
  | "archer"
  | "rider"
  | "catapult"
  | "knight"
  | "swordsman"
  | "defender"
  | "mindBender";

export type UnitTraitKey = "dash" | "escape" | "persist";

export interface UnitTrait {
  description: string;
}

export interface UnitStats {
  hp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
  traits?: UnitTraitKey[];
}

export interface Unit {
  id: UnitId;
  type: UnitType;
  ownerId: PlayerId;
  position: { x: number; y: number };
  stats: UnitStats;
}

export type Units = Record<UnitId, Unit>;
