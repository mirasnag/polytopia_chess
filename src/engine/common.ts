// types
import type { UnitType, Unit } from "@/types/unit";

export const schemaVersion = {
  major: 1,
  minor: 0,
};

const KING_TYPE: UnitType = "mindBender";

export const isKing = (unit: Unit) => unit.type === KING_TYPE;
