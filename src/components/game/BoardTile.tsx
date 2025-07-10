// hooks
import { useGame } from "@/context/game/GameContext";

// components
import UnitView from "@/components/unit/UnitView";

// types
import type { Tile } from "@/types/tile";

// styles
import classes from "./GameBoard.module.scss";

interface TileState {
  isActive: boolean;
  isValidMove: boolean;
  isValidAttack: boolean;
}

interface Props {
  tile: Tile;
  handleTileClick: (tile: Tile) => void;
  tileState: TileState;
}

const BoardTile: React.FC<Props> = ({ tile, handleTileClick, tileState }) => {
  const { isActive, isValidAttack, isValidMove } = tileState;
  const { currentPlayer, units } = useGame();
  const tileUnit = tile.occupantId ? units[tile.occupantId] : null;

  const tileClassName = `${classes.tile} ${isActive ? classes.active : ""} ${
    isValidAttack ? classes.validAttack : ""
  } ${isValidMove ? classes.validMove : ""} ${
    currentPlayer.id === tileUnit?.ownerId ? classes.hasReadyUnit : ""
  }`;

  return (
    <div className={tileClassName} onClick={() => handleTileClick(tile)}>
      {tileUnit && <UnitView unit={tileUnit} />}
    </div>
  );
};

export default BoardTile;
