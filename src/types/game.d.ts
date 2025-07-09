import type { GameId, PlayerId, UnitId } from "./id";
import type { MapGrid } from "./tile";
import { UnitType } from "./unit";

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
  units: Record<UnitId, Unit>;
  map: MapGrid;
  isFinished: boolean;
}
