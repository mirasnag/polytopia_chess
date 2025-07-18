// types
import type { GameOutcome, Players } from "@/types/game";
import type { PlayerId } from "@/types/id";

export function resignOutcome(
  players: Players,
  resigningPlayerId: PlayerId
): GameOutcome {
  const winnerId = Object.keys(players).filter(
    (playerId) => playerId !== resigningPlayerId
  )[0] as PlayerId;

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
