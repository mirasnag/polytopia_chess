import type { UnitAction } from "@/types/action";
import type { BotType, GameState } from "@/types/game";
import { easyBotChooseActions } from "./easy";
import { normalBotChooseActions } from "./normal";

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
