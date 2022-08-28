import { h } from "https://cdn.pika.dev/preact";
import htm from "https://unpkg.com/htm?module";

/**
 * @typedef { import("../types.js").SpellName } SpellName
 */

const html = htm.bind(h);

/**
 * @template T
 * @param {T} item
 * @param {Set<T>} set
 */
function toggleItemInSet(item, set) {
  const updated = new Set(set);
  if (updated.has(item)) {
    updated.delete(item);
  } else {
    updated.add(item);
  }

  return updated;
}

/**
 * @typedef Props
 * @property {SpellName[]} spellNames
 * @property {Set<SpellName>} selectedSpellNames
 * @property {(selectedSpellNames: Set<SpellName>) => void} onChange
 */

/**
 * @param {Props} props
 */
export default function AuraSelection(props) {
  const spells = props.spellNames.map(spellName => html`
    <li key=${spellName}>
      <label>
        <input
          type="checkbox"
          checked=${props.selectedSpellNames.has(spellName)}
          onClick=${() => props.onChange(toggleItemInSet(spellName, props.selectedSpellNames))}
        />
        ${spellName}
      </label>
    </li>
  `);

  return html`
    <section class="buff-selection">
      <ul>${spells}</ul>
    </section>
  `;
}
