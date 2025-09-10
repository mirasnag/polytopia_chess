// library imports
import { Map as IMap } from "immutable";

// types
import type { Units } from "@/types/unit";
import type { MapGrid, TileKey } from "@/types/tile";
import type { UnitId } from "@/types/id";

export function createMap(
  width: number = 8,
  height: number = 8,
  units?: Units
): MapGrid {
  const occupancy =
    units?.mapEntries<TileKey, UnitId>(([unitId, unit]) => {
      return [`${unit.position.y},${unit.position.x}`, unitId];
    }) ?? IMap();

  return { width, height, occupancy };
}

export function moveTileOccupant(
  map: MapGrid,
  from: { x: number; y: number },
  to: { x: number; y: number }
): MapGrid {
  const keyFrom = `${from.y},${from.x}` as TileKey;
  const keyTo = `${to.y},${to.x}` as TileKey;
  const unitId = map.occupancy.get(keyFrom)!;

  return {
    ...map,
    occupancy: map.occupancy.delete(keyFrom).set(keyTo, unitId),
  };
}

export function removeTileOccupant(
  map: MapGrid,
  pos: { x: number; y: number }
): MapGrid {
  const key = `${pos.y},${pos.x}` as TileKey;

  return {
    ...map,
    occupancy: map.occupancy.delete(key),
  };
}

export function replaceTileOccupant(
  map: MapGrid,
  from: { x: number; y: number },
  to: { x: number; y: number }
): MapGrid {
  const keyFrom = `${from.y},${from.x}` as TileKey;
  const keyTo = `${to.y},${to.x}` as TileKey;
  const unitId = map.occupancy.get(keyFrom)!;

  return {
    ...map,
    occupancy: map.occupancy.delete(keyFrom).set(keyTo, unitId),
  };
}

/**
 * Immutably sets occupancy entries at "from" to corresponding position from "to"
 * Assumes that "from" and "to" has the same size
 * @param map
 * @param from
 * @param to
 */
type OptionalTile = { x: number; y: number } | undefined;

export function updateTileOccupants(
  map: MapGrid,
  from: { x: number; y: number }[],
  to: OptionalTile[]
): MapGrid {
  let updatedMap: MapGrid = { ...map };

  for (let i = 0; i < from.length; i++) {
    updatedMap = to[i]
      ? moveTileOccupant(updatedMap, from[i], to[i]!)
      : removeTileOccupant(updatedMap, from[i]);
  }

  return updatedMap;
}
