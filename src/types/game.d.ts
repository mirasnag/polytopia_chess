// types
import type { GameId, PlayerId, UnitId } from "@/types/id";
import type { MapGrid } from "@/types/tile";
import {
  UnitType,
  type ActionKey,
  type UnitSkillKey,
  type UnitStats,
} from "@/types/unit";
import type { GameConfig } from "./gameConfig";

export type BotType = "easy-bot" | "normal-bot" | "hard-bot" | "crazy-bot";
export type PlayerType = "human" | BotType;

export interface PlayerInGame {
  id: PlayerId;
  name: string;
  type: PlayerType;
}

export type Players = Record<PlayerId, PlayerInGame>;

export interface Unit {
  id: UnitId;
  type: UnitType;
  ownerId: PlayerId;
  position: { x: number; y: number };
  stats: UnitStats;
}

export type Units = Record<UnitId, Unit>;

export interface Turn {
  counter: number;
  playerOrder: PlayerId[];
  orderIndex: number;
  currentPlayerId: PlayerId;

  actingUnitId: UnitId | null;
  actions: ActionKey[];
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
  config: GameConfig;
}
