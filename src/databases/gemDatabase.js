
/**
 * @typedef {import("../types.js").Gem} Gem
 * @typedef {import("../types.js").StatData} StatData
 */

import { GemColor } from "../types.js";

/** @type {{ [x: number | string]: Gem }} */
export const gemDatabase = {
  23094: {
    stats: {
      HEALING: 13,
    },
    color: GemColor.red,
  },
  23096: {
    stats: {
      DAMAGE: 7,
    },
    color: GemColor.red,
  },
  24029: {
    stats: {
      HEALING: 18,
    },
    color: GemColor.red,
  },
  24030: {
    stats: {
      DAMAGE: 9,
    },
    color: GemColor.red,
  },
  25893: {
    stats: {},
    color: GemColor.meta,
    auras: [
      {
        type: "ProcTriggerSpellAura",
        value: 100,
        auraProcChance: 15,
        spellName: "Spell Focus Trigger",
        maximumStacks: 1,
      },
    ],
  },
  25897: {
    stats: {
      HEALING: 26,
    },
    color: GemColor.meta,
  },
  28118: {
    stats: {
      DAMAGE: 12,
    },
    color: GemColor.red,
  },
  28460: {
    stats: {
      HEALING: 9,
    },
    color: GemColor.red,
  },
  28461: {
    stats: {
      DAMAGE: 5,
    },
    color: GemColor.red,
  },
  30593: {
    stats: {
      HEALING: 11,
      CRIT_SPELL_RATING: 4,
    },
    color: GemColor.red | GemColor.yellow,
  },
  30603: {
    stats: {
      HEALING: 11,
      MP5: 2,
    },
    color: GemColor.red | GemColor.yellow,
  },
  32196: {
    stats: {
      DAMAGE: 12,
    },
    color: GemColor.red,
  },
  32215: {
    stats: {
      DAMAGE: 6,
      STAMINA: 7,
    },
    color: GemColor.red | GemColor.blue,
  },
  32216: {
    stats: {
      HEALING: 11,
      MP5: 2,
    },
    color: GemColor.red | GemColor.blue,
  },
  35489: {
    stats: {
      HEALING: 22,
    },
    color: GemColor.red,
  },
};
