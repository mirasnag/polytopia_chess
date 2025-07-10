// helpers
import {
  applyUnitsToMap,
  createMap,
  moveTileOccupant,
  removeTileOccupant,
} from "./map";
import { createUnits } from "./units";
import { calculateDamage, schemaVersion } from "./common";
import { advanceTurn, getInitialTurn } from "./turn";

// utils
import { createBrandedId } from "@/utils/utils";

// types
import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";

export function createInitialGameState(): GameState {
  const playerA = createBrandedId("player");
  const playerB = createBrandedId("player");

  const units = createUnits(playerA, playerB);
  const map = applyUnitsToMap(createMap(), units);
  const players = {
    playerA: { id: playerA },
    playerB: { id: playerB },
  };
  const turns = getInitialTurn(players);

  return {
    schemaVersion: schemaVersion,
    players: players,
    turn: turns,
    units: units,
    map: map,
    isFinished: false,
  };
}

export function moveUnit(
  state: GameState,
  unitId: UnitId,
  x: number,
  y: number
): GameState {
  const unit = state.units[unitId];
  const { x: oldX, y: oldY } = unit.position;

  const updatedUnits = {
    ...state.units,
    [unitId]: {
      ...unit,
      position: { x, y },
    },
  };

  const updatedTiles = moveTileOccupant(
    state.map.tiles,
    unitId,
    { x: oldX, y: oldY },
    { x, y }
  );

  const updatedTurn = advanceTurn(state.turn);

  return {
    ...state,
    units: updatedUnits,
    map: {
      ...state.map,
      tiles: updatedTiles,
    },
    turn: updatedTurn,
  };
}

export function attackUnit(
  state: GameState,
  attackingUnitId: UnitId,
  defendingUnitId: UnitId
): GameState {
  const attackingUnit = state.units[attackingUnitId];
  const defendingUnit = state.units[defendingUnitId];
  const damage = calculateDamage(attackingUnit, defendingUnit);

  const updatedTurn = advanceTurn(state.turn);

  if (damage >= defendingUnit.hp) {
    const { [defendingUnitId]: _, ...remainingUnits } = state.units;
    const updatedTiles = removeTileOccupant(
      state.map.tiles,
      defendingUnit.position
    );

    return {
      ...state,
      units: remainingUnits,
      map: {
        ...state.map,
        tiles: updatedTiles,
      },
      turn: updatedTurn,
    };
  }

  return {
    ...state,
    units: {
      ...state.units,
      [defendingUnitId]: {
        ...defendingUnit,
        hp: defendingUnit.hp - damage,
      },
    },
    turn: updatedTurn,
  };
}
