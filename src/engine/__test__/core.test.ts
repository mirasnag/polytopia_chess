import * as core from "@/engine/core";
import type { GameState } from "@/types/game";
import type { GameAction } from "@/types/action";

// A tiny helper to build stub actions
function makeAction(type: string, payload = {}): GameAction {
  return { type: type as any, payload: payload as any };
}

// A minimal fake state for testing applyAction fall-through
const fakeState = { foo: "bar" } as unknown as GameState;

describe("gameEngine / core", () => {
  describe("applyAction()", () => {
    it("delegates to createReducer for 'create'", () => {
      const createCfg = { playerTypes: ["human", "human"] } as any;
      const action = makeAction("create", { config: createCfg });
      const newState = core.applyAction(fakeState, action);
      // createReducer always returns a fresh GameState with correct players length
      expect(Array.isArray(newState.players)).toBe(true);
      expect(newState.players.length).toBe(2);
      expect(newState.turn.counter).toBe(1);
    });

    it("falls through for unknown action", () => {
      const action = makeAction("unknown");
      expect(core.applyAction(fakeState, action)).toBe(fakeState);
    });
  });

  describe("applySequenceOfActions()", () => {
    it("returns initial state when passed empty array", () => {
      expect(core.applySequenceOfActions(fakeState, [])).toBe(fakeState);
    });

    it("applies each action in order", () => {
      // stub two simple actions that increment a fake counter in state
      let state = { count: 0 } as any;
      const inc = { type: "inc", payload: {} } as any;
      // monkey-patch applyAction to handle "inc"
      const originalApply = core.applyAction as any;
      (core.applyAction as any) = (s: any, a: any) =>
        a.type === "inc" ? { ...s, count: s.count + 1 } : s;

      state = core.applySequenceOfActions(state, [inc, inc, inc]);
      expect(state.count).toBe(3);

      // restore real
      (core.applyAction as any) = originalApply;
    });
  });

  describe("gameEngine()", () => {
    it("routes single action properly", () => {
      // stub out applyAction to track calls
      const spy = jest.spyOn(core, "applyAction").mockReturnValue(fakeState);
      const result = core.gameEngine(fakeState, makeAction("foo"));
      expect(spy).toHaveBeenCalledWith(fakeState, expect.any(Object));
      expect(result).toBe(fakeState);
      spy.mockRestore();
    });

    it("routes array of actions to applySequenceOfActions", () => {
      const seqSpy = jest
        .spyOn(core, "applySequenceOfActions")
        .mockReturnValue(fakeState);
      const result = core.gameEngine(fakeState, [
        makeAction("a"),
        makeAction("b"),
      ]);
      expect(seqSpy).toHaveBeenCalledWith(fakeState, expect.any(Array));
      expect(result).toBe(fakeState);
      seqSpy.mockRestore();
    });
  });
});
