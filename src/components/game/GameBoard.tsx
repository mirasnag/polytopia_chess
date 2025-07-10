// hooks
import { useState } from "react";
import { useGame } from "@/context/game/GameContext";

// components
import BoardTile from "./BoardTile";

// utils
import { getValidMoves } from "@/utils/movement";
import { getValidAttacks } from "@/utils/combat";

// types
import type { Tile } from "@/types/tile";

// styles
import classes from "./GameBoard.module.scss";

const GameBoard = () => {
  const { state, dispatch } = useGame();
  const { tiles } = state.map;
  const units = state.units;
  const currentPlayerId = state.turn.playerOrder[state.turn.orderIndex];

  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  const activeUnitId = activeTile?.occupantId;
  const activeUnit =
    activeUnitId && units[activeUnitId].ownerId === currentPlayerId
      ? units[activeUnitId]
      : null;

  let validMoves = new Set<Tile>();
  let validAttacks = new Set<Tile>();

  if (activeUnit) {
    validMoves = getValidMoves(state, activeUnit);
    validAttacks = getValidAttacks(state, activeUnit);
  }

  const handleTileClick = (tile: Tile) => {
    if (!activeUnit) {
      setActiveTile(tile);
      return;
    }

    if (tile == activeTile) {
      setActiveTile(null);
      return;
    }

    if (validMoves.has(tile)) {
      if (tile.occupantId)
        throw new Error("Cannot move unit - tile is occupied!");

      dispatch({
        type: "Move",
        payload: { unitId: activeUnit.id, to: { x: tile.x, y: tile.y } },
      });
      setActiveTile(null);
      return;
    }

    if (validAttacks.has(tile)) {
      if (!tile.occupantId)
        throw new Error("Cannot attack unit - tile is not occupied!");

      dispatch({
        type: "Attack",
        payload: {
          attackingUnitId: activeUnit.id,
          defendingUnitId: tile.occupantId,
        },
      });
      setActiveTile(null);
      return;
    }

    setActiveTile(tile);
  };

  return (
    <div className={classes.board}>
      {tiles.map((rowTiles, rowIndex) => (
        <div key={rowIndex} className={classes.row}>
          {rowTiles.map((tile, colIndex) => (
            <BoardTile
              key={colIndex}
              tile={tile}
              isActive={activeTile === tile}
              isValidAttack={validAttacks.has(tile)}
              isValidMove={validMoves.has(tile)}
              handleTileClick={handleTileClick}
              occupant={tile.occupantId && units[tile.occupantId]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
