// types
import type { GameOutcome, Players } from "@/types/game";
import type { PlayerId } from "@/types/id";

export function resignOutcome(
  _: Players,
  resigningPlayerId: PlayerId
): GameOutcome {
  const winnerId = 1 - resigningPlayerId;

  return {
    status: "finished",
    winnerId,
    reason: "resign",
  };
}

export function kingCaptureOutcome(attackingPlayerId: PlayerId): GameOutcome {
  return {
    status: "finished",
    winnerId: attackingPlayerId,
    reason: "kingCaptured",
  };
}
