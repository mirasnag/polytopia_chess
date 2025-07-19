// helpers
import {
  applyUnitsToMap,
  copyTiles,
  createMap,
  moveTileOccupant,
  removeTileOccupant,
  replaceTileOccupant,
} from "@/engine/reducers/map";
import {
  createUnits,
  attackUnit,
  moveUnit,
  resetAllUnitState,
} from "@/engine/reducers/units";
import {
  advanceTurn,
  getInitialTurn,
  registerUnitAction,
} from "@/engine/reducers/turn";
import { kingCaptureOutcome, resignOutcome } from "@/engine/reducers/outcome";
import { isKing, schemaVersion } from "@/engine/common";

// utils
import { createBrandedId } from "@/utils/common.util";

// types
import type { GameState, Players } from "@/types/game";
import type { UnitId } from "@/types/id";
import type { GameConfig } from "@/types/gameConfig";
import { defaultGameConfig } from "@/data/defaultGameConfig";

export function createReducer(
  config: GameConfig = defaultGameConfig
): GameState {
  const { playerTypes } = config;
  const playerA = createBrandedId("player");
  const playerB = createBrandedId("player");

  const units = createUnits(playerA, playerB);
  const map = applyUnitsToMap(createMap(), units);

  const players: Players = {
    [playerA]: { id: playerA, name: "A", type: playerTypes[0] },
    [playerB]: { id: playerB, name: "B", type: playerTypes[1] },
  };
  const updatedTurn = getInitialTurn(players);

  return {
    schemaVersion: schemaVersion,
    players: players,
    units: units,
    map: map,
    turn: updatedTurn,
    outcome: { status: "ongoing" },
    config: config,
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
  const { currentPlayerId } = state.turn;
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
