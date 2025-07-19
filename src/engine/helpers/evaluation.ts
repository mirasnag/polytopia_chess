import { getUnitBaseStats } from "@/data/unitBaseStats";
import type { UnitAction } from "@/types/action";
import type { GameState, Unit } from "@/types/game";
import type { PlayerId } from "@/types/id";
import type { UnitType } from "@/types/unit";
import { gameEngine } from "../core";

export type GameStateEvaluation = Record<PlayerId, number>;

export const unitValue: Record<UnitType, number> = {
  mindBender: 1000,
  knight: 8,
  catapult: 5,
  archer: 3,
  rider: 3,
  warrior: 2,
  swordsman: 5,
  defender: 3,
};

export const evaluateUnit = (unit: Unit): number => {
  const maxValue = unitValue[unit.type];
  const totalHp = getUnitBaseStats(unit.type).hp;
  return Math.round(maxValue * (unit.stats.hp / totalHp));
};

export const getStateEvaluation = (state: GameState): GameStateEvaluation => {
  const { units, players } = state;

  const scores: GameStateEvaluation = {};
  Object.values(players).forEach((player) => {
    scores[player.id] = 0;
  });

  Object.values(units).forEach((unit) => {
    scores[unit.ownerId] += evaluateUnit(unit);
  });

  return scores;
};

export const getPlayerScore = (
  state: GameState,
  currentPlayerId: PlayerId
): number => {
  const { players } = state;
  const scores = getStateEvaluation(state);
  let playerScore = 0;

  Object.values(players).forEach((player) => {
    playerScore +=
      player.id === currentPlayerId ? scores[player.id] : -scores[player.id];
  });

  return playerScore;
};

export const evaluatePlayerAction = (
  state: GameState,
  action: UnitAction,
  currentPlayerId: PlayerId
): number => {
  const { players } = state;

  const newState = gameEngine(state, action);
  const scores = getStateEvaluation(newState);

  let actionScore = 0;

  Object.values(players).forEach((player) => {
    actionScore +=
      player.id === currentPlayerId ? scores[player.id] : -scores[player.id];
  });

  return actionScore;
};
