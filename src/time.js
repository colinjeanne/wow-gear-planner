/**
 * @param {number} endMs
 * @param {number} stepMs
 */
export function* timeRange(endMs, stepMs) {
  for (let currentMs = 0; currentMs < endMs; currentMs += stepMs) {
    yield currentMs;
  }

  return endMs;
}

/**
 * @param {number} baseTime
 * @param {number} hastePercent
 * @param {number} minumumTime
 */
export function hastedDuration(baseTime, hastePercent, minumumTime) {
  return Math.max(baseTime / (1 + hastePercent / 100), minumumTime);
}
