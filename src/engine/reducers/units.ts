// libraries
import { Map as IMap } from "immutable";

// utils
import { createBrandedId } from "@/utils/common.util";
import { getUnitBaseStats } from "@/data/unitBaseStats";
import { calculateDamage } from "@/engine/helpers/combat";

// types
import type { UnitId } from "@/types/id";
import { UnitRecord, type Units } from "@/types/unit";

// data
import { unitCodeMap } from "@/data/defaultGameConfig";

export function createUnits(board: string[][]): Units {
  let units = IMap<UnitId, UnitRecord>();

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (board[y][x] === "__") continue;

      const unitId = createBrandedId("unit");
      const unitType = unitCodeMap[board[y][x][0]];
      const ownerId = parseInt(board[y][x][1]);

      const u = new UnitRecord({
        id: unitId,
        type: unitType,
        ownerId: ownerId,
        position: { x, y },
        stats: getUnitBaseStats(unitType),
      });

      units = units.set(unitId, u);
    }
  }

  return units;
}

export function moveUnit(
  units: Units,
  movingUnitId: UnitId,
  to: { x: number; y: number }
): Units {
  return units.update(movingUnitId, (u) => u?.move(to));
}

export function attackUnit(
  units: Units,
  attackingUnitId: UnitId,
  defendingUnitId: UnitId
): Units {
  const attackingUnit = units.get(attackingUnitId);
  const defendingUnit = units.get(defendingUnitId);

  if (!attackingUnit || !defendingUnit) {
    throw new Error("Unit not found");
  }

  const damage = calculateDamage(attackingUnit, defendingUnit);
  const isKilled = defendingUnit.stats.hp <= damage;

  if (isKilled) {
    if (attackingUnit.stats.range === 1) {
      units = units.set(
        attackingUnitId,
        attackingUnit.set("position", defendingUnit.position)
      );
    }
    units = units.delete(defendingUnitId);
  } else {
    const damagedDefender = defendingUnit.set("stats", {
      ...defendingUnit.stats,
      hp: defendingUnit.stats.hp - damage,
    });
    units = units.set(defendingUnitId, damagedDefender);
  }

  return units;
}
