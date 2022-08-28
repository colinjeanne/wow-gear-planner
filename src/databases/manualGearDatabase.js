import { GemColor } from "../types.js";

/** @typedef {import("../types.js").ItemData} ItemData */
/** @type {{ [x: string]: Partial<ItemData> }} */
export const database = {
  21869: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HIT_SPELL_RATING: 3,
      },
    },
  },
  21870: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HIT_SPELL_RATING: 3,
      },
    },
  },
  21871: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HIT_SPELL_RATING: 3,
      },
    },
  },
  24250: {
    gems: {
      sockets: [
        GemColor.yellow,
      ],
      bonus: {
        CRIT_SPELL_RATING: 2,
      },
    },
  },
  24262: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
        GemColor.red,
      ],
      bonus: {
        STAMINA: 6,
      },
    },
  },
  24264: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
        GemColor.red,
      ],
      bonus: {
        INTELLECT: 4,
      },
    },
  },
  24266: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
        GemColor.red,
      ],
      bonus: {
        STAMINA: 6,
      },
    },
  },
  "24692_9": {
    stats: {
      ARMOR: 65,
      SHADOW_DAMAGE: 45,
    },
  },
  "25295_9": {
    stats: {
      SHADOW_DAMAGE: 25,
    },
  },
  27886: {
    "auras": [
      {
        type: "ModifySpellEffectValueAura",
        effectIndex: 0,
        value: 45,
        affectedSpells: [
          "Lifebloom"
        ],
        maximumStacks: 1,
      },
    ],
  },
  28507: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HIT_SPELL_RATING: 3,
      },
    },
  },
  28521: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
      ],
      bonus: {
        SPIRIT: 3,
      },
    },
  },
  28591: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        SPIRIT: 4,
      },
    },
  },
  28752: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  28780: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
  },
  28799: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
  },
  29086: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.meta,
      ],
      bonus: {
        INTELLECT: 4,
      },
    },
  },
  29087: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 9,
      },
    },
  },
  29302: {
    exclusiveWith: [
      29302,
      29303,
      29304,
      29305,
    ],
  },
  29303: {
    exclusiveWith: [
      29302,
      29303,
      29304,
      29305,
    ],
  },
  29304: {
    exclusiveWith: [
      29302,
      29303,
      29304,
      29305,
    ],
  },
  29305: {
    auras: [
      {
        type: "ProcTriggerSpellAura",
        value: 100,
        auraProcChance: 10,
        spellName: "Band of the Eternal Sage",
        affectedSpells: [
          "Mind Blast",
          "Mindflay",
          "Shadow Word: Death",
          "Shadow Word: Pain",
          "Starshards",
          "Vampiric Touch",
        ],
        maximumStacks: 1,
      },
    ],
    exclusiveWith: [
      29302,
      29303,
      29304,
      29305,
    ],
  },
  29306: {
    exclusiveWith: [
      29307,
      29306,
      29308,
      29309,
    ],
  },
  29307: {
    exclusiveWith: [
      29307,
      29306,
      29308,
      29309,
    ],
  },
  29308: {
    exclusiveWith: [
      29307,
      29306,
      29308,
      29309,
    ],
  },
  29309: {
    auras: [
      {
        type: "ProcTriggerSpellAura",
        value: 100,
        auraProcChance: 10,
        spellName: "Band of the Eternal Restorer",
        affectedSpells: [
          "Heal (Crystal Spire of Karabor)",
          "Healing Touch",
          "Lifebloom",
          "Mind Blast",
          "Mindflay",
          "Regrowth",
          "Rejuvenation",
          "Shadow Word: Death",
          "Shadow Word: Pain",
          "Starshards",
          "Swiftmend",
          "Vampiric Touch",
        ],
        maximumStacks: 1,
      },
    ],
    exclusiveWith: [
      29307,
      29306,
      29308,
      29309,
    ],
  },
  29370: {
    onUse: "Blessing of the Silver Crescent",
  },
  29376: {
    onUse: "Essence of the Martyr",
  },
  29972: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  29986: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  30036: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  30038: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
  },
  30092: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        SPIRIT: 3,
      },
    },
  },
  30100: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  30107: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  30161: {
    gems: {
      sockets: [
        GemColor.meta,
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  30216: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 9,
      },
    },
  },
  30219: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.meta,
      ],
      bonus: {
        MP5: 2,
      },
    },
  },
  30220: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        HEALING: 4,
      },
    },
  },
  30221: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  30868: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        HEALING: 4,
      },
    },
  },
  30870: {
    gems: {
      sockets: [
        GemColor.yellow,
      ],
      bonus: {
        STAMINA: 3,
      },
    },
  },
  30871: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        HEALING: 4,
      },
    },
  },
  30884: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
      ],
      bonus: {
        CRIT_SPELL_RATING: 3,
      },
    },
  },
  30888: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
  },
  30895: {
    stats: {
      HASTE_SPELL_RATING: 37,
    },
  },
  30912: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 9,
      },
    },
  },
  30916: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  31032: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        HEALING: 4,
      },
    },
  },
  31037: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.meta,
      ],
      bonus: {
        HEALING: 9,
      },
    },
  },
  31041: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 9,
      },
    },
  },
  31045: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        HEALING: 4,
      },
    },
  },
  31047: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  31061: {
    gems: {
      sockets: [
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
  },
  31064: {
    gems: {
      sockets: [
        GemColor.meta,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  31065: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  31070: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
  },
  31856: {
    auras: [
      {
        type: "ProcTriggerSpellAura",
        value: 100,
        auraProcChance: 100,
        spellName: "Aura of the Crusader",
        affectedSpells: [
          "Mind Blast",
          "Mindflay",
          "Shadow Word: Death",
          "Shadow Word: Pain",
          "Starshards",
          "Vampiric Touch",
        ],
        maximumStacks: 10,
      },
    ],
  },
  32239: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
  },
  32256: {
    stats: {
      HASTE_SPELL_RATING: 32,
    },
  },
  32271: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 9,
      },
    },
  },
  32328: {
    stats: {
      HASTE_SPELL_RATING: 37,
    },
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  32329: {
    gems: {
      sockets: [
        GemColor.meta,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 9,
      },
    },
  },
  32339: {
    stats: {
      HASTE_SPELL_RATING: 37,
    },
  },
  32353: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
      ],
      bonus: {
        MP5: 1,
      },
    },
  },
  32367: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  32374: {
    stats: {
      HASTE_SPELL_RATING: 55,
    },
  },
  32483: {
    onUse: "Fel Infusion",
  },
  32496: {
    auras: [
      {
        type: "ProcTriggerSpellAura",
        value: 100,
        auraProcChance: 10,
        spellName: "Wisdom (Memento of Tyrande)",
        affectedSpells: [
          "Heal (Crystal Spire of Karabor)",
          "Healing Touch",
          "Inner Focus",
          "Innervate",
          "Lesser Spell Blasting",
          "Lifebloom",
          "Mind Blast",
          "Mindflay",
          "Regrowth",
          "Rejuvenation",
          "Shadow Word: Death",
          "Shadow Word: Pain",
          "Starshards",
          "Swiftmend",
          "Vampiric Touch",
        ],
        maximumStacks: 1,
      },
    ],
  },
  32500: {
    auras: [
      {
        type: "ProcTriggerSpellAura",
        value: 50,
        auraProcChance: 100,
        spellName: "Heal (Crystal Spire of Karabor)",
        affectedSpells: [
          "Regrowth",
          "Healing Touch",
          // TODO: Lifebloom bloom?
        ],
        maximumStacks: 1,
      },
    ],
  },
  32519: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  32524: {
    stats: {
      HASTE_SPELL_RATING: 32,
    },
  },
  32525: {
    gems: {
      sockets: [
        GemColor.meta,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  32527: {
    stats: {
      HASTE_SPELL_RATING: 31,
    },
  },
  32528: {
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  32584: {
    stats: {
      HASTE_SPELL_RATING: 28,
    },
  },
  32586: {
    stats: {
      HASTE_SPELL_RATING: 28,
    },
  },
  32587: {
    stats: {
      HASTE_SPELL_RATING: 38,
    },
  },
  32609: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  32872: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
  },
  33192: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
  },
  33281: {
    stats: {
      HASTE_SPELL_RATING: 33,
    },
  },
  33285: {
    gems: {
      sockets: [
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
  },
  33293: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
  },
  33334: {
    stats: {
      HASTE_SPELL_RATING: 17,
    },
  },
  33356: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 9,
      },
    },
  },
  33357: {
    stats: {
      HASTE_SPELL_RATING: 25,
    },
  },
  33463: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        MP5: 2,
      },
    },
  },
  33466: {
    stats: {
      HASTE_SPELL_RATING: 27,
    },
  },
  33468: {
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  33471: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  33483: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  33494: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  33497: {
    stats: {
      HASTE_SPELL_RATING: 29,
    },
  },
  33498: {
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  33584: {
    stats: {
      HASTE_SPELL_RATING: 45,
    },
  },
  33585: {
    stats: {
      HASTE_SPELL_RATING: 45,
    },
  },
  33586: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
  },
  33587: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        HEALING: 7,
      },
    },
  },
  33592: {
    stats: {
      HASTE_SPELL_RATING: 25,
    },
  },
  33829: {
    onUse: "Mojo Madness",
  },
  33922: {
    gems: {
      sockets: [
        GemColor.yellow,
      ],
      bonus: {
        STAMINA: 3,
      },
    },
  },
  34166: {
    stats: {
      HASTE_SPELL_RATING: 22,
    },
  },
  34170: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.yellow,
        GemColor.blue,
      ],
      bonus: {
        SPIRIT: 4,
      },
    },
  },
  34176: {
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  34179: {
    stats: {
      HASTE_SPELL_RATING: 32,
    },
  },
  34181: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.red,
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 32,
    },
  },
  34182: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.yellow,
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  34199: {
    gems: {
      sockets: [
        GemColor.red,
      ],
      bonus: {
        MP5: 1,
      },
    },
  },
  34202: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
      ],
      bonus: {
        MP5: 1,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 33,
    },
  },
  34204: {
    stats: {
      HASTE_SPELL_RATING: 32,
    },
  },
  34206: {
    stats: {
      HASTE_SPELL_RATING: 22,
    },
  },
  34209: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.red,
      ],
      bonus: {
        MP5: 1,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  34210: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  34212: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        MP5: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 33,
    },
  },
  34230: {
    stats: {
      HASTE_SPELL_RATING: 31,
    },
  },
  34232: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.yellow,
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 33,
    },
  },
  34233: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.blue,
        GemColor.yellow,
      ],
      bonus: {
        SPIRIT: 4,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 32,
    },
  },
  34242: {
    gems: {
      sockets: [
        GemColor.red,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 32,
    },
  },
  34245: {
    gems: {
      sockets: [
        GemColor.meta,
        GemColor.red,
      ],
      bonus: {
        MP5: 2,
      },
    },
  },
  34335: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        MP5: 1,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 23,
    },
  },
  34336: {
    stats: {
      HASTE_SPELL_RATING: 23,
    },
  },
  34337: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
        GemColor.blue,
      ],
      bonus: {
        SPIRIT: 4,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 32,
    },
  },
  34339: {
    gems: {
      sockets: [
        GemColor.meta,
        GemColor.red,
      ],
      bonus: {
        MP5: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  34340: {
    gems: {
      sockets: [
        GemColor.meta,
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  34342: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.blue,
      ],
      bonus: {
        MP5: 1,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 27,
    },
  },
  34344: {
    gems: {
      sockets: [
        GemColor.yellow,
        GemColor.red,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 36,
    },
  },
  34347: {
    gems: {
      sockets: [
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 18,
    },
  },
  34362: {
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  34363: {
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  34364: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.red,
        GemColor.red,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 40,
    },
  },
  34366: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.red,
      ],
      bonus: {
        DAMAGE: 4,
      },
    },
  },
  34367: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.red,
      ],
      bonus: {
        SPIRIT: 3,
      },
    },
  },
  34372: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.red,
      ],
      bonus: {
        SPIRIT: 3,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 38,
    },
  },
  34384: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.red,
        GemColor.blue,
      ],
      bonus: {
        SPIRIT: 3,
      },
    },
  },
  34386: {
    gems: {
      sockets: [
        GemColor.red,
        GemColor.yellow,
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 42,
    },
  },
  34405: {
    gems: {
      sockets: [
        GemColor.meta,
        GemColor.red,
      ],
      bonus: {
        DAMAGE: 5,
      },
    },
  },
  34434: {
    gems: {
      sockets: [
        GemColor.red,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 20,
    },
  },
  34445: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        HEALING: 4,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 12,
    },
  },
  34528: {
    gems: {
      sockets: [
        GemColor.yellow,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 29,
    },
  },
  34554: {
    gems: {
      sockets: [
        GemColor.red,
      ],
      bonus: {
        SPIRIT: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 13,
    },
  },
  34563: {
    gems: {
      sockets: [
        GemColor.blue,
      ],
      bonus: {
        DAMAGE: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 30,
    },
  },
  34571: {
    gems: {
      sockets: [
        GemColor.red,
      ],
      bonus: {
        SPIRIT: 2,
      },
    },
    stats: {
      HASTE_SPELL_RATING: 19,
    },
  },
  34901: {
    gems: {
      sockets: [
        GemColor.blue,
        GemColor.red,
      ],
      bonus: {
        SPIRIT: 3,
      },
    },
  },
  34926: {
    gems: {
      sockets: [
        GemColor.red,
      ],
      bonus: {
        SPIRIT: 2,
      },
    },
  },
  38288: {
    onUse: "Hopped Up",
  },
  38290: {
    onUse: "Dark Iron Pipeweed",
  },
};
