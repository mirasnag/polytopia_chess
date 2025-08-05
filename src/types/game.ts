// types
import type { PlayerId, UnitId } from "@/types/id";
import type { MapGrid } from "@/types/tile";
import type { Units } from "@/types/unit";
import type { GameConfig } from "./gameConfig";
import type { GameAction } from "./action";

export type BotType = "easy-bot" | "normal-bot" | "hard-bot" | "crazy-bot";
export type PlayerType = "human" | BotType;

export interface PlayerInGame {
  id: PlayerId;
  name: string;
  type: PlayerType;
}

export type Players = PlayerInGame[];

export interface Turn {
  counter: number;
  currentPlayerId: PlayerId;

  actingUnitId: UnitId | null;
  actions: GameAction[];
}

export type GameOutcome =
  | { status: "ongoing"; winnerId: null; reason: null }
  | {
      status: "finished";
      winnerId: PlayerId;
      reason: "resign" | "kingCaptured";
    };

export type ZobristTable = BigInt64Array;
export type ZobristKey = bigint;

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
  zKey: ZobristKey;
  zTable: ZobristTable;
}
