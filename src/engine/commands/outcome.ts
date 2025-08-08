// types
import type { GameOutcome } from "@/types/game";
import type { PlayerId } from "@/types/id";

export type Undo = () => void;

export function resignOutcomeCommand(
  outcome: GameOutcome,
  resigningPlayerId: PlayerId
): Undo {
  // apply
  const winnerId = 1 - resigningPlayerId;
  outcome = {
    status: "finished",
    winnerId: winnerId,
    reason: "resign",
  };

  // undo
  return () => {
    outcome = {
      status: "ongoing",
      winnerId: null,
      reason: null,
    };
  };
}

export function kingCaptureOutcomeCommand(
  outcome: GameOutcome,
  attackingPlayerId: PlayerId
): Undo {
  // apply
  outcome = {
    status: "finished",
    winnerId: attackingPlayerId,
    reason: "resign",
  };

  // undo
  return () => {
    outcome = {
      status: "ongoing",
      winnerId: null,
      reason: null,
    };
  };
}
