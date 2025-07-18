import type { UnitAction } from "@/types/action";
import type { BotType, GameState } from "@/types/game";
import { getAllValidUnitActions } from "./action.util";

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
  const validActions = getAllValidUnitActions(state);
  const randomActionIndex = Math.round(Math.random() * validActions.length);

  return [validActions[randomActionIndex]];
};
