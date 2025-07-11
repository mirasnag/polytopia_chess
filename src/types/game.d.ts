// types
import type { GameId, PlayerId, UnitId } from "@/types/id";
import type { MapGrid } from "@/types/tile";
import { UnitType } from "@/types/unit";

export interface PlayerInGame {
  id: PlayerId;
  name: string;
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

export type GameOutcome =
  | { status: "ongoing" }
  | {
      status: "finished";
      winnerId: PlayerId;
      reason: "resign" | "kingCaptured";
    };

export interface GameState {
  schemaVersion: {
    major: number;
    minor: number;
  };
  players: Players;
  units: Units;
  map: MapGrid;
  turn: Turn;
  outcome: GameOutcome;
}
