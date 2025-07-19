import type { UnitAction } from "@/types/action";
import type { GameState } from "@/types/game";
import { getAllValidUnitActions } from "../helpers/actions";
import { getRandomArrayEntry } from "@/utils/common.util";
import { gameEngine } from "../core";

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
