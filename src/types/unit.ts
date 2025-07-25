import type { PlayerId, UnitId } from "./id";
import { Record as IRecord, Map as IMap } from "immutable";

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

const DefaultUnit: Unit = {
  id: "" as any,
  type: "" as any,
  ownerId: "" as any,
  position: { x: 0, y: 0 },
  stats: { hp: 0, attack: 0, defense: 0, movement: 0, range: 0 },
};

export class UnitRecord extends IRecord(DefaultUnit) {
  declare id: UnitId;
  declare type: UnitType;
  declare ownerId: PlayerId;
  declare position: { x: number; y: number };
  declare stats: UnitStats;

  move(to: { x: number; y: number }): UnitRecord {
    return this.set("position", to) as this;
  }
}

export type Units = IMap<UnitId, UnitRecord>;
