import type { UnitActionKey } from "@/types/unit";
import type { UnitId } from "@/types/id";

type ActionPayloadMap = {
  move: {
    unitId: UnitId;
    to: {
      x: number;
      y: number;
    };
  };
  attack: {
    attackingUnitId: UnitId;
    defendingUnitId: UnitId;
  };
};

export type PayloadFor<K extends UnitActionKey> = ActionPayloadMap[K];
