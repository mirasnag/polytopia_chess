import type { UnitType } from "@/types/unit";
import warriorFullbodyModel from "@/assets/unit_models/fullbody/warrior.webp";
import archerFullbodyModel from "@/assets/unit_models/fullbody/archer.webp";
import riderFullbodyModel from "@/assets/unit_models/fullbody/rider.webp";
import catapultFullbodyModel from "@/assets/unit_models/fullbody/catapult.webp";
import knightFullbodyModel from "@/assets/unit_models/fullbody/knight.webp";
// import swordsmanFullbodyModel from "@/assets/unit_models/fullbody/swordsman.webp";
import mindBenderFullbodyModel from "@/assets/unit_models/fullbody/mindBender.webp";
// import defenderFullbodyModel from "@/assets/unit_models/fullbody/defender.webp";

interface UnitModels {
  fullbody: string;
}

const UNIT_MODELS: Record<UnitType, UnitModels> = {
  warrior: { fullbody: warriorFullbodyModel },
  archer: { fullbody: archerFullbodyModel },
  rider: { fullbody: riderFullbodyModel },
  catapult: { fullbody: catapultFullbodyModel },
  knight: { fullbody: knightFullbodyModel },
  mindBender: { fullbody: mindBenderFullbodyModel },
};

export const getUnitModels = () => UNIT_MODELS;

export const getUnitFullbodyModel = (unitType: UnitType) =>
  UNIT_MODELS[unitType].fullbody;
