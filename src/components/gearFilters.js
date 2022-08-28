import { h } from "https://cdn.pika.dev/preact";
import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

/**
 * @typedef Props
 * @property {string} sourceFilter
 * @property {(v: string) => void} onSourceFilterChanged
 * @property {number} latestPhase
 * @property {(v: number) => void} onLatestPhaseChanged
 * @property {boolean} showObsolete
 * @property {(v: boolean) => void} onShowObsoleteChanged
 * @property {boolean} debugStats
 * @property {(v: boolean) => void} onDebugStatsChanged
 */

/**
 * @param {Props} props
 */
export default function GearFilters(props) {
  return html`
    <label>
      <i data-feather="filter"></i> Source Filter:
      <input type="text"
        onChange=${(/** @type {Event} */ ev) => props.onSourceFilterChanged((/** @type {HTMLInputElement} */ (ev.target)).value)}
        value=${props.sourceFilter}
      ></input>
    </label>
    <label>
      Phase:
      <select
        onChange=${(/** @type {Event} */ ev) => props.onLatestPhaseChanged(parseInt((/** @type {HTMLSelectElement} */ (ev.target)).value))}
        value=${props.latestPhase}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </label>
    <label>
      Show obsoleted gear:
      <input
        type="checkbox"
        onChange=${(/** @type {Event} */ ev) => props.onShowObsoleteChanged((/** @type {HTMLInputElement} */ (ev.target)).checked)}
        checked=${props.showObsolete}
      ></input>
    </label>
    <label>
      Debug stats:
      <input
        type="checkbox"
        onChange=${(/** @type {Event} */ ev) => props.onDebugStatsChanged((/** @type {HTMLInputElement} */ (ev.target)).checked)}
        checked=${props.debugStats}
      ></input>
    </label>
  `;
}
