import { gearDatabase } from "./databases/gearDatabase.js";
import { gemDatabase } from "./databases/gemDatabase.js";
import { itemSetDatabase } from "./databases/itemSetDatabase.js";
import { itemSourceDatabase } from "./databases/itemSourceDatabase.js";
import { database } from "./databases/manualGearDatabase.js";
import { spellDatabase } from "./databases/spellDatabase.js";
import { mergeStatData } from "./types.js";

/** @typedef {import("./types.js").ItemData} ItemData */
/** @typedef {import("./types.js").Spell} Spell */
/** @typedef {import("./databases/gemDatabase.js").Gem} Gem */

/**
 * @param {number | string} id
 * @returns {ItemData}
 */
export function getGearData(id) {
  const generated = gearDatabase[id];
  const manual = database[id];

  const auras = [
    ...(generated?.auras || []),
    ...(manual?.auras || []),
  ];

  return {
    stats: mergeStatData(generated?.stats || {}, manual?.stats || {}),
    itemSetId: generated?.itemSetId || manual?.itemSetId || undefined,
    gems: generated?.gems || manual?.gems || undefined,
    auras,
    unique: generated?.unique || manual?.unique || false,
    exclusiveWith: generated?.exclusiveWith || manual?.exclusiveWith || undefined,
    onUse: generated?.onUse || manual?.onUse || undefined,
  };
}

/**
 * @param {number | string} id
 * @returns {Gem}
 */
export function getGemData(id) {
  return gemDatabase[id];
}

/**
 * @param {number} id
 */
export function getItemSet(id) {
  return itemSetDatabase[id];
}

/**
 * @param {keyof typeof spellDatabase} spellName
 * @returns {Spell}
 */
export function getSpellData(spellName) {
  return spellDatabase[spellName];
}

/**
 * @param {number | string} id
 */
export function getItemSourceData(id) {
  return itemSourceDatabase[id];
}
