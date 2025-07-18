import type { UnitAction } from "@/types/action";
import type { BotType, GameState } from "@/types/game";
import { getAllValidUnitActions } from "@/engine/helpers/actions";
import { gameEngine } from "./core";
import { evaluatePlayerAction } from "./helpers/evaluation";
import { getRandomArrayEntry } from "@/utils/common.util";

export const botChooseActions = (
  state: GameState,
  botType: BotType
): UnitAction[] => {
  switch (botType) {
    case "easy-bot":
      return easyBotChooseActions(state);
    case "normal-bot":
      return normalBotChooseActions(state);
    default:
      throw new Error("Unhandled or invalid bot type:", botType);
  }
};

export const easyBotChooseActions = (state: GameState): UnitAction[] => {
  const botActions: UnitAction[] = [];

  let currentState: GameState = state;
  const maxNumberOfActions = 5;

  while (botActions.length < maxNumberOfActions) {
    const validActions = getAllValidUnitActions(currentState);

    if (validActions.length === 0) break;

    const randomAction = getRandomArrayEntry(validActions);

    botActions.push(randomAction);

    currentState = gameEngine(currentState, randomAction);
  }

  return botActions;
};

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
