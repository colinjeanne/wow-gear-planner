import { getSpellData } from "../databases.js";

/**
 * @typedef {import("../characters.js").CharacterData} CharacterData
 * @typedef {import("../characters.js").DruidClass} DruidClass
 * @typedef {import("../types.js").Aura} Aura
 * @typedef {import("../types.js").ClassAndSpecStrategy} ClassAndSpecStrategy
 * @typedef {import("../types.js").CooldownTracker} CooldownTracker
 * @typedef {import("../types.js").Entity} Entity
 * @typedef {import("../types.js").EventAction} EventAction
 * @typedef {import("../types.js").SimulationStrategy} SimulationStrategy
 * @typedef {import("../types.js").SpellName} SpellName
 * @typedef {import("../types.js").StatData} StatData
 */

const lifebloomId = getSpellData("Lifebloom").id;
const regrowthSpell = getSpellData("Regrowth");
const rejuvenationId = getSpellData("Rejuvenation").id;
const essenceOfTheMartyr = getSpellData("Essence of the Martyr").id;
const hoppedUp = getSpellData("Hopped Up").id;

/** @implements {SimulationStrategy} */
class SingleTargetHealingStrategy {
  name = "Single Target Healing"

  /**
   * @param {Entity} self
   * @param {Entity[]} targets
   * @param {CooldownTracker} cooldowns
   * @returns {EventAction}
   */
  onSimulationEvent(self, targets, cooldowns) {
    const target = targets[0];
    const lifebloom = target.getExistingAura(lifebloomId, self, "PeriodicAura");
    const regrowth = target.getExistingAura(regrowthSpell.id, self, "PeriodicAura");
    const rejuvenation = target.getExistingAura(rejuvenationId, self, "PeriodicAura");

    if (cooldowns.isOnGCD() || cooldowns.isCasting()) {
      return {
        type: "Continue",
      };
    }

    if (
      self.isOnUseAvailable("Essence of the Martyr") &&
      !cooldowns.isOnCooldown("Essence of the Martyr") &&
      !self.getExistingAura(hoppedUp, self, "ModifyStatsAura")
    ) {
      return {
        type: "Cast",
        spellName: "Essence of the Martyr",
        target: self,
      };
    }

    if (
      self.isOnUseAvailable("Hopped Up") &&
      !cooldowns.isOnCooldown("Hopped Up") &&
      !self.getExistingAura(essenceOfTheMartyr, self, "ModifyStatsAura")
    ) {
      return {
        type: "Cast",
        spellName: "Hopped Up",
        target: self,
      };
    }

    if (!lifebloom || lifebloom.currentStacks < 3 || lifebloom.remainingTimeMs() < 1500) {
      return {
        type: "Cast",
        spellName: "Lifebloom",
        target,
      };
    }

    const regrowthCastTimeMs = self.getSpellCastTimeMs(regrowthSpell);
    if (!regrowth || regrowth.remainingTimeMs() <= regrowthCastTimeMs) {
      return {
        type: "Cast",
        spellName: "Regrowth",
        target,
      };
    }

    if (!rejuvenation) {
      return {
        type: "Cast",
        spellName: "Rejuvenation",
        target,
      };
    }

    return {
      type: "Continue",
    };
  }
}

/** @implements {ClassAndSpecStrategy} */
export class RestoDruidStrategy {
  /** @type {Readonly<StatData>} */
  baseStats = {
    STRENGTH: 73,
    AGILITY: 75,
    STAMINA: 82,
    INTELLECT: 120,
    SPIRIT: 133,
    MAX_HEALTH: 3434,
    MAX_MANA: 2370,
    CRIT_SPELL_PERCENT: 1.85,
  };

  /** @type {SpellName[]} */
  relevantSpells = [
    "Lifebloom",
    "Regrowth",
    "Rejuvenation",
    "Healing Touch",
  ];

  simulationStrategies = [
    new SingleTargetHealingStrategy(),
  ];

  /**
   * @param {CharacterData & DruidClass} characterData
   */
  constructor(characterData) {
    this.characterData = characterData;
  }

  getSpellsFromTalents() {
    /** @type {(keyof DruidClass["talents"])[]} */
    const auraTalents = [
      "Empowered Rejuvenation",
      "Gift of Nature",
      "Improved Regrowth",
      "Improved Rejuvenation",
      "Intensity",
      "Living Spirit",
      "Natural Perfection",
      "Tree of Life",
    ];

    return auraTalents.map(talent => {
      if (talent === "Tree of Life") {
        return getSpellData(talent);
      }

      return getSpellData(/** @type {SpellName} */(`${talent} (Rank ${this.characterData.talents[talent]})`));
    });
  }
}
