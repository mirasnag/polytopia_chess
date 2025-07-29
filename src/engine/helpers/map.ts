import type { MapGrid, Tile, TileKey } from "@/types/tile";

export function keyToTile(key: TileKey): Tile {
  const [y, x] = key.split(",");
  return {
    x: parseInt(x),
    y: parseInt(y),
  };
}

export function getMapTiles(map: MapGrid): Tile[][] {
  const { width, height, occupancy } = map;

  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ y, x });
    }
    tiles.push(row);
  }

  for (const [tileKey, unitId] of occupancy.entries()) {
    const tile = keyToTile(tileKey);
    tiles[tile.y][tile.x].occupantId = unitId;
  }

  return tiles;
}
