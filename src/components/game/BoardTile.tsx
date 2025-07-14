// hooks
import { useGame } from "@/context/game/GameContext";

// components
import UnitTileView from "@/components/unit/UnitTileView";
import TileCircle from "./TileCircle";

// types
import type { Tile } from "@/types/tile";

// styles
import classes from "./BoardTile.module.scss";

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
  }`;

  return (
    <div className={tileClassName} onClick={() => handleTileClick(tile)}>
      {tileUnit && (
        <UnitTileView
          unit={tileUnit}
          isReady={currentPlayer.id === tileUnit.ownerId}
        />
      )}
      {isValidMove && <TileCircle type="move" />}
    </div>
  );
};

export default BoardTile;
