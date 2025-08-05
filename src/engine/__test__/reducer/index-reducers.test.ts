// helpers and utils
import {
  createReducer,
  moveReducer,
  attackReducer,
  resignReducer,
  advanceReducer,
} from "@/engine/reducers/index";

// types
import type { GameState } from "@/types/game";
import type { UnitActionPayload } from "@/types/action";
import type { GameConfig } from "@/types/gameConfig";
import { UnitRecord } from "@/types/unit";

// data
import { getUnitBaseStats } from "@/data/unitBaseStats";

const smallGameConfig: GameConfig = {
  playerTypes: ["human", "human"],
  map: {
    width: 3,
    height: 3,
    boardLayout: [
      ["__", "__", "__"],
      ["w0", "a1", "__"],
      ["__", "__", "__"],
    ],
  },
};

describe("engine/index reducers", () => {
  let baseState: GameState;
  let firstUnit: UnitRecord;
  let secondUnit: UnitRecord;

  beforeEach(() => {
    baseState = createReducer(smallGameConfig);
    firstUnit = baseState.units.find((unit) => unit.ownerId === 0)!;
    secondUnit = baseState.units.find((unit) => unit.ownerId === 1)!;
  });

  it("createReducer produces valid initial state", () => {
    expect(baseState.players).toHaveLength(smallGameConfig.playerTypes.length);

    expect(baseState.units.size).toEqual(2);
    expect(firstUnit.type).toBe("warrior");
    expect(firstUnit.position).toEqual({ x: 0, y: 1 });
    expect(secondUnit.type).toBe("archer");
    expect(secondUnit.position).toEqual({ x: 1, y: 1 });

    expect(baseState.map.width).toBe(smallGameConfig.map.width);
    expect(baseState.map.height).toBe(smallGameConfig.map.height);

    expect(baseState.turn.counter).toBe(1);
    expect(baseState.outcome.status).toBe("ongoing");
  });

  it("moveReducer moves a unit and updates state", () => {
    const { id: firstUnitId, position: oldPos } = firstUnit;
    const newPos = { x: oldPos.x + 1, y: oldPos.y };

    const payload: UnitActionPayload = { unitId: firstUnitId, to: newPos };
    const next = moveReducer(baseState, payload);

    const moved = next.units.get(firstUnitId)!;
    expect(moved.position).toEqual(newPos);

    // original state untouched
    expect(baseState.units.get(firstUnitId)!.position).toEqual(oldPos);

    // occupancy updated
    expect(next.map.occupancy.get(`${newPos.y},${newPos.x}`)).toBe(firstUnitId);
    expect(next.turn.actions).toContainEqual({ type: "move", payload });
  });

  it("attackReducer handles non-lethal and lethal melee attacks correctly", () => {
    const {
      id: attackerId,
      position: { x: ax, y: ay },
    } = firstUnit;
    const {
      id: defenderId,
      position: { x: dx, y: dy },
    } = secondUnit;

    // 1) Non-lethal ranged attack (range > 1)
    const highHP = getUnitBaseStats(secondUnit.type).hp + 10;
    // create a state where defender has high HP
    let state1: GameState = {
      ...baseState,
      units: baseState.units.set(
        defenderId,
        secondUnit.set("stats", {
          ...secondUnit.stats,
          hp: highHP,
        })
      ),
    };

    const payload1: UnitActionPayload = {
      unitId: attackerId,
      to: { x: dx, y: dy },
    };
    const next1 = attackReducer(state1, payload1);

    // Defender should still exist but with lower HP
    const defAfter1 = next1.units.get(defenderId)!;
    expect(defAfter1.stats.hp).toBeLessThan(highHP);
    // Attacker did not slide
    expect(next1.units.get(attackerId)!.position).toEqual({ x: ax, y: ay });
    // Occupancy at defender remains
    expect(next1.map.occupancy.get(`${dy},${dx}`)).toBe(defenderId);
    // turn.actions recorded an "attack"
    expect(next1.turn.actions).toContainEqual({
      type: "attack",
      payload: payload1,
    });

    // 2) Lethal melee attack (range == 1, defender HP == 1)
    let state2: GameState = {
      ...baseState,
      units: baseState.units
        .set(
          defenderId,
          secondUnit.set("stats", {
            ...secondUnit.stats,
            hp: 1,
          })
        )
        .set(
          attackerId,
          firstUnit.set("stats", {
            ...firstUnit.stats,
            range: 1, // melee range
          })
        ),
    };

    const payload2: UnitActionPayload = {
      unitId: attackerId,
      to: { x: dx, y: dy },
    };
    const next2 = attackReducer(state2, payload2);

    // Defender is removed
    expect(next2.units.has(defenderId)).toBe(false);
    // Attacker slid into defender’s square
    expect(next2.units.get(attackerId)!.position).toEqual({ x: dx, y: dy });
    // Occupancy now holds the attacker at that tile
    expect(next2.map.occupancy.get(`${dy},${dx}`)).toBe(attackerId);
    // turn.actions recorded a "kill"
    expect(next2.turn.actions).toContainEqual({
      type: "kill",
      payload: payload2,
    });
  });

  it("resignReducer sets outcome to finished with correct winner", () => {
    const next = resignReducer(baseState);
    expect(next.outcome.status).toBe("finished");
    expect(next.outcome.reason).toBe("resign");
    // winnerId is the other player
    expect(next.outcome.winnerId).not.toBe(baseState.turn.currentPlayerId);
  });

  it("rotates currentPlayerId on first advance without incrementing counter, then rotates back and increments counter on second", () => {
    const initialCounter = baseState.turn.counter;
    const [p0, p1] = baseState.players.map((p) => p.id);

    // 1st advance: switch to player 1, counter unchanged
    const s1 = advanceReducer(baseState);
    expect(s1.turn.currentPlayerId).toBe(p1);
    expect(s1.turn.counter).toBe(initialCounter);
    expect(s1.zKey).not.toBe(baseState.zKey);

    // 2nd advance: back to player 0, counter +1
    const s2 = advanceReducer(s1);
    expect(s2.turn.currentPlayerId).toBe(p0);
    expect(s2.turn.counter).toBe(initialCounter + 1);
    expect(s2.zKey).not.toBe(s1.zKey);
  });
});
