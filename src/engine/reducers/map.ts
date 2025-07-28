// types
import type { Units } from "@/types/unit";
import type { MapGrid, Tile, Tiles } from "@/types/tile";
import { List } from "immutable";

export function createMap(width: number = 8, height: number = 8): MapGrid {
  let tiles: Tiles = List(List([]));
  for (let y = 0; y < height; y++) {
    let row: List<Tile> = List([]);
    for (let x = 0; x < width; x++) {
      row = row.withMutations((row) => {
        row.push({ x, y });
      });
    }
    tiles = tiles.withMutations((tiles) => {
      tiles.push(row);
    });
  }

  return { width, height, tiles };
}

export function copyTiles(tiles: Tiles): Tiles {
  return tiles.slice();
}

export function applyUnitsToMap(map: MapGrid, units: Units): MapGrid {
  const tiles = map.tiles.withMutations((tiles) => {
    units.forEach((unit) => {
      tiles.setIn([unit.position.y, unit.position.x, "occupantId"], unit.id);
    });
  });
  return { ...map, tiles };
}

export function moveTileOccupant(
  tiles: Tiles,
  from: { x: number; y: number },
  to: { x: number; y: number }
): Tiles {
  return tiles.withMutations((tiles) => {
    const occupantId = tiles.getIn([from.y, from.x, "occupantId"]);
    tiles.setIn([to.y, to.x, "occupantId"], occupantId);
    tiles.deleteIn([from.y, from.x, "occupantId"]);
  });
}

export function removeTileOccupant(
  tiles: Tiles,
  pos: { x: number; y: number }
): Tiles {
  return tiles.withMutations((tiles) => {
    tiles.deleteIn([pos.y, pos.x, "occupantId"]);
  });
}

export function replaceTileOccupant(
  tiles: Tiles,
  from: { x: number; y: number },
  to: { x: number; y: number }
): Tiles {
  return tiles.withMutations((tiles) => {
    const occupantId = tiles.getIn([from.y, from.x, "occupantId"]);
    tiles.setIn([to.y, to.x, "occupantId"], occupantId);
    tiles.deleteIn([from.y, from.x, "occupantId"]);
  });
}
