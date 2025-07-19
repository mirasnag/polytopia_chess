import type { UnitAction } from "@/types/action";
import type { GameState } from "@/types/game";
import { getAllValidUnitActions } from "../helpers/actions";
import { evaluatePlayerAction } from "../helpers/evaluation";
import { getRandomArrayEntry } from "@/utils/common.util";
import { gameEngine } from "../core";

export const normalBotChooseActions = (state: GameState): UnitAction[] => {
  const botActions: UnitAction[] = [];
  const { turn } = state;
  const currentPlayerId = turn.playerOrder[turn.orderIndex];

  let currentState: GameState = state;
  const maxNumberOfActions = 5;

  while (botActions.length < maxNumberOfActions) {
    const validActions = getAllValidUnitActions(currentState);

    if (validActions.length === 0) break;

    let bestScore: number = -Infinity;
    const bestActions: UnitAction[] = [];

    validActions.forEach((curAction) => {
      const curScore = evaluatePlayerAction(
        currentState,
        curAction,
        currentPlayerId
      );

      if (curScore > bestScore) {
        bestScore = curScore;
        bestActions.length = 0;
        bestActions.push(curAction);
      } else if (curScore === bestScore) {
        bestActions.push(curAction);
      }
    });

    const randomBestAction = getRandomArrayEntry(bestActions);
    botActions.push(randomBestAction);

    currentState = gameEngine(currentState, randomBestAction);
  }

  return botActions;
};
