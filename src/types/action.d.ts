export type MoveActionKey = "move";
export type AttackActionKey = "attack";
export type UnitActionKey = MoveActionKey | AttackActionKey;

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

export type ActionPayloadFor<K extends UnitActionKey> = ActionPayloadMap[K];

export type UnitAction = {
  [K in UnitActionKey]: {
    type: K;
    payload: ActionPayloadFor<K>;
  };
}[UnitActionKey];

export type GameAction =
  | { type: "Create" }
  | { type: "Resign" }
  | { type: "Advance" }
  | UnitAction;
