import type { Tile } from "@/types/tile";
import type { Unit } from "@/types/game";
import UnitView from "@/components/unit/UnitView";
import classes from "./GameBoard.module.scss";

interface Props {
  tile: Tile;
  handleTileClick: (tile: Tile) => void;
  handleUnitClick: (unit: Unit) => void;
  isActive: boolean;
  occupant?: Unit;
}

const BoardTile: React.FC<Props> = ({
  tile,
  handleTileClick,
  handleUnitClick,
  isActive,
  occupant,
}) => {
  return (
    <div
      className={`${classes.tile} ${isActive && classes.active}`}
      onClick={() => handleTileClick(tile)}
    >
      {occupant && (
        <UnitView unit={occupant} handleUnitClick={handleUnitClick} />
      )}
    </div>
  );
};

export default BoardTile;
