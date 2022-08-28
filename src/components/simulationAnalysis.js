import { h } from "https://cdn.pika.dev/preact";
import { useContext, useLayoutEffect } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import Tooltips from "./tooltipContext.js";
import { analyzeHealthAndManaEffects } from "../sim.js";

/**
 * @typedef { import("../types.js").Entity } Entity
 * @typedef { import("../types.js").Event } Event
 */

const html = htm.bind(h);

/**
 * @typedef Props
 * @property {Entity} entity
 * @property {Event[]} events
 * @property {number} simulationLengthMs
 */

/**
 * @param {Props} props
 */
export default function SimulationAnalysis(props) {
  /**
   * @type {() => void}
   */
  const refreshTooltips = useContext(Tooltips);

  useLayoutEffect(refreshTooltips);

  const healthAndManaEffects = analyzeHealthAndManaEffects(props.entity, props.events);

  /** @type {unknown[]} */
  const analysisRows = [];

  for (const [spellId, analytics] of healthAndManaEffects.spellAnalytics.entries()) {
    analysisRows.push(html`
      <tr key=${spellId}>
        <td>
          <a href=${`https://tbc.wowhead.com/spell=${spellId}`}></a>
        </td>
        <td>${analytics.castCount}</td>
        <td>${analytics.manaChange}</td>
        <td>${analytics.healthChange.toFixed(0)}</td>
        <td>${(analytics.healthChange * 100 / healthAndManaEffects.totalHealthChange).toFixed(2)}%</td>
        <td>${(analytics.healthChange * 1000 / props.simulationLengthMs).toFixed(2)}</td>
        <td>${(analytics.manaChange * 1000 / props.simulationLengthMs).toFixed(2)}</td>
        <td>${(analytics.healthChange / analytics.manaChange).toFixed(2)}</td>
      </tr>
    `);
  }

  return html`
    <div class="simulation-analysis">
      <table>
        <thead>
          <tr>
            <th>Spell</th>
            <th>Casts</th>
            <th>Mana Change</th>
            <th>Health Change</th>
            <th>Health Change %</th>
            <th>HPS/DPS</th>
            <th>MPS Cost</th>
            <th>HPM</th>
          </tr>
        </thead>
        <tbody>
          ${analysisRows}
          <tr>
            <td>
              Total
            </td>
            <td>${healthAndManaEffects.totalCasts}</td>
            <td>${healthAndManaEffects.totalManaChange}</td>
            <td>${healthAndManaEffects.totalHealthChange.toFixed(0)}</td>
            <td>100%</td>
            <td>${(healthAndManaEffects.totalHealthChange * 1000 / props.simulationLengthMs).toFixed(2)}</td>
            <td>${(healthAndManaEffects.totalManaChange * 1000 / props.simulationLengthMs).toFixed(2)}</td>
            <td>${(healthAndManaEffects.totalHealthChange / healthAndManaEffects.totalManaChange).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
