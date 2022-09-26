import { h } from "https://cdn.pika.dev/preact";
import { useContext, useLayoutEffect } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import { itemSourceDatabase } from "../databases/itemSourceDatabase.js";
import { slots } from "../types.js";
import Tooltips from "./tooltipContext.js";

const html = htm.bind(h);

export default function GearDatabase() {
  /**
   * @type {() => void}
   */
  const refreshTooltips = useContext(Tooltips);

  useLayoutEffect(refreshTooltips);

  const rows = Object.entries(itemSourceDatabase).map(([id, data]) => {
    let requirement = undefined;
    if (data.subItem) {
      requirement = html`<a href=${`https://www.wowhead.com/wotlk/item=${data.subItem}`}></a>`;
    } else if (data.source === "Badges of Justice") {
      requirement = data.cost;
    } else if (data.source === "Quests") {
      requirement = html`<a href=${`https://www.wowhead.com/wotlk/quest=${data.quest}`}></a>`;
    }

    const row = html`
      <tr key=${id}>
        <td>
          <a href=${`https://www.wowhead.com/wotlk/item=${id}`}></a>
        </td>
        <td>${slots[data.slot]}</td>
        <td>${requirement}</td>
        <td>${data.source}</td>
        <td>${data.source === "Instance" ? data.boss : undefined}</td>
      </tr>
    `;

    return row;
  });

  return html`
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Slot</th>
          <th>Requirement</th>
          <th>Source</th>
          <th>Boss</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
