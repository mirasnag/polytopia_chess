import type { GameConfig } from "./gameConfig";

export type PlayerActionKey = "create" | "resign" | "advance";

export type MoveActionKey = "move";
export type AttackActionKey = "attack";
export type UnitActionKey = MoveActionKey | AttackActionKey;

export type ActionKey = PlayerActionKey | UnitActionKey;

type ActionPayloadMap = {
  create: {
    config?: GameConfig;
  };
  resign: {};
  advance: {};
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

export type ActionPayloadFor<K extends ActionKey> = ActionPayloadMap[K];

export type PlayerAction = {
  [K in PlayerActionKey]: {
    type: K;
    payload: ActionPayloadFor<K>;
  };
}[PlayerActionKey];

export type UnitAction = {
  [K in UnitActionKey]: {
    type: K;
    payload: ActionPayloadFor<K>;
  };
}[UnitActionKey];

export type GameAction = PlayerAction | UnitAction;

export type TurnActions = UnitAction[];
