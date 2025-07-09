// types
import type { GameState, Units } from "@/types/game";
import type { PlayerId } from "@/types/id";
import type { MapGrid, Tile } from "@/types/tile";
import type { UnitType } from "@/types/unit";

// utils
import { getUnitHP } from "@/data/unitStats";
import { createBrandedId } from "@/common/utils";

const schemaVersion = {
  major: 1,
  minor: 0,
};

const edgeRowUnits: UnitType[] = [
  "catapult",
  "rider",
  "archer",
  "swordsman",
  "knight",
  "archer",
  "rider",
  "catapult",
];

const warriorRowUnits: UnitType[] = [
  "warrior",
  "warrior",
  "warrior",
  "warrior",
  "warrior",
  "warrior",
  "warrior",
  "warrior",
];

function placeRowUnits(
  units: Units,
  owner: PlayerId,
  unitTypes: UnitType[],
  row: number
) {
  for (let col = 0; col < unitTypes.length; col++) {
    const unitId = createBrandedId("unit");
    const unitType = unitTypes[col];

    units[unitId] = {
      id: unitId,
      type: unitType,
      ownerId: owner,
      position: { x: col, y: row },
      hp: getUnitHP(unitType),
    };
  }
}

function createUnits(playerA: PlayerId, playerB: PlayerId): Units {
  const units: Units = {};

  placeRowUnits(units, playerA, edgeRowUnits, 0);
  placeRowUnits(units, playerA, warriorRowUnits, 1);

  placeRowUnits(units, playerB, edgeRowUnits, 7);
  placeRowUnits(units, playerB, warriorRowUnits, 6);

  return units;
}

function createMap(width: number = 8, height: number = 8): MapGrid {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ x, y });
    }
    tiles.push(row);
  }
  return { width, height, tiles };
}

function applyUnitsToMap(map: MapGrid, units: Units): MapGrid {
  const tiles = map.tiles.map(
    (row) => row.map((tile) => ({ ...tile })) // shallow‑copy every tile
  );
  Object.values(units).forEach((u) => {
    tiles[u.position.y][u.position.x].occupantId = u.id;
  });
  return { ...map, tiles };
}

export function createInitialGameState(): GameState {
  const playerA = createBrandedId("player");
  const playerB = createBrandedId("player");

  const units = createUnits(playerA, playerB);
  const map = applyUnitsToMap(createMap(), units);

  return {
    schemaVersion: schemaVersion,
    turn: {
      moveNumber: 0,
      currentPlayer: playerA,
      actionUsed: false,
    },
    units: units,
    map: map,
    isFinished: false,
  };
}
