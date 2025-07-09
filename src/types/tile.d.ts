import type { UnitId } from "./id";

export type TileKey = `${number},${number}`;

export interface Tile {
  x: number;
  y: number;
  occupantId?: UnitId;
}

export interface MapGrid {
  width: number;
  height: number;
  tiles: Tile[][];
}
