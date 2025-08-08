// helpers
import {
  createUnits,
  attackUnitCommand,
  moveUnitCommand,
} from "@/engine/commands/units";
import {
  advanceTurnCommand,
  getInitialTurn,
  registerUnitActionCommand,
} from "@/engine/commands/turn";
import {
  kingCaptureOutcomeCommand,
  resignOutcomeCommand,
} from "@/engine/commands/outcome";
import { isKing, schemaVersion } from "@/engine/common";
import {
  computeZobristKey,
  createZobristTable,
  updateZobristKeyAdvanceTurnCommand,
  updateZobristKeyUnitsCommand,
} from "@/engine/commands/zobrist";
import {
  createMap,
  moveTileOccupantCommand,
  removeTileOccupantCommand,
  replaceTileOccupantCommand,
} from "@/engine/commands/map";

// data
import { defaultGameConfig } from "@/data/defaultGameConfig";

// types
import type { GameOutcome, GameState } from "@/types/game";
import type { GameConfig } from "@/types/gameConfig";
import type { UnitActionPayload } from "@/types/action";
import type { MapGrid } from "@/types/tile";
import type { Units } from "@/types/unit";

export type Undo = () => void;

export function createCommand(
  state: GameState,
  overrideConfig?: Partial<GameConfig>
): Undo {
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
  const zKey = computeZobristKey(zTable, units);

  state = {
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

  return () => {};
}

export function moveCommand(
  state: GameState,
  payload: UnitActionPayload
): Undo {
  const { unitId, to } = payload;
  const unit = state.units.get(unitId)!;
  const from = unit.position;

  const undoUnit = moveUnitCommand(state, unitId, to);

  const undoMap = moveTileOccupantCommand(state, from, to);

  const undoTurn = registerUnitActionCommand(state, {
    type: "move",
    payload,
  });
  const undoZKey = updateZobristKeyUnitsCommand(
    state,
    [unit],
    [state.units.get(unitId)]
  );

  // composite undo in reverse order
  return () => {
    undoZKey();
    undoTurn();
    undoMap();
    undoUnit();
  };
}

export function attackCommand(
  state: GameState,
  payload: UnitActionPayload
): Undo {
  const { unitId: attackerId, to: defenderPos } = payload;
  const attacker = state.units.get(attackerId)!;
  const attackerPos = attacker.position;
  const defenderId = state.map.occupancy.get(
    `${defenderPos.y},${defenderPos.x}`
  )!;
  const defender = state.units.get(defenderId)!;

  const undoUnits = attackUnitCommand(state.units, attackerId, defenderId);

  const killed = state.units.has(defenderId) === false;
  const undoMap: Undo = killed
    ? attacker.stats.range === 1
      ? replaceTileOccupantCommand(state.map, attackerPos, defenderPos)
      : removeTileOccupantCommand(state.map, defenderPos)
    : () => {};

  const undoOutcome =
    killed && isKing(defender)
      ? kingCaptureOutcomeCommand(state.outcome, attacker.ownerId)
      : () => {};

  const undoTurn = registerUnitActionCommand(state, {
    type: killed ? "kill" : "attack",
    payload,
  });

  const undoZKey = updateZobristKeyUnitsCommand(
    state,
    [attacker, defender],
    [state.units.get(attackerId), state.units.get(defenderId)]
  );

  // composite undo
  return () => {
    undoZKey();
    undoTurn();
    undoOutcome();
    undoMap();
    undoUnits();
  };
}

export function resignCommand(state: GameState): Undo {
  return resignOutcomeCommand(state.outcome, state.turn.currentPlayerId);
}

export function advanceCommand(state: GameState): Undo {
  const undoTurn = advanceTurnCommand(state.turn, state.players);
  const undoZKey = updateZobristKeyAdvanceTurnCommand(state);
  return () => {
    undoZKey();
    undoTurn();
  };
}
