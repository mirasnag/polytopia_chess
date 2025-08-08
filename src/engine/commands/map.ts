// library imports
import { Map as IMap } from "immutable";

// types
import type { Units } from "@/types/unit";
import type { MapGrid, TileKey } from "@/types/tile";
import type { UnitId } from "@/types/id";
import type { GameState } from "@/types/game";

// A simple undo function signature
export type Undo = () => void;

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

export function moveTileOccupantCommand(
  state: GameState,
  from: { x: number; y: number },
  to: { x: number; y: number }
): Undo {
  const keyFrom = `${from.y},${from.x}` as TileKey;
  const keyTo = `${to.y},${to.x}` as TileKey;
  const unitId = state.map.occupancy.get(keyFrom)!;

  // apply
  state.map.occupancy = state.map.occupancy.delete(keyFrom).set(keyTo, unitId);

  // undo
  return () => {
    state.map.occupancy = state.map.occupancy
      .delete(keyTo)
      .set(keyFrom, unitId);
  };
}

export function removeTileOccupantCommand(
  map: MapGrid,
  pos: { x: number; y: number }
): Undo {
  const key = `${pos.y},${pos.x}` as TileKey;
  const unitId = map.occupancy.get(key)!;

  // apply
  map.occupancy = map.occupancy.delete(key);

  // undo
  return () => {
    map.occupancy.set(key, unitId);
  };
}

export function replaceTileOccupantCommand(
  map: MapGrid,
  from: { x: number; y: number },
  to: { x: number; y: number }
): Undo {
  const keyFrom = `${from.y},${from.x}` as TileKey;
  const keyTo = `${to.y},${to.x}` as TileKey;
  const unitId = map.occupancy.get(keyFrom)!;
  const capturedId = map.occupancy.get(keyTo)!;

  // apply
  map.occupancy = map.occupancy.delete(keyFrom).set(keyTo, unitId);

  // undo
  return () => {
    map.occupancy = map.occupancy
      .delete(keyTo)
      .set(keyFrom, unitId)
      .set(keyTo, capturedId);
  };
}
