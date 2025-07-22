import type { TurnActions } from "@/types/action";
import type { BotType, GameState } from "@/types/game";
import { randomBotAlgo } from "./randomAlgo";
import { greedyBotAlgo } from "./greedyAlgo";
import { minimaxBotAlgo } from "./minimaxAlgo";

export const botChooseActions = (
  state: GameState,
  botType: BotType
): TurnActions => {
  switch (botType) {
    case "easy-bot":
      return randomBotAlgo(state);
    case "normal-bot":
      return greedyBotAlgo(state);
    case "hard-bot":
      return minimaxBotAlgo(state, 1);
    case "crazy-bot":
      return minimaxBotAlgo(state, 2);
    default:
      throw new Error("Unhandled or invalid bot type:", botType);
  }
};
