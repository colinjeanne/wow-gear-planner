import { readFileSync } from "fs";
import fetch from "node-fetch";
import { FormData } from "formdata-node";
import { database as manualGearDatabase } from "./src/databases/manualGearDatabase.js";

const secrets = JSON.parse(readFileSync("./.env.json", "utf-8"))

/**
 * @typedef {import("./src/types.js").AuraDefinition} AuraDefinition
 * @typedef {import("./src/types.js").ItemData} ItemData
 * @typedef {import("./src/types.js").Stat} Stat
 * @typedef {import("./src/types.js").StatData} StatData
 */

/**
 * @typedef Config
 * @property {"us" | "eu" | "kr" | "tw" | "cn"} region
 * @property {string} locale
 * @property {string} host
 */

/** @type {Config} */
const defaultConfig = {
  region: "us",
  locale: "en_US",
  host: "https://us.api.blizzard.com",
};

/**
 * @typedef ApiArmorData
 * @property {number} value
 */

/**
 * @typedef ApiStatData
 * @property {{ type: Stat }} type
 * @property {number} value
 */

/**
 * @typedef ApiSpellData
 * @property {{ name: string }} spell
 * @property {string} description
 */

/**
 * @typedef ApiSetItemData
 * @property {{ id: number }} item
 */

/**
 * @typedef ApiSetData
 * @property {{ id: number }} item_set
 * @property {ApiSetItemData[]} items
 */

/**
 * @typedef {"Unique" | "Unique-Equipped"} ApiUniqueEquipped
 */

/**
 * @typedef ApiPreviewData
 * @property {ApiArmorData=} armor
 * @property {ApiStatData[]=} stats
 * @property {ApiSpellData[]=} spells
 * @property {ApiSetData=} set
 * @property {ApiUniqueEquipped=} unique_equipped
 */

/**
 * @typedef ApiItemData
 * @property {number} id
 * @property {ApiPreviewData} preview_item
 */

/**
 * @template T
 * @param {() => Promise<T>} awaitable
 * @param {number} attempts
 * @returns {Promise<T>}
 */
async function retryAwaitable(awaitable, attempts) {
  let attempt = 0;
  while (attempt < attempts) {
    try {
      return awaitable();
    } finally {
      ++attempt;
    }
  }

  throw new Error("Max attempts exceeded");
}

/**
 * @param {string} name
 * @returns {Partial<StatData>?}
 */
function parseStatDataBySpellName(name) {
  if (name === "Glyph of Renewal") {
    return {
      HEALING: 35,
      MP5: 7,
    };
  } else if (name === "Greater Inscription of Faith") {
    return {
      HEALING: 33,
      MP5: 4,
    };
  } else if (name === "Inscription of Faith") {
    return {
      HEALING: 29,
    };
  } else if (name === "Enchant Cloak - Subtlety") {
    return {};
  } else if (name === "Enchant Chest - Major Spirit") {
    return {
      SPIRIT: 15,
    };
  } else if (name === "Enchant Chest - Exceptional Stats") {
    return {
      STRENGTH: 6,
      AGILITY: 6,
      STAMINA: 6,
      INTELLECT: 6,
      SPIRIT: 6,
    };
  } else if (name === "Enchant Bracer - Superior Healing") {
    return {
      HEALING: 30,
    };
  } else if (name === "Enchant Gloves - Major Healing") {
    return {
      HEALING: 35,
    };
  } else if (name === "Golden Spellthread") {
    return {
      HEALING: 66,
      STAMINA: 20,
    };
  } else if (name === "Silver Spellthread") {
    return {
      HEALING: 46,
      STAMINA: 15,
    };
  } else if (name === "Enchant Boots - Boar's Speed") {
    return {
      STAMINA: 9,
    };
  } else if (name === "Enchant Ring - Healing Power") {
    return {
      HEALING: 20,
    };
  } else if (name === "Enchant Weapon - Major Healing") {
    return {
      HEALING: 81,
    };
  } else if (name === "Glyph of Power") {
    return {
      DAMAGE: 22,
      HIT_SPELL_RATING: 14,
    };
  } else if (name === "Greater Inscription of Discipline") {
    return {
      DAMAGE: 18,
      CRIT_SPELL_RATING: 10,
    };
  } else if (name === "Inscription of Discipline") {
    return {
      DAMAGE: 15,
    };
  } else if (name === "Enchant Bracer - Spellpower") {
    return {
      DAMAGE: 15,
    };
  } else if (name === "Enchant Gloves - Major Spellpower") {
    return {
      DAMAGE: 20,
    };
  } else if (name === "Runic Spellthread") {
    return {
      DAMAGE: 35,
      STAMINA: 20,
    };
  } else if (name === "Mystic Spellthread") {
    return {
      DAMAGE: 25,
      STAMINA: 15,
    };
  } else if (name === "Enchant Weapon - Soulfrost") {
    return {
      FROST_DAMAGE: 54,
      SHADOW_DAMAGE: 54,
    };
  } else if (name.startsWith("Increase Healing")) {
    return {
      HEALING: parseInt(name.substring(16)),
    };
  } else if (name.startsWith("Increase Spell Dam")) {
    return {
      DAMAGE: parseInt(name.substring(19)),
    };
  } else if (name.startsWith("Increase Shadow Dam")) {
    return {
      SHADOW_DAMAGE: parseInt(name.substring(20)),
    };
  } else if (name.startsWith("Increase Frost Dam")) {
    return {
      FROST_DAMAGE: parseInt(name.substring(19)),
    };
  } else if (name.startsWith("Increased Spell Penetration")) {
    return {
      PENETRATION: parseInt(name.substring(27)),
    };
  }

  return null;
}

/**
 * @param {string} description
 * @returns {Partial<StatData>?}
 */
function parseStatDataByDescription(description) {
  const readers = {
    MP5: /Restores (\d+) mana per 5 sec/,
  };

  for (const [name, regex] of Object.entries(readers)) {
    const matches = description.match(regex);
    if (matches) {
      return {
        [name]: parseInt(matches[1]),
      };
    }
  }

  return null;
}

/**
 * @param {ApiItemData} itemData
 */
function getArmorFromItemData(itemData) {
  return itemData.preview_item.armor?.value || 0;
}

/**
 * @param {ApiItemData} itemData
 * @returns {Partial<StatData>}
 */
function getStatsFromItemData(itemData) {
  const statData = itemData.preview_item.stats || [];

  /** @type {Partial<StatData>} */
  let computedStats = {
    ARMOR: getArmorFromItemData(itemData),
  };
  for (const stat of statData) {
    computedStats[stat.type.type] = stat.value;
  }

  return computedStats;
}

/**
 * @param {ApiItemData} itemData
 * @returns {AuraDefinition[]}
 */
function getAurasFromItemData(itemData) {
  const spellData = itemData.preview_item.spells || [];

  /** @type {AuraDefinition[]} */
  const auras = [];
  for (const spell of spellData) {
    const manualItem = manualGearDatabase[itemData.id];
    if (manualItem?.onUse !== spell.spell.name) {
      const parsedData =
        parseStatDataBySpellName(spell.spell.name) ||
        parseStatDataByDescription(spell.description);
      if (parsedData) {
        auras.push({
          type: "ModifyStatsAura",
          addedStats: parsedData,
          value: 0,
          maximumStacks: 1,
        });
      } else {
        if (!manualItem?.auras || manualItem.auras.length === 0) {
          console.log(spell);
        }
      }
    }
  }

  return auras;
}

/**
 * @param {ApiItemData} itemData
 */
function getItemSetIdFromItemData(itemData) {
  if (!itemData.preview_item.set) {
    return undefined;
  }

  return itemData.preview_item.set.item_set.id;
}

/**
 * @param {ApiItemData} itemData
 */
function getUniqueEquippedFromItemData(itemData) {
  return itemData.preview_item.unique_equipped !== undefined;
}

export class ApiClient {
  #accessToken = "";
  #clientId = "";
  #clientSecret = "";

  /** @type {Config} */
  #config;

  /**
   * @param {Config} config
   */
  constructor(config = defaultConfig) {
    this.#config = config;

    this.#clientId = secrets.clientId;
    this.#clientSecret = secrets.clientSecret;
  }

  /**
   * Gets the stats for a given item ID
   * @param {string | number} id
   * @returns {Promise<ItemData>}
   */
  async getItemData(id) {
    if (!/^\d+$/.test(id.toString())) {
      throw new Error(`Unsupported ID: ${id}`);
    }

    const url = `${this.#config.host}/data/wow/item/${id}?${await this.#requestQueries("static-classic")}`;

    const awaitable = async () => {
      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return await response.json();
    };

    const json = await retryAwaitable(awaitable, 3);

    return {
      auras: getAurasFromItemData(json),
      stats: getStatsFromItemData(json),
      itemSetId: getItemSetIdFromItemData(json),
      unique: getUniqueEquippedFromItemData(json),
    };
  }

  async #getAccessToken() {
    if (this.#accessToken) {
      return this.#accessToken;
    }

    const body = new FormData();
    body.append("grant_type", "client_credentials");

    const response = await fetch(
      `https://us.battle.net/oauth/token?client_id=${this.#clientId}&client_secret=${this.#clientSecret}`,
      {
        method: "POST",
        body,
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const json = await response.json();
    this.#accessToken = json["access_token"];
    return this.#accessToken;
  }

  /**
   * @param {string} namespace
   */
  async #requestQueries(namespace) {
    const accessToken = await this.#getAccessToken();
    return `namespace=${namespace}-${this.#config.region}&locale=${this.#config.locale}&access_token=${accessToken}`;
  }
}
