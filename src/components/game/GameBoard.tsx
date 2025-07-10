import { useGame } from "@/context/game/GameContext";
import classes from "./GameBoard.module.scss";
import BoardTile from "./BoardTile";
import { useState } from "react";
import type { Tile } from "@/types/tile";
import type { Unit } from "@/types/game";

const GameBoard = () => {
  const { state, dispatch } = useGame();
  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  const { tiles } = state.map;
  const units = state.units;

  const handleTileClick = (tile: Tile) => {
    if (tile === activeTile) {
      setActiveTile(null);
      setActiveUnit(null);
      return;
    }

    if (!activeUnit) {
      setActiveTile(tile);
      return;
    }

    if (!tile.occupantId) {
      dispatch({
        type: "Move",
        payload: { unitId: activeUnit.id, to: { x: tile.x, y: tile.y } },
      });
      setActiveTile(null);
      setActiveUnit(null);
      return;
    }

    dispatch({
      type: "Attack",
      payload: {
        attackingUnitId: activeUnit.id,
        defendingUnitId: tile.occupantId,
      },
    });
    setActiveTile(null);
    setActiveUnit(null);
  };

  const handleUnitClick = (unit: Unit) => {
    setActiveUnit(unit);
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
              handleTileClick={handleTileClick}
              handleUnitClick={handleUnitClick}
              occupant={tile.occupantId && units[tile.occupantId]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
