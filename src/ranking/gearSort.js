import { getGearData, getGemData } from "../databases.js";
import { GemColor } from "../types.js";

/**
 * @typedef {import("../types.js").Gem} Gem
 * @typedef {import("../types.js").ItemData} ItemData
 * @typedef {import("../types.js").Stat} Stat
 * @typedef {import("../types.js").StatData} StatData
 */

const UNKNOWN = Number.POSITIVE_INFINITY;

/**
 * @param {Partial<StatData>} statData
 * @param {Map<Stat, number>} statWeights
 */
function scoreStatData(statData, statWeights) {
  let score = 0;
  for (const [stat, value] of /** @type {[Stat, number][]} */ (Object.entries(statData))) {
    if (statWeights.has(stat)) {
      score += value * (statWeights.get(stat) || 0);
    }
  }

  return score;
}

/**
 * @param {ItemData} gear
 * @param {Map<Stat, number>} statWeights
 * @param {Gem} gem
 * @param {Gem} metaGem
 */
function gearScore(gear, statWeights, gem, metaGem) {
  if (gear.onUse || gear.itemSetId) {
    return UNKNOWN;
  }

  let score = scoreStatData(gear.stats, statWeights);

  if (gear.gems) {
    for (const gemColor of gear.gems.sockets) {
      if (gemColor === GemColor.meta) {
        score += scoreStatData(metaGem.stats, statWeights);

        // TODO: Meta gem effects
      } else {
        score += scoreStatData(gem.stats, statWeights);
      }
    }

    // TODO Gem bonuses
  }

  if (gear.auras) {
    for (const aura of gear.auras) {
      if (aura.type !== "ModifyStatsAura" || aura.maximumStacks > 1) {
        return UNKNOWN;
      }

      score += scoreStatData(aura.addedStats, statWeights);
    }
  }

  return score;
}

/**
 * @param {(string | number)[]} gearIds
 * @param {Map<Stat, number>} statWeights
 * @param {number} gemId
 * @param {number} metaGemId
 * @returns {(string | number)[]}
 */
export function sortItemsByWeightedStats(gearIds, statWeights, gemId, metaGemId) {
  const gem = getGemData(gemId);
  const metaGem = getGemData(metaGemId);

  /** @type {[string | number, ItemData, number][]} */
  const gearWithIdAndScore = gearIds.map(id => {
    const gear = getGearData(id);
    return [
      id,
      gear,
      gearScore(gear, statWeights, gem, metaGem),
    ];
  });

  gearWithIdAndScore.sort((a, b) => {
    if (a[0] === b[0]) {
      return 0;
    }

    if (a[1].exclusiveWith && a[1].exclusiveWith.indexOf(b[0]) !== -1) {
      const aRank = a[1].exclusiveWith.indexOf(a[0]);
      const bRank = a[1].exclusiveWith.indexOf(b[0]);
      return aRank - bRank;
    }

    if (a[0] === UNKNOWN && b[0] === UNKNOWN) {
      return 0;
    }

    return a[2] - b[2];
  });

  return gearWithIdAndScore.map(item => item[0]);
}
