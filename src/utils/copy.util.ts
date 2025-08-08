import type { GameState } from "@/types/game";

export function deepCopy(aObject: any) {
  return structuredClone(aObject);
}

export function copyGameState(state: GameState): GameState {
  return {
    ...state,
    units: state.units,
    map: {
      ...state.map,
      occupancy: state.map.occupancy,
    },
    turn: {
      ...state.turn,
      actions: state.turn.actions.slice(),
    },
  };
}
