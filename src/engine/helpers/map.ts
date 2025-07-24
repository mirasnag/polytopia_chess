import type { GameState, Units } from "@/types/game";
import type { UnitId } from "@/types/id";
import type { Tile } from "@/types/tile";

type Occupant = UnitId | null;

export function getOccupantIdAt(x: number, y: number, units: Units): Occupant {
  for (const u of Object.values(units)) {
    if (u.position.x === x && u.position.y === y) return u.id;
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

  Object.values(units).forEach((unit) => {
    tiles[unit.position.y][unit.position.x].occupantId = unit.id;
  });

  return tiles;
}
