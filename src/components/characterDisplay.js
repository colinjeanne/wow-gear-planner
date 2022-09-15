import { h } from "https://cdn.pika.dev/preact";
import htm from "https://unpkg.com/htm?module";

import EnchantTable from "./enchantTable.js";
import GearTable from "./gearTable.js";

/**
 * @typedef { import("../characters.js").CharacterData } CharacterData
 */

const html = htm.bind(h);

/**
 * @typedef Props
 * @property {CharacterData} characterData
 * @property {string} sourceFilter
 * @property {number} latestPhase
 * @property {boolean} showObsolete
 */

/**
 * @param {Props} props
 */
export default function CharacterDisplay(props) {
  const notes = props.characterData.notes.map(
    note => html`<li key=${note}>${note}</li>`
  );

  const links = props.characterData.links.map(
    ({ href, text }) => html`
      <li key=${href}>
        <a href=${href}>${text}</a>
      </li>
    `
  );

  return html`
    <section>
      <ul>${notes}</ul>
      <ul>${links}</ul>
      <${GearTable}
        characterData=${props.characterData}
        sourceFilter=${props.sourceFilter}
        latestPhase=${props.latestPhase}
        showObsolete=${props.showObsolete}
      />
      <${EnchantTable}
        characterData=${props.characterData}
        latestPhase=${props.latestPhase}
        showObsolete=${props.showObsolete}
      />
    </section>
  `;
}
