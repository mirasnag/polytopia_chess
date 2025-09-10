import type { UnitTrait, UnitTraitKey } from "@/types/unit";

export const UNIT_TRAITS: Record<UnitTraitKey, UnitTrait> = {
  dash: { description: "Attack after moving" },
  escape: { description: "Move again after attacking" },
  persist: { description: "Attack again on kill" },
  stiff: { description: "Do not retaliate if attacked" },
};
