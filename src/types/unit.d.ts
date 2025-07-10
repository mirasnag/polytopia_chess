export type UnitType =
  | "warrior"
  | "archer"
  | "rider"
  | "catapult"
  | "knight"
  | "swordsman"
  | "defender"
  | "mindBender";

export interface UnitStats {
  hp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
  skills?: string[];
}
