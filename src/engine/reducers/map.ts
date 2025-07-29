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
