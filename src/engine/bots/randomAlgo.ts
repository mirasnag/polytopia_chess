import type { TurnActions } from "@/types/action";
import type { GameState } from "@/types/game";
import { getAllValidUnitActions } from "../helpers/actions";
import { getRandomArrayEntry } from "@/utils/common.util";
import { gameEngine } from "../core";

export const randomBotAlgo = (state: GameState): TurnActions => {
  const botActions: TurnActions = [];

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
