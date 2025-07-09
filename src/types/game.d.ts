// types
import type { GameId, PlayerId, UnitId } from "@/types/id";
import type { MapGrid } from "@/types/tile";
import { UnitType } from "@/types/unit";

export interface Player {
  id: PlayerId;
}

export interface Unit {
  id: UnitId;
  type: UnitType;
  ownerId: PlayerId;
  position: { x: number; y: number };
  hp: number;
}

export type Units = Record<UnitId, Unit>;

export interface GameState {
  schemaVersion: {
    major: number;
    minor: number;
  };
  turn: {
    moveNumber: number;
    currentPlayer: PlayerId;
    actionUsed: boolean;
  };
  units: Units;
  map: MapGrid;
  isFinished: boolean;
}
