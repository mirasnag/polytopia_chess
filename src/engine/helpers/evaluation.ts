// helpers
import { getUnitBaseStats } from "@/data/unitBaseStats";
import { gameEngine } from "../core";

// types
import type { UnitAction } from "@/types/action";
import type { GameState } from "@/types/game";
import type { PlayerId } from "@/types/id";
import type { UnitType, Unit } from "@/types/unit";

export type GameStateEvaluation = number[];

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
  const { units, players, outcome } = state;
  const scores: GameStateEvaluation = new Array<number>(players.length, 0);

  if (outcome.status === "finished") {
    scores.fill(-Infinity);
    scores[outcome.winnerId] = Infinity;
    return scores;
  }

  units.forEach((unit) => {
    scores[unit.ownerId] += evaluateUnit(unit);
  });

  return scores;
};

export const getPlayerScore = (
  state: GameState,
  playerId: PlayerId
): number => {
  const scores = getStateEvaluation(state);
  return scores[playerId];
};

export const evaluatePlayerAction = (
  state: GameState,
  action: UnitAction,
  playerId: PlayerId
): number => {
  const newState = gameEngine(state, action);
  const scores = getStateEvaluation(newState);

  const totalScore = scores.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return totalScore - 2 * scores[playerId];
};
