import { h } from "https://cdn.pika.dev/preact";
import { useState } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import { applyBuffsToTarget, getEntityFromCharacterData } from "../classes/entity.js";
import AuraSelection from "./auraSelection.js";
import CharacterSpellInfo from "./characterSpellInfo.js";
import EnchantTable from "./enchantTable.js";
import GearTable from "./gearTable.js";
import Simulation from "./simulation.js";
import StatsInfo from "./statsInfo.js";
import TabbedContainer from "./tabbedContainer.js";

import { sortItemsByWeightedStats } from "../ranking/gearSort.js";

/**
 * @typedef { import("../characters.js").CharacterData } CharacterData
 * @typedef { import("../types.js").SpellName } SpellName
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

/** @type {SpellName[]} */
const selfAuraSpellNames = [
  "Arcane Brilliance",
  "Brilliant Mana Oil",
  "Divine Spirit",
  "Elixir of Draenic Wisdom",
  "Elixir of Healing Power",
  "Flask of Pure Death",
  "Gift of the Wild",
  "Greater Blessing of Kings",
  "Greater Blessing of Wisdom",
  "Improved Blessing of Wisdom",
  "Improved Divine Spirit",
  "Improved Mark of the Wild",
  "Improved Power Word: Fortitude",
  "Inspiring Presence",
  "Prayer of Fortitude",
  "Shadowform",
  "Superior Wizard Oil",
  "Well Fed (23 Spell Damage, 20 Spirit)",
  "Well Fed (44 Healing, 20 Spirit)",
];

/** @type {SpellName[]} */
const targetAuraSpellNames = [
  "Curse of Elements",
  "Misery",
  "Shadow Weaving",
  "Tree of Life",
];

/** @type {SpellName[]} */
const bufferAuraSpellNames = [
  "Improved Divine Spirit",
  "Improved Mark of the Wild",
  "Improved Power Word: Fortitude",
];

/**
 * @param {Props} props
 */
export default function CharacterDisplay(props) {
  /**
   * @type {[Set<SpellName>, (v: Set<SpellName>) => void]}
   */
  const [selectedSelfAuras, setSelectedSelfAuras] = useState(new Set());

  /**
   * @type {[Set<SpellName>, (v: Set<SpellName>) => void]}
   */
  const [selectedTargetAuras, setSelectedTargetAuras] = useState(new Set());

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

  // TODO: Remove
  const items = props.characterData.gearRanking.head || [];
  const ids = items.map(item => item.id);
  /**
   * @typedef {import("../types.js").Stat} Stat
   * @type {Map<Stat, number>}
   */
  const statWeights = new Map([
    ["MP5", 0.1],
    ["INTELLECT", 0.05],
    ["CRIT_SPELL_RATING", 0.05],
    ["SPIRIT", 0.25],
    ["HEALING", 1],
    ["HASTE_SPELL_RATING", 1]
  ]);
  console.log(sortItemsByWeightedStats(ids, statWeights, 23094, 25897))

  const entity = getEntityFromCharacterData(props.characterData);
  applyBuffsToTarget(entity, bufferAuraSpellNames, selectedSelfAuras, 0);

  const tabs = [
    {
      title: "Stats",
      component: html`
        <${StatsInfo}
          entity=${entity}
          buffs=${selectedSelfAuras}
        />
      `,
    },
    {
      title: "Spells",
      component: html`
        <${CharacterSpellInfo}
          entity=${entity}
          selfAuras=${selectedSelfAuras}
          targetAuras=${selectedTargetAuras}
        />
      `,
    },
    {
      title: "Buffs",
      component: html`
        <${AuraSelection}
          spellNames=${selfAuraSpellNames}
          selectedSpellNames=${selectedSelfAuras}
          onChange=${(/** @type Set<SpellName> */ selectedSpellNames) => setSelectedSelfAuras(selectedSpellNames)}
        />
      `,
    },
    {
      title: "Target (De)buffs",
      component: html`
        <${AuraSelection}
          spellNames=${targetAuraSpellNames}
          selectedSpellNames=${selectedTargetAuras}
          onChange=${(/** @type Set<SpellName> */ selectedSpellNames) => setSelectedTargetAuras(selectedSpellNames)}
        />
      `,
    },
    {
      title: "Simulate",
      component: html`
        <${Simulation}
          characterData=${props.characterData}
          entityAuras=${selectedSelfAuras}
          targetAuras=${selectedTargetAuras}
          bufferAuraSpellNames=${bufferAuraSpellNames}
        />
      `,
    },
  ];

  return html`
    <section>
      <ul>${notes}</ul>
      <ul>${links}</ul>
      <${TabbedContainer} tabs=${tabs} defaultSelectedIndex=${0} />
      <${GearTable}
        characterData=${props.characterData}
        sourceFilter=${props.sourceFilter}
        latestPhase=${props.latestPhase}
        showObsolete=${props.showObsolete}
        debugStats=${props.debugStats}
      />
      <${EnchantTable}
        characterData=${props.characterData}
        latestPhase=${props.latestPhase}
        showObsolete=${props.showObsolete}
        debugStats=${props.debugStats}
      />
    </section>
  `;
}
