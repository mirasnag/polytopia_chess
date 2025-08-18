import * as ALGO from "@/engine/bots/minimaxAlgo";
import * as EVAL from "@/engine/helpers/evaluation";
import { createReducer } from "@/engine/reducers";
import type { GameState } from "@/types/game";

function makeMateState(): GameState {
  return createReducer({
    map: {
      width: 2,
      height: 2,
      boardLayout: [
        ["k0", "__"],
        ["m1", "__"],
      ],
    },
  });
}

describe("minimax algorithm", () => {
  const state = createReducer({});
  const mateState = makeMateState();

  describe("iterative deepening", () => {
    it("should fallback to wide search for zero depth", () => {
      const spy = jest.spyOn(ALGO, "minimax").mockImplementationOnce(() => {
        return { score: 0, actions: [] };
      });

      ALGO.minimaxIterativeDeepening(state, 0);
      expect(spy).toHaveBeenCalledWith(state, 0, state.turn.currentPlayerId);
    });

    it("should stop after detecting early mate", () => {
      const spy = jest.spyOn(EVAL, "isMateScore");
      ALGO.minimaxIterativeDeepening(mateState, 4);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
