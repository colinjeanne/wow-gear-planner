import { slots } from "./types.js";
import { getItemSourceData } from "./databases.js";

/**
 * @typedef {import("./characters.js").NotedItemId} NotedItemId
 * @typedef {import("./characters.js").SlottedItems} SlottedItems
 * @typedef {import("./types.js").Item} Item
 * @typedef {import("./types.js").ItemData} ItemData
 * @typedef {import("./types.js").Slot} Slot
 */

/**
 * @typedef TransformedItem
 * @property {string | number} id
 * @property {number} rank
 * @property {Item} item
 * @property {string=} note
 */

/**
 * @param {SlottedItems} slottedItems
 * @returns {TransformedItem[]}
 */
export function slottedItemsToTransformedItems(slottedItems) {
  /** @type {TransformedItem[]} */
  const transformed = [];
  for (const itemList of Object.values(slottedItems)) {
    let rank = 1;
    for (const notedItem of itemList) {
      transformed.push({
        id: notedItem.id,
        rank,
        item: getItemSourceData(notedItem.id),
        note: notedItem.note,
      });

      ++rank;
    }
  }

  return transformed;
}

/**
 * @param {TransformedItem[]} transformedItems
 * @param {number} latestPhase
 */
export function filterByPhase(transformedItems, latestPhase) {
  return transformedItems.filter(transformedItem => transformedItem.item.phase <= latestPhase);
}

/**
 * @param {TransformedItem[]} transformedItems
 * @param {string=} sourceFilter
 */
export function filterBySource(transformedItems, sourceFilter) {
  return transformedItems.filter(transformedItem =>
    !sourceFilter ||
    transformedItem.item.source.toLowerCase().startsWith(sourceFilter.toLowerCase()) ||
    slots[transformedItem.item.slot].toLowerCase().startsWith(sourceFilter.toLowerCase()));
}

/**
 *
 * @param {TransformedItem[]} transformedItems
 */
export function sortBySource(transformedItems) {
  return [...transformedItems].sort((a, b) => {
    if (a.item.source < b.item.source) {
      return -1;
    } else if (a.item.source > b.item.source) {
      return 1;
    } else if (!a.item.boss || !b.item.boss) {
      return a.rank - b.rank;
    } else if (a.rank < b.rank) {
      return -1;
    } else if (a.rank > b.rank) {
      return 1;
    } else if (a.item.boss < b.item.boss) {
      return -1;
    } else if (a.item.boss > b.item.boss) {
      return 1;
    }

    return 0;
  });
}

/**
 * @typedef Transform
 * @property {(data: any, ...args: any[]) => TransformedItem[]} fn
 * @property {unknown[]} arguments
 */

/**
 * @param {Transform[]} transforms
 * @param {TransformedItem[]} data
 */
export function applyTransforms(transforms, data) {
  let transformed = data;
  for (const transform of transforms) {
    if (transform) {
      transformed = transform.fn(transformed, ...transform.arguments);
    }
  }

  return transformed;
}
