import type { UnitAction } from "@/types/action";
import type { BotType, GameState } from "@/types/game";
import { getAllValidUnitActions } from "@/engine/helpers/actions";
import { gameEngine } from "./core";

export const botChooseActions = (
  state: GameState,
  botType: BotType
): UnitAction[] => {
  switch (botType) {
    case "easy-bot":
      return easyBotChooseActions(state);
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

    const randomActionIndex = Math.round(Math.random() * validActions.length);
    const currentAction = validActions[randomActionIndex];

    botActions.push(currentAction);

    currentState = gameEngine(currentState, currentAction);
  }

  return botActions;
};
