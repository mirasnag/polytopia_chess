// library imports
import { LRUCache } from "lru-cache";

// helpers
import { getUnitBaseStats } from "@/data/unitBaseStats";
import { gameEngine } from "../core";

// types
import type { UnitAction } from "@/types/action";
import type { ZobristKey, GameState } from "@/types/game";
import type { PlayerId } from "@/types/id";
import type { UnitType, Unit } from "@/types/unit";

export type GameStateEvaluation = number[];

export const unitValue: Record<UnitType, number> = {
  mindBender: 100,
  knight: 80,
  catapult: 50,
  archer: 30,
  rider: 30,
  warrior: 10,
};

export const evaluateUnit = (unit: Unit): number => {
  const maxValue = unitValue[unit.type];
  const totalHp = getUnitBaseStats(unit.type).hp;
  return Math.round(maxValue * (unit.stats.hp / totalHp));
};

// tranposition table for state evaluations
const tt = new LRUCache<ZobristKey, GameStateEvaluation>({
  max: 20000,
});

export const getStateEvaluation = (state: GameState): GameStateEvaluation => {
  const entry = tt.get(state.zKey);
  if (entry) return entry;

  const { units, players, outcome } = state;
  const scores: GameStateEvaluation = new Array<number>(players.length).fill(0);

  if (outcome.status === "finished") {
    scores.fill(-Infinity);
    scores[outcome.winnerId] = Infinity;
    return scores;
  }

  units.forEach((unit) => {
    scores[unit.ownerId] += evaluateUnit(unit);
  });

  tt.set(state.zKey, scores);
  return scores;
};

export const getPlayerScore = (
  state: GameState,
  playerId: PlayerId
): number => {
  const scores = getStateEvaluation(state);
  if (state.outcome.status === "finished") {
    return scores[playerId];
  }

  const totalScore = scores.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return 2 * scores[playerId] - totalScore;
};

export const evaluatePlayerAction = (
  state: GameState,
  action: UnitAction,
  playerId: PlayerId
): number => {
  const newState = gameEngine(state, action);
  const scores = getStateEvaluation(newState);

  if (state.outcome.status === "finished") {
    return scores[playerId];
  }

  const totalScore = scores.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  return 2 * scores[playerId] - totalScore;
};

export const isMateScore = (score: number) =>
  !Number.isFinite(score) || Math.abs(score) > 1e9;
