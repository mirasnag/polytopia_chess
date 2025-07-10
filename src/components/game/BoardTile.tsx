// components
import UnitView from "@/components/unit/UnitView";

// types
import type { Tile } from "@/types/tile";
import type { Unit } from "@/types/game";

// styles
import classes from "./GameBoard.module.scss";

interface Props {
  tile: Tile;
  handleTileClick: (tile: Tile) => void;
  isActive: boolean;
  isValidMove: boolean;
  isValidAttack: boolean;
  occupant?: Unit;
}

const BoardTile: React.FC<Props> = ({
  tile,
  handleTileClick,
  isActive,
  isValidAttack,
  isValidMove,
  occupant,
}) => {
  const tileClassName = `${classes.tile} ${isActive ? classes.active : ""} ${
    isValidAttack ? classes.validAttack : ""
  } ${isValidMove ? classes.validMove : ""}`;

  return (
    <div className={tileClassName} onClick={() => handleTileClick(tile)}>
      {occupant && <UnitView unit={occupant} />}
    </div>
  );
};

export default BoardTile;
