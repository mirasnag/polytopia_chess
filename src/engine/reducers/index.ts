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
import { getOccupantIdAt } from "../helpers/map";

// utils
import { createBrandedId } from "@/utils/common.util";

// data
import { defaultGameConfig } from "@/data/defaultGameConfig";

// types
import type { GameState, Players } from "@/types/game";
import type { GameConfig } from "@/types/gameConfig";
import type { UnitActionPayload } from "@/types/action";

export function createReducer(
  config: GameConfig = defaultGameConfig
): GameState {
  const { playerTypes } = config;
  const playerA = createBrandedId("player");
  const playerB = createBrandedId("player");

  const units = createUnits(playerA, playerB);

  const players: Players = {
    [playerA]: { id: playerA, name: "A", type: playerTypes[0] },
    [playerB]: { id: playerB, name: "B", type: playerTypes[1] },
  };
  const updatedTurn = getInitialTurn(players);

  return {
    schemaVersion: schemaVersion,
    players: players,
    units: units,
    map: {
      width: 8,
      height: 8,
    },
    turn: updatedTurn,
    outcome: { status: "ongoing" },
    config: config,
  };
}

export function moveReducer(
  state: GameState,
  payload: UnitActionPayload
): GameState {
  const { unitId, to: newPos } = payload;

  const updatedUnits = moveUnit(state.units, unitId, newPos);
  const updatedTurn = registerUnitAction(state.turn, { type: "move", payload });

  return {
    ...state,
    units: updatedUnits,
    turn: updatedTurn,
  };
}

export function attackReducer(
  state: GameState,
  payload: UnitActionPayload
): GameState {
  const { unitId: attackingUnitId, to } = payload;
  const defendingUnitId = getOccupantIdAt(to.x, to.y, state.units);

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

  const isKilled = updatedUnits.get(defendingUnitId) === undefined;
  const isKingKilled = isKing(defendingUnit) && isKilled;

  const updatedOutcome = isKingKilled
    ? kingCaptureOutcome(attackingUnit.ownerId)
    : { ...state.outcome };

  const updatedTurn = registerUnitAction(state.turn, {
    type: isKilled ? "kill" : "attack",
    payload,
  });

  return {
    ...state,
    units: updatedUnits,
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

  return {
    ...state,
    turn: updatedTurn,
  };
}
