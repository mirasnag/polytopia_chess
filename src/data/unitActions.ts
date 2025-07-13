import type { UnitActionKey, UnitAction } from "@/types/unit";

export const UNIT_ACTIONS: Record<UnitActionKey, UnitAction> = {
  move: {
    description: "Move unit",
    type: "basic",
    cost: 1,
  },
  attack: {
    description: "Attack enemy unit",
    type: "basic",
    cost: 1,
  },
  dash: { description: "Attack after moving", type: "passive", cost: 0 },
  escape: {
    description: "Move again after attacking",
    type: "passive",
    cost: 0,
  },
  persistant: {
    description: "Attack again on kill",
    type: "passive",
    cost: 0,
  },
  charge: {
    description: "Gain +1 movement this turn",
    type: "active",
    cost: 1,
  },
  heal: {
    description: "Heal adjacent allies up to 5 HP",
    type: "active",
    cost: 1,
  },
  multiAttack: {
    description: "Strike all enemies in range",
    type: "active",
    cost: 2,
  },
  longShot: {
    description: "Increase +1 attack range this turn",
    type: "active",
    cost: 2,
  },
};
