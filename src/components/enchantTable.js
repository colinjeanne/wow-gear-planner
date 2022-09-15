import { h } from "https://cdn.pika.dev/preact";
import { useContext, useLayoutEffect } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import { isItemEquipped, isItemObsolete } from "../characters.js";
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
 * @property {number} latestPhase
 * @property {boolean} showObsolete
 */

/**
 * @param {Props} props
 */
export default function EnchantTable(props) {
  /**
   * @type {() => void}
   */
  const refreshTooltips = useContext(Tooltips);

  useLayoutEffect(refreshTooltips);

  const transformedItems = xforms.slottedItemsToTransformedItems(props.characterData.enchantRanking);

  /** @type {Transform[]} */
  const enchantTransforms = [
    {
      fn: xforms.filterByPhase,
      arguments: [props.latestPhase],
    },
  ];

  const enchants = xforms.applyTransforms(enchantTransforms, transformedItems);
  const rows = enchants.map(item => {
    const isEquipped = isItemEquipped(item.id, item.item.slot, props.characterData);
    const isObsolete = !isEquipped && isItemObsolete(item.id, item.item.slot, props.characterData);
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

    const row = html`
      <tr key=${item.id} class=${classList}>
        <td>
          <a href=${`https://www.wowhead.com/wotlk/item=${item.id}`}></a>
        </td>
        <td>${item.rank}</td>
        <td>${slots[item.item.slot]}</td>
        <td>${item.item.source}</td>
        <td>${item.note}</td>
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
          <th>Source</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
