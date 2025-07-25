// hooks
import { useMemo } from "react";
import { useGame } from "@/context/game/GameContext";

// components
import BoardTile from "./BoardTile";

// utils
import { getValidAttacksMask } from "@/engine/helpers/combat";
import { getValidMovesMask } from "@/engine/helpers/movement";

// types
import type { Tile } from "@/types/tile";

// styles
import classes from "./GameBoard.module.scss";

interface Props {
  activeTile: Tile | null;
  setActiveTile: (newActiveTile: Tile | null) => void;
}

const GameBoard: React.FC<Props> = ({ activeTile, setActiveTile }) => {
  const { state, currentPlayer, tiles, units, dispatch } = useGame();

  const isBot = currentPlayer.type !== "human";
  const activeUnitId = activeTile?.occupantId;

  const activeUnit = useMemo(() => {
    if (!activeUnitId) return null;
    const unit = units.get(activeUnitId);
    return unit?.ownerId === currentPlayer.id ? unit : null;
  }, [activeTile, units, currentPlayer]);

  const moveMask = useMemo(
    () => getValidMovesMask(state, activeUnit),
    [activeUnit, state]
  );

  const attackMask = useMemo(
    () => getValidAttacksMask(state, activeUnit),
    [activeUnit, state]
  );

  const handleTileClick = (tile: Tile) => {
    if (isBot) return;

    if (!activeUnit) {
      setActiveTile(tile);
      return;
    }

    if (tile == activeTile) {
      setActiveTile(null);
      return;
    }

    if (moveMask[tile.y][tile.x]) {
      if (tile.occupantId)
        throw new Error("Cannot move unit - tile is occupied!");

      dispatch({
        type: "move",
        payload: { unitId: activeUnit.id, to: { x: tile.x, y: tile.y } },
      });
      setActiveTile(null);
      return;
    }

    if (attackMask[tile.y][tile.x]) {
      if (!tile.occupantId)
        throw new Error("Cannot attack unit - tile is not occupied!");

      dispatch({
        type: "attack",
        payload: {
          unitId: activeUnit.id,
          to: tile,
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
              tileState={{
                isActive: activeTile === tile,
                isValidMove: moveMask[tile.y][tile.x] ?? false,
                isValidAttack: attackMask[tile.y][tile.x] ?? false,
              }}
              handleTileClick={handleTileClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
