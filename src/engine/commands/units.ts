// libraries
import { Map as IMap } from "immutable";

// utils
import { createBrandedId } from "@/utils/common.util";
import { getUnitBaseStats } from "@/data/unitBaseStats";
import { calculateDamage } from "@/engine/helpers/combat";

// types
import type { UnitId } from "@/types/id";
import type { UnitRecord, Units } from "@/types/unit";

// data
import { unitCodeMap } from "@/data/defaultGameConfig";
import type { GameState } from "@/types/game";

export type Undo = () => void;

export function createUnits(board: string[][]): Units {
  let units = IMap<UnitId, UnitRecord>();

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      const code = board[y][x];
      if (code === "__") continue;

      const unitId = createBrandedId("unit");
      const unitType = unitCodeMap[code[0]];
      const ownerId = parseInt(code[1], 10);

      const u: UnitRecord = {
        id: unitId,
        type: unitType,
        ownerId,
        position: { x, y },
        stats: getUnitBaseStats(unitType),
      } as unknown as UnitRecord;

      units = units.set(unitId, u);
    }
  }

  return units;
}

export function moveUnitCommand(
  state: GameState,
  unitId: UnitId,
  newPos: { x: number; y: number }
): Undo {
  const prevPos = state.units.getIn([unitId, "position"]) as {
    x: number;
    y: number;
  };
  state.units = state.units.update(unitId, (u) => u?.move(newPos));

  return () => {
    state.units = state.units.update(unitId, (u) => u?.move(prevPos));
  };
}

export function attackUnitCommand(
  units: Units,
  attackerId: UnitId,
  defenderId: UnitId
): Undo {
  const attacker = units.get(attackerId)!;
  const defender = units.get(defenderId)!;

  // capture prev state
  const prevDefHp = defender.stats.hp;
  const prevDefPos = { x: defender.position.x, y: defender.position.y };

  // apply attack
  const damage = calculateDamage(attacker, defender);

  if (damage >= defender.stats.hp) {
    // killed
    if (attacker.stats.range === 1) {
      // melee: move attacker into defender’s tile
      const prevAtkPos = { x: attacker.position.x, y: attacker.position.y };

      units = units
        .delete(defenderId)
        .setIn([attackerId, "position"], prevDefPos);

      return () => {
        // undo: restore defender, then attacker move
        units = units
          .set(defenderId, defender)
          .setIn([attackerId, "position"], prevAtkPos);
      };
    } else {
      // ranged kill: just remove defender
      units.delete(defenderId);

      return () => {
        units = units.set(defenderId, defender);
      };
    }
  } else {
    // defender survives: apply damage
    units.setIn([defenderId, "stats", "hp"], prevDefHp - damage);

    return () => {
      units.setIn([defenderId, "stats", "hp"], prevDefHp);
    };
  }
}
