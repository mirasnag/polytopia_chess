import type { List } from "immutable";
import type { UnitId } from "./id";

export type TileKey = `${number},${number}`;

export interface Tile {
  x: number;
  y: number;
  occupantId?: UnitId;
}

export type Tiles = List<List<Tile>>;

export interface MapGrid {
  tiles: Tiles;
  width: number;
  height: number;
}
