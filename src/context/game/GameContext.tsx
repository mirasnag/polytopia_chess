// hooks
import { createContext, useContext, useEffect, useReducer } from "react";

// types
import type { Dispatch, ReactNode } from "react";
import type { GameState, PlayerInGame } from "@/types/game";

// helpers
import { gameReducer, type GameAction } from "./gameReducer";
import { createInitialGameState } from "./helpers";
import { gameManager } from "@/managers/gameManager";

export const GameContext = createContext<{
  state: GameState;
  units: GameState["units"];
  tiles: GameState["map"]["tiles"];
  turn: GameState["turn"];
  players: GameState["players"];
  currentPlayer: PlayerInGame;
  dispatch: Dispatch<GameAction>;
} | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

const initGameState = (): GameState => {
  if (gameManager.hasSavedGame()) {
    return gameManager.load() ?? createInitialGameState();
  }

  return createInitialGameState();
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, initGameState);

  useEffect(() => {
    gameManager.save(state);
  }, [state]);

  const value = {
    state: state,
    dispatch: dispatch,
    units: state.units,
    tiles: state.map.tiles,
    turn: state.turn,
    players: state.players,
    currentPlayer: state.players[state.turn.playerOrder[state.turn.orderIndex]],
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
}
