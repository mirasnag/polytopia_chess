// helpers
import {
  applyUnitsToMap,
  createMap,
  moveTileOccupant,
  removeTileOccupant,
} from "./map";
import { createUnits } from "./units";
import { advanceTurn, getInitialTurn, registerUnitAction } from "./turn";
import { kingCaptureOutcome, resignOutcome } from "./outcome";
import { isKing, schemaVersion } from "./common";

// utils
import { calculateDamage } from "@/utils/combat.util";
import { createBrandedId } from "@/utils/common.util";

// types
import type { GameState } from "@/types/game";
import type { UnitId } from "@/types/id";

export function createInitialGameState(): GameState {
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

export function attackUnit(
  state: GameState,
  attackingUnitId: UnitId,
  defendingUnitId: UnitId
): GameState {
  const attackingUnit = state.units[attackingUnitId];
  const defendingUnit = state.units[defendingUnitId];
  const damage = calculateDamage(attackingUnit, defendingUnit);
  const updatedTurn = registerUnitAction(state.turn, attackingUnitId, "attack");

  // defending unit is killed
  if (damage >= defendingUnit.hp) {
    const { [defendingUnitId]: _, ...remainingUnits } = state.units;
    const updatedTiles = removeTileOccupant(
      state.map.tiles,
      defendingUnit.position
    );

    const updatedOutcome = isKing(defendingUnit)
      ? kingCaptureOutcome(attackingUnit.ownerId)
      : { ...state.outcome };

    return {
      ...state,
      units: remainingUnits,
      map: {
        ...state.map,
        tiles: updatedTiles,
      },
      outcome: updatedOutcome,
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

export function resign(state: GameState): GameState {
  const currentPlayerId = state.turn.playerOrder[state.turn.orderIndex];
  const updatedOutcome = resignOutcome(state.players, currentPlayerId);

  return {
    ...state,
    outcome: updatedOutcome,
  };
}

export function advance(state: GameState): GameState {
  const updatedTurn = advanceTurn(state.turn);

  return {
    ...state,
    turn: updatedTurn,
  };
}
