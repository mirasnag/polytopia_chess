import type { Map as IMap } from "immutable";
import type { UnitId } from "./id";

export type TileKey = `${number},${number}`;
export interface Tile {
  x: number;
  y: number;
  occupantId?: UnitId;
}

export type TileKey = `${number},${number}`;

export type Occupancy = IMap<TileKey, UnitId>;

export interface MapGrid {
  width: number;
  height: number;
  occupancy: Occupancy;
}
