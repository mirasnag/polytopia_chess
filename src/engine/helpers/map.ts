import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";
import type { Tile } from "@/types/tile";
import type { Units } from "@/types/unit";

type Occupant = UnitId | null;

export function getOccupantIdAt(x: number, y: number, units: Units): Occupant {
  for (const unit of units.values()) {
    if (unit.position.x === x && unit.position.y === y) return unit.id;
  }

  return null;
}

export function getMapTiles(state: GameState): Tile[][] {
  const { units, map } = state;
  const { width, height } = map;

  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ x, y });
    }
    tiles.push(row);
  }

  for (const unit of units.values()) {
    tiles[unit.position.y][unit.position.x].occupantId = unit.id;
  }

  return tiles;
}
