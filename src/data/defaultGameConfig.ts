import type { GameConfig } from "@/types/gameConfig";
import type { UnitType } from "@/types/unit";

export const unitCodeMap: Record<string, UnitType> = {
  c: "catapult",
  r: "rider",
  a: "archer",
  k: "knight",
  m: "mindBender",
  w: "warrior",
};

export const defaultBoardLayout = [
  ["c0", "r0", "a0", "k0", "m0", "a0", "r0", "c0"],
  ["w0", "w0", "w0", "w0", "w0", "w0", "w0", "w0"],
  ["__", "__", "__", "__", "__", "__", "__", "__"],
  ["__", "__", "__", "__", "__", "__", "__", "__"],
  ["__", "__", "__", "__", "__", "__", "__", "__"],
  ["__", "__", "__", "__", "__", "__", "__", "__"],
  ["w1", "w1", "w1", "w1", "w1", "w1", "w1", "w1"],
  ["c1", "r1", "a1", "k1", "m1", "a1", "r1", "c1"],
];

export const defaultGameConfig: GameConfig = {
  playerTypes: ["human", "easy-bot"],
  map: { width: 8, height: 8, boardLayout: defaultBoardLayout },
};
