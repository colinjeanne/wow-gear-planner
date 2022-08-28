import { getGearData } from "./databases.js";

/**
 * @typedef {import("./types.js").Item} Item
 * @typedef {import("./types.js").Slot} Slot
 */

/**
 * @typedef NotedItemId
 * @property {string | number} id
 * @property {string=} note
 */

/**
 * @typedef {{ [slot in Slot]?: NotedItemId[] }} SlottedItems
 */

/**
 * @typedef {{ [slot in Slot]?: (number | string)[] }} EquippedGems
 */

/**
 * @typedef Link
 * @property {string} href
 * @property {string} text
 */

/**
 * @typedef Gem
 * @property {number | string} id
 * @property {1 | 2 | 3 | 4 | 5} phase
 */

/**
 * @typedef DruidClass
 * @property {"Druid"} className
 * @property {"Resto"} spec
 * @property {{
 *  "Empowered Rejuvenation": 0 | 1 | 2 | 3 | 4 | 5,
 *  "Gift of Nature": 0 | 1 | 2 | 3 | 4 | 5,
 *  "Improved Regrowth": 0 | 1 | 2 | 3 | 4 | 5,
 *  "Improved Rejuvenation": 0 | 1 | 2 | 3,
 *  Intensity: 0 | 1 | 2 | 3,
 *  "Living Spirit": 0 | 1 | 2 | 3,
 *  "Natural Perfection": 0 | 1 | 2 | 3,
 *  Swiftmend: 0 | 1,
 *  "Tree of Life": 0 | 1,
 * }} talents
 */

/**
 * @typedef PriestClass
 * @property {"Priest"} className
 * @property {"Shadow"} spec
 * @property {{
 *  Darkness: 0 | 1 | 2 | 3 | 4 | 5,
 *  "Focused Mind": 0 | 1 | 2 | 3,
 *  "Improved Mind Blast": 0 | 1 | 2 | 3 | 4 | 5,
 *  "Improved Shadow Word: Pain": 0 | 1 | 2,
 *  "Inner Focus": 0 | 1,
 *  Meditation: 0 | 1 | 2 | 3,
 *  "Mind Flay": 0 | 1,
 *  Shadowform: 0 | 1,
 *  "Shadow Focus": 0 | 1 | 2 | 3 | 4 | 5,
 *  "Shadow Power": 0 | 1 | 2 | 3 | 4 | 5,
 *  "Vampiric Touch": 0 | 1,
 * }} talents
 */

/** @typedef {DruidClass | PriestClass} ClassAndSpec */

/**
 * @typedef CoreCharacterData
 * @property {string[]} notes
 * @property {Link[]} links
 * @property {{ [x in Slot]?: (number | string)[] }} equippedGear
 * @property {SlottedItems} gearRanking
 * @property {{ [x in Slot]?: (number | string)[] }} equippedEnchants
 * @property {SlottedItems} enchantRanking
 * @property {EquippedGems} equippedGems
 * @property {Gem[]} gemRanking
 */

/** @typedef {CoreCharacterData & ClassAndSpec } CharacterData */

/**
 * @typedef {{ [x: string]: CharacterData }} Characters
 */

/**
 * @param {string | number} id
 * @param {Slot} slot
 * @param {CharacterData} characterData
 */
export function isItemObsolete(id, slot, characterData) {
  const enchants = characterData.enchantRanking[slot];
  const equippedEnchants = characterData.equippedEnchants[slot];
  if (enchants && equippedEnchants) {
    const enchantIds = enchants.map(enchantItem => enchantItem.id);
    const itemIndex = enchantIds.findIndex(enchantId => enchantId === id);
    if (itemIndex !== -1) {
      const lastEquippedIndex = Math.max(
        ...equippedEnchants.map(equippedId => enchantIds.findIndex(enchantId => enchantId === equippedId))
      );
      return itemIndex > lastEquippedIndex;
    }
  }

  const gear = characterData.gearRanking[slot];
  const equippedGear = characterData.equippedGear[slot];
  if (gear && equippedGear) {
    const gearIds = gear.map(gearItem => gearItem.id);
    const itemIndex = gearIds.findIndex(gearId => gearId === id);
    if (itemIndex !== -1) {
      const lastEquippedIndex = Math.max(
        ...equippedGear.map(equippedId => gearIds.findIndex(gearId => gearId === equippedId))
      );

      if (itemIndex > lastEquippedIndex) {
        return true;
      }
    }

    const itemData = getGearData(id);
    if (itemData.exclusiveWith !== undefined) {
      const upgradeRanks = equippedGear.map(id =>
        /** @type {(number | string)[]} */(itemData.exclusiveWith).indexOf(id)
      );
      const greatestEquippedRank = Math.max(...upgradeRanks);
      const upgradeRank = itemData.exclusiveWith.indexOf(id);

      if (upgradeRank < greatestEquippedRank) {
        return true;
      }
    }

    return false;
  }

  const gemIds = characterData.gemRanking.map(gem => gem.id);
  const equippedGems = characterData.equippedGems[slot];
  const itemIndex = gemIds.findIndex(gemId => gemId === id);
  if (equippedGems && itemIndex !== -1) {
    if (itemIndex !== -1) {
      const lastEquippedIndex = Math.max(
        ...equippedGems.map(equippedId => gemIds.findIndex(gemId => gemId === equippedId))
      );
      return itemIndex > lastEquippedIndex;
    }
  }

  return false;
}

/**
 * @param {string | number} id
 * @param {Slot} slot
 * @param {CharacterData} characterData
 */
export function isItemEquipped(id, slot, characterData) {
  const enchants = characterData.equippedEnchants[slot];
  if (enchants && enchants.includes(id)) {
    return true;
  }

  const gear = characterData.equippedGear[slot];
  if (gear && gear.includes(id)) {
    return true;
  }

  const gems = characterData.equippedGems[slot];
  if (gems && gems.includes(id)) {
    return true;
  }

  return false;
}

/** @type {Characters} */
export const characters = {
  Seradane: {
    className: "Druid",
    spec: "Resto",
    talents: {
      Intensity: 3,
      "Improved Rejuvenation": 3,
      "Gift of Nature": 5,
      "Improved Regrowth": 5,
      "Living Spirit": 3,
      Swiftmend: 1,
      "Natural Perfection": 3,
      "Empowered Rejuvenation": 5,
      "Tree of Life": 1,
    },
    notes: [
      "113+ haste rating to maintain 5 lifeblooms",
    ],
    links: [
      {
        href: "https://wowtbc.gg/bis-list/restoration-druid/",
        text: "BiS List",
      },
      {
        href: "https://www.ownedcore.com/forums/world-of-warcraft/world-of-warcraft-guides/138069-guide-tree-druid.html",
        text: "Druid Guide",
      }
    ],
    equippedGear: {
      head: [
        31037,
      ],
      neck: [
        33281,
      ],
      shoulders: [
        31047,
      ],
      back: [
        32524,
      ],
      chest: [
        31041,
      ],
      wrist: [
        30868,
      ],
      hands: [
        32328,
      ],
      waist: [
        33483,
      ],
      legs: [
        32271,
      ],
      feet: [
        32609,
      ],
      ring: [
        32528,
        29309,
      ],
      trinket: [
        32496,
        38288,
      ],
      relic: [
        27886,
      ],
      mainHand: [
        33468,
      ],
      offHand: [
        30911,
      ],
    },
    gearRanking: {
      head: [
        {
          id: 34339,
        },
        {
          id: 34245,
        },
        {
          id: 31037,
        },
        {
          id: 32329,
        },
        {
          id: 33356,
        },
        {
          id: 33463,
        },
        {
          id: 30219,
        },
        {
          id: 29086,
        },
        {
          id: 24264,
        },
        {
          id: 28803,
        },
      ],
      neck: [
        {
          id: 33281,
        },
        {
          id: 32370,
        },
        {
          id: 30018,
        },
        {
          id: 33922,
        },
        {
          id: 28609,
        },
        {
          id: 28822,
        },
        {
          id: 28731,
        },
        {
          id: 30377,
        },
      ],
      shoulders: [
        {
          id: 34209,
        },
        {
          id: 34202,
        },
        {
          id: 31047,
        },
        {
          id: 30221,
        },
      ],
      back: [
        {
          id: 32337,
        },
        {
          id: 32524,
        },
        {
          id: 29989,
        },
        {
          id: 34205,
        },
        {
          id: 33592,
        },
        {
          id: 34012,
        },
        {
          id: 28765,
        },
      ],
      chest: [
        {
          id: 34233,
        },
        {
          id: 34212,
        },
        {
          id: 31041,
        },
        {
          id: 30216,
        },
        {
          id: 29087,
        },
      ],
      wrist: [
        {
          id: 34445,
        },
        {
          id: 30868,
        },
        {
          id: 32584,
        },
        {
          id: 30871,
        },
        {
          id: 32513,
        },
        {
          id: 30062,
        },
        {
          id: 28511,
        },
      ],
      hands: [
        {
          id: 34372,
        },
        {
          id: 32328,
        },
        {
          id: 34367,
          note: "Best if already able to cast five lifeblooms",
        },
        {
          id: 34342,
        },
        {
          id: 33587,
        },
        {
          id: 32353,
        },
        {
          id: 31032,
        },
        {
          id: 28521,
        },
        {
          id: 30217,
        },
      ],
      waist: [
        {
          id: 34554,
        },
        {
          id: 30895,
        },
        {
          id: 32339,
        },
        {
          id: 33483,
        },
        {
          id: 32519,
        },
        {
          id: 30036,
        },
      ],
      legs: [
        {
          id: 34384,
        },
        {
          id: 34170,
        },
        {
          id: 30912,
        },
        {
          id: 32271,
        },
        {
          id: 34901,
        },
        {
          id: 33585,
        },
        {
          id: 31045,
        },
        {
          id: 28591,
        },
        {
          id: 30220,
        },
      ],
      feet: [
        {
          id: 34571,
        },
        {
          id: 32609,
        },
        {
          id: 34926,
        },
        {
          id: 30092,
        },
        {
          id: 33471,
        },
        {
          id: 30100,
        },
        {
          id: 28752,
        },
      ],
      ring: [
        {
          id: 29309,
        },
        {
          id: 32528,
        },
        {
          id: 34166,
        },
        {
          id: 34363,
        },
        {
          id: 30110,
        },
        {
          id: 29308,
        },
        {
          id: 33498,
        },
        {
          id: 32238,
        },
        {
          id: 28763,
        },
        {
          id: 31383,
        },
        {
          id: 29306,
        },
        {
          id: 29290,
        },
        {
          id: 29920,
        },
        {
          id: 28790,
        },
      ],
      trinket: [
        {
          id: 32496,
        },
        {
          id: 29376,
        },
        {
          id: 38288,
        },
      ],
      relic: [
        {
          id: 27886,
        },
      ],
      mainHand: [
        {
          id: 34335,
        },
        {
          id: 34337,
        },
        {
          id: 34199,
        },
        {
          id: 32500,
        },
        {
          id: 33468,
        },
        {
          id: 34896,
        },
        {
          id: 30108,
        },
        {
          id: 28771,
        },
      ],
      offHand: [
        {
          id: 34206,
        },
        {
          id: 30911,
        },
        {
          id: 29274,
        },
      ],
    },
    equippedEnchants: {
      head: [
        29189,
      ],
      shoulders: [
        28887,
      ],
      chest: [
        35431,
      ],
      wrist: [
        22531,
      ],
      hands: [
        28273,
      ],
      legs: [
        24276,
      ],
      ring: [
        22537,
        22537,
      ],
      mainHand: [
        28281,
      ],
    },
    enchantRanking: {
      head: [
        {
          id: 29189,
        },
      ],
      shoulders: [
        {
          id: 28887,
        },
        {
          id: 28878,
        },
      ],
      back: [
        {
          id: 33150,
        },
      ],
      chest: [
        {
          id: 35431,
        },
        {
          id: 24003,
        },
      ],
      wrist: [
        {
          id: 22531,
        },
      ],
      hands: [
        {
          id: 28273,
        },
      ],
      legs: [
        {
          id: 24276,
        },
        {
          id: 24275,
        },
      ],
      feet: [
        {
          id: 28280,
        },
      ],
      ring: [
        {
          id: 22537,
        },
        {
          id: 22537,
        },
      ],
      mainHand: [
        {
          id: 28281,
        },
      ],
    },
    equippedGems: {
      head: [
        32216,
        25897,
      ],
      shoulders: [
        35489,
        35489,
      ],
      chest: [
        35489,
        35489,
        35489,
      ],
      wrist: [
        35489,
      ],
      hands: [
        35489,
        35489,
      ],
      waist: [
        35489,
        35489,
      ],
      legs: [
        35489,
        35489,
        35489,
      ],
      feet: [
        35489,
        35489,
      ],
    },
    gemRanking: [
      {
        id: 35489,
        phase: 3,
      },
      {
        id: 24029,
        phase: 1,
      },
      {
        id: 23094,
        phase: 1,
      },
      {
        id: 28460,
        phase: 1,
      },
    ],
  },
  Tylanis: {
    className: "Priest",
    spec: "Shadow",
    talents: {
      Darkness: 5,
      "Focused Mind": 3,
      "Improved Mind Blast": 5,
      "Improved Shadow Word: Pain": 2,
      "Inner Focus": 1,
      Meditation: 3,
      "Mind Flay": 1,
      Shadowform: 1,
      "Shadow Focus": 5,
      "Shadow Power": 5,
      "Vampiric Touch": 1,
    },
    notes: [
      "Hit cap is 76 (64 with Inspiring Presence)",
      "6.14 crit rating = 1 damage",
      "10 haste = 5.35 damage at 1400 damage",
      "10 spirit = 1.1 damage with Kings (1.0 without Kings)",
      "70 int = 1 crit = 3.85 damage (3.5 without Kings)",
    ],
    links: [
      {
        href: "https://web.archive.org/web/20071031031755/http://www.shadowpriest.com/viewtopic.php?t=6594",
        text: "Shadow Priest Forum",
      },
      {
        href: "https://wowtbc.gg/bis-list/shadow-priest/",
        text: "BiS List",
      },
      {
        href: "https://github.com/thewellnamed/shadow",
        text: "Log Analyzer",
      },
      {
        href: "https://wowsims.github.io/tbc/shadow_priest/",
        text: "Sim",
      },
    ],
    equippedGear: {
      head: [
        31064,
      ],
      neck: [
        33466,
      ],
      shoulders: [
        31070,
      ],
      back: [
        32590,
      ],
      chest: [
        31065,
      ],
      wrist: [
        34434,
      ],
      hands: [
        31061,
      ],
      waist: [
        30038,
      ],
      legs: [
        34386,
      ],
      feet: [
        34563,
      ],
      ring: [
        33497,
        29305,
      ],
      trinket: [
        31856,
        38290,
      ],
      wand: [
        33192,
      ],
      mainHand: [
        34895,
      ],
      offHand: [
        33334,
      ],
    },
    gearRanking: {
      head: [
        {
          id: 34340,
        },
        {
          id: 31064,
          note: "Best with 2 set bonus",
        },
        {
          id: 34405,
        },
        {
          id: 32525,
          note: "Replaced by 2 set bonus",
        },
        {
          id: 29986,
          note: "If Spellstrike has been broken and hit is needed",
        },
        {
          id: 30161,
          note: "If Spellstrike has been broken and hit is needed",
        },
        {
          id: 24266,
        },
      ],
      neck: [
        {
          id: 34204,
        },
        {
          id: 33466,
        },
        {
          id: 30666,
        },
      ],
      shoulders: [
        {
          id: 34210,
        },
        {
          id: 31070,
          note: "Best with 4 set bonus",
        },
        {
          id: 32587,
          note: "Replaced by 4 set bonus",
        },
        {
          id: 30884,
          note: "Replaced by 4 set bonus",
        },
        {
          id: 21869,
        },
      ],
      back: [
        {
          id: 34242,
        },
        {
          id: 32590,
        },
        {
          id: 29992,
        },
        {
          id: 28570,
        },
      ],
      chest: [
        {
          id: 34364,
        },
        {
          id: 34232,
        },
        {
          id: 31065,
        },
        {
          id: 30107,
          note: "If +12 damage gems are used and hit is needed",
        },
        {
          id: 21871,
        },
      ],
      wrist: [
        {
          id: 34434,
        },
        {
          id: 32586,
        },
        {
          id: 30870,
        },
        {
          id: 33285,
        },
        {
          id: "24692_9",
        },
        {
          id: 32270,
        },
        {
          id: 33588,
        },
        {
          id: 29918,
        },
        {
          id: 24250,
        },
        {
          id: 28515,
        },
      ],
      hands: [
        {
          id: 34344,
        },
        {
          id: 34366,
        },
        {
          id: 33586,
          note: "Only without 4 piece T6",
        },
        {
          id: 31061,
          note: "Best with 2 piece",
        },
        {
          id: 28780,
        },
        {
          id: 28507,
        },
      ],
      waist: [
        {
          id: 34528,
        },
        {
          id: 32256,
        },
        {
          id: 30888,
        },
        {
          id: 30038,
        },
        {
          id: 28799,
        },
      ],
      legs: [
        {
          id: 34181,
        },
        {
          id: 34386,
        },
        {
          id: 30916,
        },
        {
          id: 32367,
        },
        {
          id: 29972,
          note: "If Spellstrike has been broken",
        },
        {
          id: 33584,
        },
        {
          id: 24262,
        },
      ],
      feet: [
        {
          id: 34563,
        },
        {
          id: 21870,
        },
        {
          id: 32239,
        },
        {
          id: 33357,
        },
      ],
      ring: [
        {
          id: 34230,
        },
        {
          id: 32527,
        },
        {
          id: 34362,
        },
        {
          id: 29305,
        },
        {
          id: 33497,
          note: "Timed loot",
        },
        {
          id: 32247,
        },
        {
          id: 33293,
        },
        {
          id: 30109,
        },
        {
          id: 29304,
        },
        {
          id: 29303,
        },
        {
          id: 29922,
        },
        {
          id: 28753,
        },
        {
          id: 28793,
        },
        {
          id: 29172,
        },
        {
          id: 28555,
        },
      ],
      trinket: [
        {
          id: 33829,
        },
        {
          id: 31856,
        },
        {
          id: 32483,
        },
        {
          id: 38290,
        },
        {
          id: 29370,
        },
      ],
      wand: [
        {
          id: 34347,
        },
        {
          id: 33192,
        },
        {
          id: 29982,
        },
        {
          id: 32343,
        },
        {
          id: 32872,
        },
        {
          id: "25295_9",
        },
        {
          id: 29350,
        },
      ],
      mainHand: [
        {
          id: 34336,
        },
        {
          id: 34176,
        },
        {
          id: 32374,
        },
        {
          id: 34895,
          note: "Beats Zhar'doom with Heart of the Pit",
        },
        {
          id: 34182,
        },
        {
          id: 32237,
        },
        {
          id: 34009,
        },
        {
          id: 33354,
        },
        {
          id: 33283,
        },
        {
          id: 33494,
          note: "Timed loot",
        },
        {
          id: 28770,
        },
      ],
      offHand: [
        {
          id: 34179,
        },
        {
          id: 33334,
        },
        {
          id: 29272,
        },
      ],
    },
    equippedEnchants: {
      head: [
        29191,
      ],
      shoulders: [
        28886,
      ],
      chest: [
        24003,
      ],
      wrist: [
        22534,
      ],
      hands: [
        28272,
      ],
      legs: [
        24274,
      ],
      mainHand: [
        22561,
      ],
    },
    enchantRanking: {
      head: [
        {
          id: 29191,
        },
      ],
      shoulders: [
        {
          id: 28886,
        },
        {
          id: 28881,
        },
      ],
      back: [
        {
          id: 33150,
        },
      ],
      chest: [
        {
          id: 24003,
        },
      ],
      wrist: [
        {
          id: 22534,
        },
      ],
      hands: [
        {
          id: 28272,
        },
      ],
      legs: [
        {
          id: 24274,
        },
        {
          id: 24273,
        },
      ],
      feet: [
        {
          id: 28280,
        },
      ],
      mainHand: [
        {
          id: 22561,
        },
      ],
    },
    equippedGems: {
      head: [
        25893,
        32215,
      ],
      shoulders: [
        32196,
        32196,
      ],
      chest: [
        28118,
        32196,
        32196,
      ],
      wrist: [
        32196,
      ],
      hands: [
        32196,
      ],
      waist: [
        32196,
        32196,
      ],
      legs: [
        32196,
        32196,
        32196,
      ],
      feet: [
        32196,
      ],
      wand: [
        32196,
      ],
    },
    gemRanking: [
      {
        id: 32196,
        phase: 3,
      },
      {
        id: 28118,
        phase: 1,
      },
      {
        id: 24030,
        phase: 1,
      },
      {
        id: 23096,
        phase: 1,
      },
      {
        id: 28461,
        phase: 1,
      },
    ],
  },
};
