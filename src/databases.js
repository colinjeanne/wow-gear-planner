import { itemSourceDatabase } from "./databases/itemSourceDatabase.js";
import { database } from "./databases/manualGearDatabase.js";

/** @typedef {import("./types.js").ItemData} ItemData */

/**
 * @param {number} id
 * @returns {ItemData}
 */
export function getGearData(id) {
  const manual = database[id];

  return {
    exclusiveWith: manual?.exclusiveWith || undefined,
  };
}

/**
 * @param {number} id
 */
export function getItemSourceData(id) {
  return itemSourceDatabase[id];
}
