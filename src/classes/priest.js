import { getSpellData } from "../databases.js";

/**
 * @typedef {import("../characters.js").CharacterData} CharacterData
 * @typedef {import("../characters.js").PriestClass} PriestClass
 * @typedef {import("../types.js").Aura} Aura
 * @typedef {import("../types.js").ClassAndSpecStrategy} ClassAndSpecStrategy
 * @typedef {import("../types.js").CooldownTracker} CooldownTracker
 * @typedef {import("../types.js").Entity} Entity
 * @typedef {import("../types.js").EventAction} EventAction
 * @typedef {import("../types.js").SimulationStrategy} SimulationStrategy
 * @typedef {import("../types.js").SpellName} SpellName
 * @typedef {import("../types.js").StatData} StatData
 */

/** @implements {ClassAndSpecStrategy} */
export class ShadowPriestStrategy {
  /** @type {Readonly<StatData>} */
  baseStats = {
    STRENGTH: 36,
    AGILITY: 50,
    STAMINA: 57,
    INTELLECT: 145,
    SPIRIT: 151,
    MAX_HEALTH: 3211,
    MAX_MANA: 2620,
    CRIT_SPELL_PERCENT: 1.24,
  };

  /** @type {SpellName[]} */
  relevantSpells = [
    "Mindflay",
    "Shadow Word: Pain",
    "Mind Blast",
    "Starshards",
    "Shadow Word: Death",
    "Vampiric Touch",
  ];

  /** @type {SimulationStrategy[]} */
  simulationStrategies = [];

  /**
   * @param {CharacterData & PriestClass} characterData
   */
  constructor(characterData) {
    this.characterData = characterData;
  }

  getSpellsFromTalents() {
    /** @type {(keyof PriestClass["talents"])[]} */
    const auraTalents = [
      "Darkness",
      "Focused Mind",
      "Improved Mind Blast",
      "Improved Shadow Word: Pain",
      "Meditation",
      "Shadow Focus",
      "Shadow Power",
    ];

    return auraTalents.map(talent =>
      getSpellData(/** @type {SpellName} */(`${talent} (Rank ${this.characterData.talents[talent]})`))
    );
  }

  /**
   * @param {Entity} self
   * @param {Entity[]} targets
   * @param {CooldownTracker} cooldowns
   * @returns {EventAction}
   */
  onSimulationEvent(self, targets, cooldowns) {
    return {
      type: "Continue",
    };
  }
}
