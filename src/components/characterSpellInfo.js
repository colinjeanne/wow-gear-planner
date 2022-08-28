import { h } from "https://cdn.pika.dev/preact";
import { useContext, useLayoutEffect } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import { getSpellData } from "../databases.js";
import { makeGenericTarget } from "../classes/entity.js";
import Tooltips from "./tooltipContext.js";

/**
 * @typedef { ReturnType<import("../classes/entity.js").getEntityFromCharacterData> } Entity
 * @typedef { import("../types.js").SpellName } SpellName
 */

const html = htm.bind(h);

/**
 * @typedef Props
 * @property {Entity} entity
 * @property {Set<SpellName>} selfAuras
 * @property {Set<SpellName>} targetAuras
 */

/**
 * @param {Props} props
 */
export default function CharacterSpellInfo(props) {
  /**
   * @type {() => void}
   */
  const refreshTooltips = useContext(Tooltips);

  useLayoutEffect(refreshTooltips);

  const target = makeGenericTarget(props.targetAuras);
  const spells = props.entity.strategy.relevantSpells.map(spellName => {
    const spell = getSpellData(spellName);
    const spellEffectResults = props.entity.getSpellResults(spell, target);
    return html`
      <tr key=${spellName}>
        <td>
          <a href=${`https://tbc.wowhead.com/spell=${spell.id}`}></a>
        </td>
        <td>
          ${spellEffectResults.length > 0 && JSON.stringify(spellEffectResults[0])}
        </td>
        <td>
          ${spellEffectResults.length > 1 && JSON.stringify(spellEffectResults[1])}
        </td>
      </tr>
    `
  });

  return html`
    <table>
      <thead>
        <tr>
          <td>Spell</td>
          <td>Effect 1</td>
          <td>Effect 2</td>
        </tr>
      </thead>
      <tbody>
        ${spells}
      </tbody>
    </table>
  `;
}
