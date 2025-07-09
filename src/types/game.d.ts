// types
import type { GameId, PlayerId, UnitId } from "@/types/id";
import type { MapGrid } from "@/types/tile";
import { UnitType } from "@/types/unit";

export interface PlayerInGame {
  id: PlayerId;
}

export type Players = Record<PlayerId, PlayerInGame>;

export interface Unit {
  id: UnitId;
  type: UnitType;
  ownerId: PlayerId;
  position: { x: number; y: number };
  hp: number;
}

export type Units = Record<UnitId, Unit>;

export interface Turn {
  counter: number;
  playerOrder: PlayerId[];
  orderIndex: number;
}

export interface GameState {
  schemaVersion: {
    major: number;
    minor: number;
  };
  players: Players;
  turn: Turn;
  units: Units;
  map: MapGrid;
  isFinished: boolean;
}
