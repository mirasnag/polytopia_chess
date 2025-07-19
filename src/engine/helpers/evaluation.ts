import { getUnitBaseStats } from "@/data/unitBaseStats";
import type { UnitAction } from "@/types/action";
import type { GameState, Unit } from "@/types/game";
import type { PlayerId } from "@/types/id";
import type { UnitType } from "@/types/unit";
import { gameEngine } from "../core";

export type GameStateEvaluation = Record<PlayerId, number>;

export const unitValue: Record<UnitType, number> = {
  mindBender: 1000,
  knight: 80,
  catapult: 50,
  archer: 30,
  rider: 30,
  warrior: 10,
  swordsman: 50,
  defender: 30,
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
  playerId: PlayerId
): number => {
  const { players } = state;
  const scores = getStateEvaluation(state);
  let playerScore = 0;

  Object.values(players).forEach((player) => {
    playerScore +=
      player.id === playerId ? scores[player.id] : -scores[player.id];
  });

  return playerScore;
};

export const evaluatePlayerAction = (
  state: GameState,
  action: UnitAction,
  playerId: PlayerId
): number => {
  const { players } = state;

  const newState = gameEngine(state, action);
  const scores = getStateEvaluation(newState);

  let actionScore = 0;

  Object.values(players).forEach((player) => {
    actionScore +=
      player.id === playerId ? scores[player.id] : -scores[player.id];
  });

  return actionScore;
};
