import { getGearData } from "./databases.js";

/**
 * @typedef {import("./types.js").Slot} Slot
 */

/**
 * @typedef NotedItemId
 * @property {number} id
 * @property {string=} note
 */

/**
 * @typedef {{ [slot in Slot]?: NotedItemId[] }} SlottedItems
 */

/**
 * @typedef Link
 * @property {string} href
 * @property {string} text
 */

/**
 * @typedef Gem
 * @property {number} id
 * @property {1 | 2 | 3 | 4 | 5} phase
 */

/**
 * @typedef {"Druid" | "Priest"} ClassName
 */

/**
 * @typedef CharacterData
 * @property {string[]} notes
 * @property {Link[]} links
 * @property {{ [x in Slot]?: number[] }} equippedGear
 * @property {SlottedItems} gearRanking
 * @property {{ [x in Slot]?: number[] }} equippedEnchants
 * @property {SlottedItems} enchantRanking
 */

/**
 * @typedef Character
 * @property {string} name
 * @property {ClassName} className
 * @property {{ [spec: string]: CharacterData }} specs
 */

/**
 * @param {number} id
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
      const exclusiveWith = itemData.exclusiveWith;
      const upgradeRanks = equippedGear.map(id => exclusiveWith.indexOf(id));
      const greatestEquippedRank = Math.max(...upgradeRanks);
      const upgradeRank = exclusiveWith.indexOf(id);

      if (upgradeRank < greatestEquippedRank) {
        return true;
      }
    }

    return false;
  }

  return false;
}

/**
 * @param {number} id
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

  return false;
}

/** @type {Character[]} */
export const characters = [
  {
    name: "Seradane",
    className: "Druid",
    specs: {
      "Resto": {
        notes: [],
        links: [],
        equippedGear: {
          head: [
            31037,
          ],
          neck: [
            33281,
          ],
          shoulders: [
            34209,
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
            29376,
          ],
          relic: [
            25643,
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
          ],
          neck: [
            {
              id: 33281,
            },
          ],
          shoulders: [
            {
              id: 34209,
            },
          ],
          back: [
            {
              id: 34242,
            },
            {
              id: 32524,
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
          ],
          wrist: [
            {
              id: 34445,
            },
            {
              id: 30868,
            },
          ],
          hands: [
            {
              id: 34342,
            },
            {
              id: 32328,
            },
          ],
          waist: [
            {
              id: 34554,
            },
            {
              id: 33483,
            },
          ],
          legs: [
            {
              id: 34386,
            },
            {
              id: 34384,
            },
            {
              id: 32271,
            },
          ],
          feet: [
            {
              id: 34571,
            },
            {
              id: 32609,
            },
          ],
          ring: [
            {
              id: 32528,
            },
            {
              id: 29309,
            },
          ],
          trinket: [
            {
              id: 32496,
            },
            {
              id: 33829,
            },
            {
              id: 29376,
            },
          ],
          relic: [
            {
              id: 25643,
            },
          ],
          mainHand: [
            {
              id: 34335,
            },
            {
              id: 34336,
            },
            {
              id: 34199,
            },
            {
              id: 33468,
            },
          ],
          offHand: [
            {
              id: 34206,
            },
            {
              id: 30911,
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
          ],
          mainHand: [
            {
              id: 28281,
            },
          ],
        },
      },
    },
  },
  {
    name: "Tylanis",
    className: "Priest",
    specs: {
      "Shadow": {
        notes: [],
        links: [
          {
            href: "https://github.com/thewellnamed/shadow",
            text: "Log Analyzer",
          },
          {
            href: "https://wowsims.github.io/wotlk/shadow_priest/",
            text: "Sim",
          },
        ],
        equippedGear: {
          head: [
            31064,
          ],
          neck: [
            33281,
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
            29370,
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
              id: 31064,
              note: "Best with 2 set bonus",
            },
          ],
          neck: [
            {
              id: 34204,
            },
            {
              id: 33281,
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
          ],
          back: [
            {
              id: 34242,
            },
            {
              id: 32590,
            },
          ],
          chest: [
            {
              id: 31065,
            },
          ],
          wrist: [
            {
              id: 34434,
            },
          ],
          hands: [
            {
              id: 31061,
              note: "Best with 2 piece",
            },
          ],
          waist: [
            {
              id: 30038,
            },
          ],
          legs: [
            {
              id: 34181,
            },
            {
              id: 34386,
            },
          ],
          feet: [
            {
              id: 34563,
            },
          ],
          ring: [
            {
              id: 32527,
            },
            {
              id: 33497,
              note: "Timed loot",
            },
          ],
          trinket: [
            {
              id: 33829,
            },
            {
              id: 32483,
            },
            {
              id: 31856,
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
          ],
          mainHand: [
            {
              id: 34336,
            },
            {
              id: 34176,
            },
            {
              id: 34895,
              note: "Beats Zhar'doom with Heart of the Pit",
            },
          ],
          offHand: [
            {
              id: 34179,
            },
            {
              id: 33334,
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
      },
    },
  },
];
