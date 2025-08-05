import type { PlayerType } from "./game";

export interface GameConfig {
  playerTypes: PlayerType[];
  map: { width: number; height: number; boardLayout: string[][] };
}
