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

export type MoveActionKey = "move";
export type AttackActionKey = "attack";
export type UnitActionKey = MoveActionKey | AttackActionKey;

export interface UnitStats {
  hp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
  traits?: UnitTraitKey[];
}
