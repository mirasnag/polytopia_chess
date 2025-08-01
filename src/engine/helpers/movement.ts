// data
import { getUnitTraits } from "@/data/unitBaseStats";

// types
import type { GameState, Turn } from "@/types/game";
import type { MapGrid, Tile, TileKey } from "@/types/tile";
import type { Unit, Units } from "@/types/unit";

export function canMove(unit: Unit, turn: Turn): boolean {
  const { actions, actingUnitId } = turn;

  if (actingUnitId && actingUnitId !== unit.id) return false;

  // by default, unit cannot move after if it acted
  const hasActed = actions.length > 0;

  const actionKeys = actions.map((action) => action.type);

  // unit can escape if the last action is not move (attack or kill)
  const canEscape =
    actionKeys[actionKeys.length - 1] !== "move" &&
    getUnitTraits(unit.type).includes("escape");

  return !hasActed || canEscape;
}

export function getValidMoves(state: GameState, unit: Unit): Set<Tile> {
  if (state.outcome.status === "finished" || !canMove(unit, state.turn))
    return new Set<Tile>();
  return bfs(state.map, state.units, unit);
}

const DIRS: [number, number][] = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

export function bfs(grid: MapGrid, units: Units, unit: Unit): Set<Tile> {
  const movement = unit.stats.movement;
  if (movement === 1) return bfsShort(grid, unit);

  const { x: sx, y: sy } = unit.position;
  const { width, height, occupancy } = grid;

  const queue: { x: number; y: number; dist: number }[] = [
    { x: sx, y: sy, dist: 0 },
  ];
  const visited = new Set<TileKey>([`${sy},${sx}`]);

  const forbidden = new Set<string>();
  for (const other of units.values()) {
    if (other.ownerId === unit.ownerId) continue;
    const { x: ex, y: ey } = other.position;

    for (const [dx, dy] of DIRS) {
      const fx = ex + dx,
        fy = ey + dy;
      if (fx >= 0 && fx < width && fy >= 0 && fy < height) {
        forbidden.add(`${fy},${fx}`);
      }
    }
    forbidden.add(`${ey},${ex}`);
  }

  const valid = new Set<Tile>();

  const enqueue = (x: number, y: number, dist: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const key = `${y},${x}` as TileKey;
    if (visited.has(key)) return;
    visited.add(key);

    if (!occupancy.has(key)) valid.add({ x, y });
    if (!forbidden.has(key)) queue.push({ x, y, dist });
  };

  while (queue.length) {
    const { x, y, dist } = queue.shift()!;

    if (dist === movement) continue;

    for (const [dx, dy] of DIRS) {
      enqueue(x + dx, y + dy, dist + 1);
    }
  }

  return valid;
}

export function bfsShort(grid: MapGrid, unit: Unit): Set<Tile> {
  const valid = new Set<Tile>();
  const { x: sx, y: sy } = unit.position;
  const { width, height, occupancy } = grid;

  for (const [dx, dy] of DIRS) {
    const x = sx + dx;
    const y = sy + dy;
    if (x < 0 || x >= width || y < 0 || y >= height) continue;

    const key = `${y},${x}` as TileKey;
    if (!occupancy.has(key)) valid.add({ x, y });
  }

  return valid;
}

export function getValidMovesMask(
  state: GameState,
  unit: Unit | null
): boolean[][] {
  const { width, height } = state.map;
  const mask = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  if (!unit) return mask;

  const validMoves = getValidMoves(state, unit);

  validMoves.forEach((move) => {
    mask[move.y][move.x] = true;
  });

  return mask;
}
