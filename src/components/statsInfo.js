import { h } from "https://cdn.pika.dev/preact";
import htm from "https://unpkg.com/htm?module";

/**
 * @typedef { import("../classes/entity.js").Entity } Entity
 * @typedef { import("../types.js").SpellName } SpellName
 * @typedef { import("../types.js").Stat } Stat
 * @typedef { import("../types.js").StatData } StatData
 */

const html = htm.bind(h);

/** @type {{ name: string, statList: Stat[] }[]} */
const statLists = [
  {
    name: "Base Stats",
    statList: [
      "STRENGTH",
      "AGILITY",
      "STAMINA",
      "INTELLECT",
      "SPIRIT",
      "ARMOR",
      "MAX_HEALTH",
      "MAX_MANA",
    ],
  },
  {
    name: "Spell",
    statList: [
      "DAMAGE",
      "HOLY_DAMAGE",
      "NATURE_DAMAGE",
      "FROST_DAMAGE",
      "SHADOW_DAMAGE",
      "ARCANE_DAMAGE",
      "HEALING",
      "CRIT_SPELL_PERCENT",
      "CRIT_SPELL_RATING",
      "HIT_SPELL_PERCENT",
      "HIT_SPELL_RATING",
      "HASTE_SPELL_PERCENT",
      "HASTE_SPELL_RATING",
      "MANA_REGEN_NOT_CASTING",
      "MANA_REGEN_CASTING",
      "MP5",
    ],
  },
];

/**
 * @typedef StatListProps
 * @property {string} name
 * @property {Stat[]} statList
 * @property {StatData} statData
 */

/**
 * @param {StatListProps} props
 */
function StatList(props) {
  const rows = props.statList.map(stat => {
    const statValue = props.statData[stat] || 0;
    const roundedValue = Math.round((statValue + Number.EPSILON) * 100) / 100;
    return html`
      <tr key=${stat}>
        <td>${stat}</td>
        <td>${roundedValue}</td>
      </tr>
    `;
  });

  return html`
    <table class="stat-list">
      <thead>
        <tr>
          <th colspan="2">${props.name}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * @typedef Props
 * @property {Entity} entity
 * @property {Set<SpellName>} buffs
 */

/**
 * @param {Props} props
 */
export default function StatsInfo(props) {
  const stats = props.entity.stats;
  return html`
    <div class="stats-info">
      <${StatList}
        ...${statLists[0]}
        statData=${stats}
      />
      <${StatList}
        ...${statLists[1]}
        statData=${stats}
      />
    </div>
  `;
}
