import { h } from "https://cdn.pika.dev/preact";
import { useContext, useLayoutEffect } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import { isItemEquipped, isItemObsolete } from "../characters.js";
import { getGearData } from "../databases.js";
import * as xforms from "../itemListTransformations.js";
import { slots } from "../types.js";
import Tooltips from "./tooltipContext.js";

/**
 * @typedef { import("../characters.js").CharacterData } CharacterData
 * @typedef { import("../itemListTransformations").Transform } Transform
 * @typedef { import("../itemListTransformations").TransformedItem } TransformedItem
 */

const html = htm.bind(h);

/**
 * @typedef Props
 * @property {CharacterData} characterData
 * @property {string} sourceFilter
 * @property {number} latestPhase
 * @property {boolean} showObsolete
 * @property {boolean} debugStats
 */

/**
 * @param {Props} props
 */
export default function GearTable(props) {
  /**
   * @type {() => void}
   */
  const refreshTooltips = useContext(Tooltips);

  useLayoutEffect(refreshTooltips);

  const transformedItems = xforms.slottedItemsToTransformedItems(props.characterData.gearRanking);

  /** @type {Transform[]} */
  const gearTransforms = [
    {
      fn: xforms.filterByPhase,
      arguments: [props.latestPhase],
    },
    {
      fn: xforms.filterBySource,
      arguments: [props.sourceFilter],
    },
    {
      fn: xforms.sortBySource,
      arguments: [],
    },
  ];

  const gear = xforms.applyTransforms(gearTransforms, transformedItems);
  const rows = gear.map(item => {
    const isEquipped = isItemEquipped(item.id, item.item.slot, props.characterData);
    const isObsolete = isItemObsolete(item.id, item.item.slot, props.characterData);
    if (!props.showObsolete && (isEquipped || isObsolete)) {
      return undefined;
    }

    const classList = [];
    if (isEquipped) {
      classList.push("equipped");
    }

    if (isObsolete) {
      classList.push("obsolete");
    }

    let gemsData = "";
    if (isEquipped && props.characterData.equippedGems[item.item.slot]) {
      gemsData = `&gems=${(props.characterData.equippedGems[item.item.slot] || []).join(":")}`;
    }

    let requirement = undefined;
    if (item.item.subItem) {
      requirement = html`<a href=${`https://tbc.wowhead.com/item=${item.item.subItem}`}></a>`;
    } else if (item.item.source === "Badges of Justice") {
      requirement = item.item.cost;
    } else if (item.item.source === "Quests") {
      requirement = html`<a href=${`https://tbc.wowhead.com/quest=${item.item.quest}`}></a>`;
    }

    const stats = getGearData(item.id);

    const row = html`
      <tr key=${item.id} class=${classList}>
        <td>
          <a href=${`https://tbc.wowhead.com/item=${item.id}${gemsData}`}></a>
        </td>
        <td>${item.rank}</td>
        <td>${slots[item.item.slot]}</td>
        <td>${requirement}</td>
        <td>${item.item.source}</td>
        <td>${item.item.boss}</td>
        <td>${item.note}</td>
        <td hidden=${!props.debugStats}>${stats ? JSON.stringify(stats) : undefined}</td>
      </tr>
    `;

    return row;
  });

  return html`
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Rank</th>
          <th>Slot</th>
          <th>Requirement</th>
          <th>Source</th>
          <th>Boss</th>
          <th>Note</th>
          <th hidden=${!props.debugStats}>Stats</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
