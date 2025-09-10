// helpers
import {
  createUnits,
  attackUnit,
  moveUnit,
  // resetAllUnitState,
} from "@/engine/reducers/units";
import {
  advanceTurn,
  getInitialTurn,
  registerUnitAction,
} from "@/engine/reducers/turn";
import { kingCaptureOutcome, resignOutcome } from "@/engine/reducers/outcome";
import { isKing, schemaVersion } from "@/engine/common";
import {
  computeZobristKey,
  createZobristTable,
  updateZobristKeyAdvanceTurn,
  updateZobristKeyUnits,
} from "./zobrist";
import { createMap, moveTileOccupant, updateTileOccupants } from "./map";

// data
import { defaultGameConfig } from "@/data/defaultGameConfig";

// types
import type { GameOutcome, GameState } from "@/types/game";
import type { GameConfig } from "@/types/gameConfig";
import type { UnitActionPayload } from "@/types/action";
import type { MapGrid } from "@/types/tile";
import type { Units } from "@/types/unit";

export function createReducer(
  overrideConfig: Partial<GameConfig> = {}
): GameState {
  const config = {
    ...defaultGameConfig,
    ...overrideConfig,
  };

  const { playerTypes, map: mapConfig } = config;

  // Currently no order shuffling applied
  const playerOrder = playerTypes.map((playerType) => {
    return { name: `${playerType}`, type: playerType };
  });

  const players = playerOrder.map((player, id) => {
    return { id, ...player };
  });

  const units: Units = createUnits(mapConfig.boardLayout);
  const map: MapGrid = createMap(mapConfig.width, mapConfig.height, units);

  const outcome: GameOutcome = {
    status: "ongoing",
    winnerId: null,
    reason: null,
  };
  const turn = getInitialTurn();

  const zTable = createZobristTable();
  const zKey = computeZobristKey(zTable, units, turn.currentPlayerId);

  return {
    schemaVersion,
    players,
    units,
    map,
    turn,
    outcome,
    config,
    zTable,
    zKey,
  };
}

export function moveReducer(
  state: GameState,
  payload: UnitActionPayload
): GameState {
  const { unitId, to: newPos } = payload;

  const unit = state.units.get(unitId);
  if (!unit) {
    throw new Error("Unit not found!");
  }

  const updatedUnits = moveUnit(state.units, unitId, newPos);
  const updatedMap = moveTileOccupant(state.map, unit.position, newPos);
  const updatedTurn = registerUnitAction(state.turn, { type: "move", payload });
  const updatedZKey = updateZobristKeyUnits(
    state.zKey,
    state.zTable,
    [state.units.get(unitId)],
    [updatedUnits.get(unitId)]
  );

  return {
    ...state,
    units: updatedUnits,
    map: updatedMap,
    turn: updatedTurn,
    zKey: updatedZKey,
  };
}

export function attackReducer(
  state: GameState,
  payload: UnitActionPayload
): GameState {
  const { unitId: attackingUnitId, to } = payload;
  const defendingUnitId = state.map.occupancy.get(`${to.y},${to.x}`);

  if (!defendingUnitId) {
    throw new Error("Attacked tile has no unit");
  }

  const attackingUnit = state.units.get(attackingUnitId);
  const defendingUnit = state.units.get(defendingUnitId);

  if (!attackingUnit || !defendingUnit) {
    throw new Error("Unit not found!");
  }

  const updatedUnits = attackUnit(
    state.units,
    attackingUnitId,
    defendingUnitId
  );

  const updatedMap = updateTileOccupants(
    state.map,
    [defendingUnit.position, attackingUnit.position],
    [
      updatedUnits.get(defendingUnitId)?.position,
      updatedUnits.get(attackingUnitId)?.position,
    ]
  );

  const isKilled = updatedUnits.get(defendingUnitId) === undefined;
  const isKingKilled = isKing(defendingUnit) && isKilled;

  const updatedOutcome = isKingKilled
    ? kingCaptureOutcome(attackingUnit.ownerId)
    : { ...state.outcome };

  const updatedTurn = registerUnitAction(state.turn, {
    type: isKilled ? "kill" : "attack",
    payload,
  });

  const updatedZKey = updateZobristKeyUnits(
    state.zKey,
    state.zTable,
    [attackingUnit, defendingUnit],
    [updatedUnits.get(attackingUnitId), updatedUnits.get(defendingUnitId)]
  );

  return {
    ...state,
    units: updatedUnits,
    map: updatedMap,
    turn: updatedTurn,
    outcome: updatedOutcome,
    zKey: updatedZKey,
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
  const updatedTurn = advanceTurn(state.turn, state.players);
  const updatedZKey = updateZobristKeyAdvanceTurn(state.zKey, state.zTable);

  return {
    ...state,
    turn: updatedTurn,
    zKey: updatedZKey,
  };
}
