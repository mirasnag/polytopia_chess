export type UnitType =
  | "warrior"
  | "archer"
  | "rider"
  | "catapult"
  | "knight"
  | "swordsman"
  | "defender"
  | "mindBender";

export type SkillActionKey =
  | "dash"
  | "escape"
  | "persistant"
  | "charge"
  | "heal"
  | "multiAttack"
  | "longShot";

export type BasicActionKey = "move" | "attack";

export type UnitActionKey = SkillActionKey | BasicActionKey;

export interface UnitAction {
  description: string;
  type: "passive" | "active" | "basic";
  cost: number;
}

export interface UnitStats {
  hp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
  skills?: SkillActionKey[];
}
