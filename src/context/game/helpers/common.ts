// types
import type { Unit } from "@/types/game";
import type { UnitType } from "@/types/unit";

export const schemaVersion = {
  major: 1,
  minor: 0,
};

const KING_TYPE: UnitType = "mindBender";

export const isKing = (unit: Unit) => unit.type === KING_TYPE;
