export type UnitType =
  | "warrior" // pawn
  | "archer" // bishop
  | "rider" // knight
  | "catapult" // rook
  | "knight" // queen
  | "swordsman"; // king

export interface UnitStats {
  hp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
  skills?: string[];
}
