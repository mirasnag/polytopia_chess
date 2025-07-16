// helpers
import {
  applyUnitsToMap,
  copyTiles,
  createMap,
  moveTileOccupant,
  removeTileOccupant,
  replaceTileOccupant,
} from "./map";
import { createUnits, attackUnit, moveUnit, resetAllUnitState } from "./units";
import { advanceTurn, getInitialTurn, registerUnitAction } from "./turn";
import { kingCaptureOutcome, resignOutcome } from "./outcome";
import { isKing, schemaVersion } from "./common";

// utils
import { createBrandedId } from "@/utils/common.util";

// types
import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";

export function createReducer(): GameState {
  const playerA = createBrandedId("player");
  const playerB = createBrandedId("player");

  const units = createUnits(playerA, playerB);
  const map = applyUnitsToMap(createMap(), units);
  const players = {
    [playerA]: { id: playerA, name: "A" },
    [playerB]: { id: playerB, name: "B" },
  };
  const updatedTurn = getInitialTurn(players);

  return {
    schemaVersion: schemaVersion,
    players: players,
    units: units,
    map: map,
    turn: updatedTurn,
    outcome: { status: "ongoing" },
  };
}

export function moveReducer(
  state: GameState,
  unitId: UnitId,
  newPos: { x: number; y: number }
): GameState {
  const unit = state.units[unitId];
  const oldPos = unit.position;

  const updatedUnits = moveUnit(state.units, unitId, newPos, state.turn);

  const updatedTiles = moveTileOccupant(state.map.tiles, oldPos, newPos);

  const updatedTurn = registerUnitAction(state.turn, unitId, "move");

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

export function attackReducer(
  state: GameState,
  attackingUnitId: UnitId,
  defendingUnitId: UnitId
): GameState {
  const attackingUnit = state.units[attackingUnitId];
  const defendingUnit = state.units[defendingUnitId];
  const tiles = state.map.tiles;

  const updatedUnits = attackUnit(
    state.units,
    attackingUnitId,
    defendingUnitId
  );

  const isKilled = updatedUnits[defendingUnitId] === undefined;
  const isMeleeRangedUnit = attackingUnit.stats.range === 1;

  const updatedTiles = isKilled
    ? isMeleeRangedUnit
      ? replaceTileOccupant(
          tiles,
          attackingUnit.position,
          defendingUnit.position
        )
      : removeTileOccupant(tiles, defendingUnit.position)
    : copyTiles(tiles);

  const isKingKilled = isKing(defendingUnit) && isKilled;
  const updatedOutcome = isKingKilled
    ? kingCaptureOutcome(attackingUnit.ownerId)
    : { ...state.outcome };

  const updatedTurn = registerUnitAction(state.turn, attackingUnitId, "attack");

  return {
    ...state,
    units: updatedUnits,
    map: {
      ...state.map,
      tiles: updatedTiles,
    },
    turn: updatedTurn,
    outcome: updatedOutcome,
  };
}

export function resignReducer(state: GameState): GameState {
  const currentPlayerId = state.turn.playerOrder[state.turn.orderIndex];
  const updatedOutcome = resignOutcome(state.players, currentPlayerId);

  return {
    ...state,
    outcome: updatedOutcome,
  };
}

export function advanceReducer(state: GameState): GameState {
  const updatedTurn = advanceTurn(state.turn);
  const updatedUnits = resetAllUnitState(state.units);

  return {
    ...state,
    turn: updatedTurn,
    units: updatedUnits,
  };
}
