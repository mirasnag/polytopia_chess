// hooks
import { createContext, useContext, useEffect, useReducer } from "react";

// types
import type { Dispatch, ReactNode } from "react";
import type { GameState, PlayerInGame } from "@/types/game";
import type { GameAction } from "@/types/action";
import type { Units } from "@/types/unit";
import type { Tile } from "@/types/tile";

// helpers
import { createReducer } from "@/engine/reducers/index";
import { gameEngine } from "@/engine/core";
import { gameManager } from "@/managers/gameManager";
import { getMapTiles } from "@/engine/helpers/map";

export const GameContext = createContext<{
  state: GameState;
  units: Units;
  turn: GameState["turn"];
  map: GameState["map"];
  tiles: Tile[][];
  players: GameState["players"];
  outcome: GameState["outcome"];
  config: GameState["config"];
  currentPlayer: PlayerInGame;
  dispatch: Dispatch<GameAction>;
} | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

const initGameState = (): GameState => {
  if (gameManager.hasSavedGame()) {
    return gameManager.load() ?? createReducer();
  }

  return createReducer();
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameEngine, undefined, initGameState);

  useEffect(() => {
    gameManager.save(state);
  }, [state]);

  const value = {
    state: state,
    dispatch: dispatch,
    units: state.units,
    map: state.map,
    tiles: getMapTiles(state.map),
    turn: state.turn,
    outcome: state.outcome,
    players: state.players,
    config: state.config,
    currentPlayer: state.players[state.turn.currentPlayerId],
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
