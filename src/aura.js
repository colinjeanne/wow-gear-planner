import { getSpellData } from "./databases.js";
import { getHealthChange, isMagicDamage } from "./effects.js";
import { hastedDuration } from "./time.js";
import { mergeStatData } from "./types.js";

/**
 * @typedef {import("./types.js").ApplyAuraEffect} ApplyAuraEffect
 * @typedef {import("./types.js").Aura} Aura
 * @typedef {import("./types.js").AuraDefinition} AuraDefinition
 * @typedef {import("./types.js").Effect} Effect
 * @typedef {import("./types.js").Entity} Entity
 * @typedef {import("./types.js").Event} Event
 * @typedef {import("./types.js").PeriodicAura} PeriodicAuraDefinition
 * @typedef {import("./types.js").School} School
 * @typedef {import("./types.js").Spell} Spell
 * @typedef {import("./types.js").SpellFactors} SpellFactors
 * @typedef {import("./types.js").SpellName} SpellName
 * @typedef {import("./types.js").Stat} Stat
 * @typedef {import("./types.js").StatData} StatData
 */

/**
 * @template {Partial<StatData>} T
 * @param {T} stats
 * @param {number} value
 * @param {Stat[]=} includeOnly
 */
function multiplyStatsByValue(stats, value, includeOnly) {
  if (!includeOnly) {
    includeOnly = /** @type {Stat[]} */ (Object.keys(stats));
  }

  const updatedStats = { ...stats };
  for (const stat of includeOnly) {
    updatedStats[stat] = Math.floor((stats[stat] || 0) * value);
  }

  return updatedStats;
}

class BaseAura {
  /**
   * @param {AuraDefinition["type"]} type
   * @param {number} maximumStacks
   */
  constructor(type, maximumStacks) {
    this.type = type;
    this.maximumStacks = maximumStacks;
    this.currentStacks = 1;
  }

  addStack() {
    this.currentStacks = Math.min(this.currentStacks + 1, this.maximumStacks);
  }

  /**
   * @param {Spell} spell
   */
  applyToSpell(spell) {
    return spell;
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    return spellFactors;
  }

  allowedCombatManaRegen() {
    return 0;
  }

  manaRegenFactor() {
    return 1;
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  addToStatData(statData) {
    return statData;
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  multiplyWithStatData(statData) {
    return statData;
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  multiplyByPercentOfStat(statData) {
    return statData;
  }

  /**
   * @returns {Event[]}
   */
  dispell() {
    return [];
  }

  /**
   * @param {Event} event
   * @returns {Event[]}
   */
  onEvent(event) {
    return [];
  }
}

class PeriodicAura extends BaseAura {
  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {Entity} caster
   * @param {Entity} target
   * @param {number} startTimeMs
   */
  constructor(spell, effectIndex, caster, target, startTimeMs) {
    const effect = spell.effects[effectIndex];
    if (effect.type !== "ApplyAura") {
      throw new Error("Expected apply aura effect");
    }

    if (effect.aura.type !== "PeriodicAura") {
      throw new Error("Expected periodic aura effect");
    }

    const spellFactorsForEffects = caster.getSpellFactorsForEffects(spell, target);
    const spellFactors = spellFactorsForEffects[effectIndex];

    if (!spellFactors) {
      throw new Error("Missing spell factors");
    }

    super("PeriodicAura", effect.aura.maximumStacks);

    this.spell = spell;
    this.caster = caster;
    this.target = target;
    this.effectIndex = effectIndex;
    this.effect = effect;
    this.startTimeMs = startTimeMs;
    this.periodMs = this.getPeriodMs();
    this.spellFactors = spellFactors;

    this.nextTickMs = this.startTimeMs + this.periodMs;
  }

  getPeriodMs() {
    if (this.effect.aura.type !== "PeriodicAura") {
      throw new Error("Expected periodic aura effect");
    }

    const hastePercent = this.caster.stats.HASTE_SPELL_PERCENT || 0;
    let periodMs = this.effect.aura.periodMs;
    if (this.spell.castTimeMs === "Channeled") {
      periodMs = hastedDuration(periodMs, hastePercent, 0);
    }

    return periodMs;
  }

  /**
   * @param {Event} event
   * @returns {Event[]}
   */
  onEvent(event) {
    /** @type {Event[]} */
    const events = [];

    switch (event.type) {
      case "TimeChangeEvent":
        if (event.currentTimeMs >= this.nextTickMs) {
          const healthChange = getHealthChange(this.spell.effects[this.effectIndex], this.spellFactors);
          events.push({
            caster: this.caster,
            target: this.target,
            spell: this.spell,
            effectIndex: this.effectIndex,
            currentTimeMs: event.currentTimeMs,
            type: "HealthChangeEvent",
            expected: this.currentStacks * healthChange.expected,
            base: this.currentStacks * healthChange.base,
            crit: this.currentStacks * healthChange.crit,
          });
          this.nextTickMs += this.periodMs;
        }
        break;
    }
    return events;
  }
}

class ModifyStatsAura extends BaseAura {
  /**
   * @param {Partial<StatData>} addedStats
   * @param {number} maximumStacks
   */
  constructor(addedStats, maximumStacks) {
    super("ModifyStatsAura", maximumStacks);

    this.addedStats = addedStats;
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  addToStatData(statData) {
    const finalStats = multiplyStatsByValue(this.addedStats, this.currentStacks);
    return mergeStatData(statData, finalStats);
  }
}

class ModifyStatsPercentAura extends BaseAura {
  /**
   * @param {number} value
   * @param {Stat[]} affectedStats
   */
  constructor(value, affectedStats) {
    super("ModifyStatsPercentAura", 1);

    this.value = value;
    this.affectedStats = affectedStats;
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  multiplyWithStatData(statData) {
    return multiplyStatsByValue(statData, 1 + this.value / 100, this.affectedStats);
  }
}

class ModifyStatsByPercentOfStatAura extends BaseAura {
  /**
   * @param {number} value
   * @param {Stat} stat
   * @param {Stat[]} affectedStats
   */
  constructor(value, stat, affectedStats) {
    super("ModifyStatsByPercentOfStatAura", 1);

    this.value = value;
    this.stat = stat;
    this.affectedStats = affectedStats;
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  multiplyByPercentOfStat(statData) {
    const factor = (statData[this.stat] || 0) * this.value / 100;

    /** @type {Partial<StatData>} */
    const statModification = {};
    for (const stat of this.affectedStats) {
      statModification[stat] = factor;
    }

    return mergeStatData(statData, statModification);
  }
}

class ModifySpellEffectivenessAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifySpellEffectivenessAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   */
  applyToSpell(spell) {
    if (!this.affectedSpells.has(spell.id)) {
      return spell;
    }

    for (const effect of spell.effects) {
      if (effect.type === "ApplyAura" && effect.aura.type === "ModifyStatsAura") {
        effect.aura.addedStats = multiplyStatsByValue(effect.aura.addedStats, 1 + this.value / 100);
      }
    }

    return spell;
  }
}

class ModifySpellEffectValueAura extends BaseAura {
  /**
   * @param {number} effectIndex
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(effectIndex, value, affectedSpells) {
    super("ModifySpellEffectValueAura", 1);

    this.effectIndex = effectIndex;
    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   */
  applyToSpell(spell) {
    if (!this.affectedSpells.has(spell.id)) {
      return spell;
    }

    if (spell.effects.length <= this.effectIndex) {
      throw new Error("Effect index out of range");
    }

    const effect = spell.effects[this.effectIndex];
    if (effect.type !== "ApplyAura") {
      throw new Error("Invalid effect");
    }

    effect.aura.value = this.value;

    return spell;
  }
}

class ModifyPercentSpellDamageTakenAura extends BaseAura {
  /**
   * @param {number} value
   * @param {School[]} schools
   */
  constructor(value, schools) {
    super("ModifyPercentSpellDamageTakenAura", 1);

    this.value = value;
    this.schools = schools;
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    if (!this.schools.includes(spell.school)) {
      return spellFactors;
    }

    if (spell.effects.length <= effectIndex) {
      throw new Error("Effect index out of range");
    }

    const effect = spell.effects[effectIndex];
    if (!isMagicDamage(effect)) {
      return spellFactors;
    }

    return {
      ...spellFactors,
      overallMultiplier: spellFactors.overallMultiplier * (1 + this.value / 100),
    };
  }
}

class ModifyPercentSpellDamageDoneAura extends BaseAura {
  /**
   * @param {number} value
   * @param {School[]} schools
   */
  constructor(value, schools) {
    super("ModifyPercentSpellDamageDoneAura", 1);

    this.value = value;
    this.schools = schools;
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    if (!this.schools.includes(spell.school)) {
      return spellFactors;
    }

    if (spell.effects.length <= effectIndex) {
      throw new Error("Effect index out of range");
    }

    const effect = spell.effects[effectIndex];
    if (!isMagicDamage(effect)) {
      return spellFactors;
    }

    return {
      ...spellFactors,
      overallMultiplier: spellFactors.overallMultiplier * (1 + this.value / 100),
    };
  }
}

class ModifyPowerCostAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifyPowerCostAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   */
  applyToSpell(spell) {
    if (!this.affectedSpells.has(spell.id)) {
      return spell;
    }

    spell.cost *= (1 + this.value / 100);

    return spell;
  }
}

class ModifyCooldownAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifyCooldownAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   */
  applyToSpell(spell) {
    if (!this.affectedSpells.has(spell.id)) {
      return spell;
    }

    spell.cooldownMs += this.value;

    return spell;
  }
}

class ModifyDurationAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifyDurationAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   */
  applyToSpell(spell) {
    if (!this.affectedSpells.has(spell.id)) {
      return spell;
    }

    spell.durationMs += this.value;

    return spell;
  }
}

class ModifySpellCritPercentAura extends BaseAura {
  /**
   * @param {number} value
   */
  constructor(value) {
    super("ModifySpellCritPercentAura", 1);

    this.value = value;
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  addToStatData(statData) {
    /** @type {Partial<StatData>} */
    const critStats = {
      CRIT_SPELL_PERCENT: this.value,
    };

    return mergeStatData(statData, critStats);
  }
}

class ModifyCritChanceAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifyCritChanceAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    if (!this.affectedSpells.has(spell.id)) {
      return spellFactors;
    }

    return {
      ...spellFactors,
      critChance: spellFactors.critChance + this.value / 100,
    };
  }
}

class ModifyHitChanceAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifyHitChanceAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    if (!this.affectedSpells.has(spell.id)) {
      return spellFactors;
    }

    return {
      ...spellFactors,
      hitChance: spellFactors.hitChance + this.value,
    };
  }
}

class ModifySpellPowerAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifySpellPowerAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    if (!this.affectedSpells.has(spell.id)) {
      return spellFactors;
    }

    return {
      ...spellFactors,
      bonus: spellFactors.bonus * (1 + this.value / 100),
    };
  }
}

class ModifyDamageHealingDoneAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifyDamageHealingDoneAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    if (!this.affectedSpells.has(spell.id)) {
      return spellFactors;
    }

    const effect = spell.effects[effectIndex];
    if (effect.type !== "Immediate") {
      return spellFactors;
    }

    return {
      ...spellFactors,
      overallMultiplier: spellFactors.overallMultiplier + this.value / 100,
    };
  }
}

class ModifyPeriodicDamageHealingDoneAura extends BaseAura {
  /**
   * @param {number} value
   * @param {SpellName[]} affectedSpells
   */
  constructor(value, affectedSpells) {
    super("ModifyDamageHealingDoneAura", 1);

    this.value = value;
    this.affectedSpells = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    if (!this.affectedSpells.has(spell.id)) {
      return spellFactors;
    }

    const effect = spell.effects[effectIndex];
    if (effect.type !== "ApplyAura" || effect.aura.type !== "PeriodicAura") {
      return spellFactors;
    }

    return {
      ...spellFactors,
      overallMultiplier: spellFactors.overallMultiplier + this.value / 100,
    };
  }
}

class AllowPercentOfManaRegenInCombatAura extends BaseAura {
  /**
   * @param {number} value
   */
  constructor(value) {
    super("AllowPercentOfManaRegenInCombatAura", 1);

    this.value = value;
  }

  allowedCombatManaRegen() {
    return this.value / 100;
  }
}

class ModifyManaRegenPercentAura extends BaseAura {
  /**
   * @param {number} value
   */
  constructor(value) {
    super("ModifyManaRegenPercentAura", 1);

    this.value = value;
  }

  manaRegenFactor() {
    return this.value / 100;
  }
}

class ManaRegenAura extends BaseAura {
  /**
   * @param {number} value
   */
  constructor(value) {
    super("ManaRegenAura", 1);

    this.value = value;
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  addToStatData(statData) {
    /** @type {Partial<StatData>} */
    const mp5Stats = {
      MP5: this.value,
    };

    return mergeStatData(statData, mp5Stats);
  }
}

class ProcTriggerSpellAura extends BaseAura {
  /**
   * @param {Entity} self
   * @param {number} targetMinimumHealthPercent
   * @param {number} auraProcChance
   * @param {SpellName} spellName
   * @param {SpellName[]=} affectedSpells
   */
  constructor(self, targetMinimumHealthPercent, auraProcChance, spellName, affectedSpells) {
    super("ProcTriggerSpellAura", 1);

    affectedSpells ??= [];

    this.self = self;
    this.targetMinimumHealthPercent = targetMinimumHealthPercent;
    this.auraProcChance = auraProcChance;
    this.spell = getSpellData(spellName);
    this.affectedSpellIds = new Set(affectedSpells.map(spellName => getSpellData(spellName).id));

    // Set the last proc time such that we don't need to wait for an entire
    // cooldown before this can proc for the first time
    this.lastProcMs = -this.spell.cooldownMs;

    if (this.auraProcChance === 100) {
      this.procOnCount = 1;
    } else {
      // This calculates an approximately 50% chance that the proc will have happened
      this.procOnCount = Math.ceil(
        Math.log(0.5) /
        Math.log((100 - this.auraProcChance) / 100)
      );
    }

    this.currentCount = 0;
  }

  /**
   * @param {number} currentTimeMs
   */
  isOnCooldown(currentTimeMs) {
    return currentTimeMs - this.lastProcMs < this.spell.cooldownMs;
  }

  /**
   * @param {Event} event
   */
  onEvent(event) {
    /** @type {Event[]} */
    const events = [];

    if (
      event.type === "CastCompletedEvent" &&
      event.caster === this.self &&
      !this.isOnCooldown(event.currentTimeMs) &&
      (
        this.affectedSpellIds.size === 0 ||
        this.affectedSpellIds.has(event.spell.id)
      )
    ) {
      const targetMaxHealth = event.target.stats.MAX_HEALTH || 1;
      const targetHealth = event.target.health;
      const targetHealthPercent = targetHealth * 100 / targetMaxHealth;

      ++this.currentCount;
      if (
        this.currentCount >= this.procOnCount &&
        targetHealthPercent <= this.targetMinimumHealthPercent
      ) {
        this.lastProcMs = event.currentTimeMs;
        this.currentCount = 0;

        const castedSpell = this.self.startCastingSpell(this.spell);

        events.push({
          type: "CastStartedEvent",
          caster: this.self,
          target: this.self,
          spell: castedSpell,
          currentTimeMs: event.currentTimeMs,
        });
        events.push({
          type: "CastCompletedEvent",
          caster: this.self,
          target: this.self,
          spell: castedSpell,
          currentTimeMs: event.currentTimeMs,
        });
        events.push(...this.self.castSpell(castedSpell, this.self, event.currentTimeMs));
      }
    }

    return events;
  }
}

class LifebloomAura extends PeriodicAura {
  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {Entity} caster
   * @param {Entity} target
   * @param {number} startTimeMs
   */
  constructor(spell, effectIndex, caster, target, startTimeMs) {
    super(spell, effectIndex, caster, target, startTimeMs);

    const bloomEffect = this.spell.effects[1];
    if (bloomEffect.type !== "LifebloomBloom") {
      throw new Error("Lifebloom aura created without Lifebloom spell");
    }

    this.bloomEffect = bloomEffect;

    const spellFactorsForEffects = caster.getSpellFactorsForEffects(spell, target);
    const spellFactors = spellFactorsForEffects[1];

    if (!spellFactors) {
      throw new Error("Missing spell factors");
    }

    this.bloomSpellFactors = spellFactors;
  }

  addStack() {
    super.addStack();

    const spellFactorsForEffects = this.caster.getSpellFactorsForEffects(this.spell, this.target);
    const spellFactors = spellFactorsForEffects[1];

    if (!spellFactors) {
      throw new Error("Missing spell factors");
    }

    this.bloomSpellFactors = spellFactors;
  }

  /**
   * @param {Event} event
   * @returns {Event[]}
   */
  onEvent(event) {
    if (event.type === "ExpireAuraEvent") {
      return [
        {
          caster: this.caster,
          target: this.target,
          spell: this.spell,
          effectIndex: 1,
          currentTimeMs: event.currentTimeMs,
          type: "HealthChangeEvent",
          ...getHealthChange(this.bloomEffect, this.bloomSpellFactors),
        }
      ];
    }

    return super.onEvent(event);
  }
}

/**
 * @implements {Aura}
 */
class AuraImpl {
  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {Entity} caster
   * @param {Entity} target
   * @param {number} startTimeMs
   * @param {BaseAura} baseImpl
   */
  constructor(spell, effectIndex, caster, target, startTimeMs, baseImpl) {
    const effect = spell.effects[effectIndex];
    if (effect.type !== "ApplyAura") {
      throw new Error("Expected apply aura effect");
    }

    this.spell = spell;
    this.effectIndex = effectIndex;
    this.effect = effect;
    this.caster = caster;
    this.target = target;
    this.type = baseImpl.type;

    const durationMs = this.#getSpellDuration();

    this.canExpire = durationMs > 0;
    this.isDispelled = false;
    this.endTimeMs = startTimeMs + durationMs;
    this.baseImpl = baseImpl;
    this.currentTimeMs = startTimeMs;
    this.maximumStacks = this.baseImpl.maximumStacks;

    const spellFactorsForEffects = caster.getSpellFactorsForEffects(this.spell, this.target);
    this.spellFactors = spellFactorsForEffects[this.effectIndex];
  }

  #getSpellDuration() {
    const hastePercent = this.caster.stats.HASTE_SPELL_PERCENT || 0;
    let durationMs = this.spell.durationMs;
    if (this.spell.castTimeMs === "Channeled") {
      durationMs = hastedDuration(durationMs, hastePercent, 0);
    }

    return durationMs;
  }

  get currentStacks() {
    return this.baseImpl.currentStacks;
  }

  dispell() {
    this.isDispelled = true;
    return this.baseImpl.dispell();
  }

  remainingTimeMs() {
    return this.endTimeMs - this.currentTimeMs;
  }

  isActive() {
    if (this.isDispelled) {
      return false;
    }

    if (!this.canExpire) {
      return true;
    }

    return this.remainingTimeMs() > 0;
  }

  /**
   * @param {number} spellId
   * @param {Entity} caster
   * @param {AuraDefinition["type"]} type
   */
  isSameAura(spellId, caster, type) {
    // TODO: Handle auras that are per-caster (Lifebloom) vs global (Shadow Weaving)
    return spellId === this.spell.id &&
      caster === this.caster &&
      type === this.type;
  }

  /**
   * @param {Entity} caster
   */
  addStack(caster) {
    this.caster = caster;

    const spellFactorsForEffects = caster.getSpellFactorsForEffects(this.spell, this.target);
    this.spellFactors = spellFactorsForEffects[this.effectIndex];
    this.endTimeMs = this.currentTimeMs + this.#getSpellDuration();

    this.baseImpl.addStack();
  }

  /**
   * @param {Spell} spell
   */
  applyToSpell(spell) {
    return this.baseImpl.applyToSpell(spell);
  }

  /**
   * @param {Spell} spell
   * @param {number} effectIndex
   * @param {SpellFactors} spellFactors
   */
  applyToSpellFactors(spell, effectIndex, spellFactors) {
    return this.baseImpl.applyToSpellFactors(spell, effectIndex, spellFactors);
  }

  allowedCombatManaRegen() {
    return this.baseImpl.allowedCombatManaRegen();
  }

  manaRegenFactor() {
    return this.baseImpl.manaRegenFactor();
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  addToStatData(statData) {
    return this.baseImpl.addToStatData(statData);
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  multiplyWithStatData(statData) {
    return this.baseImpl.multiplyWithStatData(statData);
  }

  /**
   * @template {Partial<StatData>} T
   * @param {T} statData
   */
  multiplyByPercentOfStat(statData) {
    return this.baseImpl.multiplyByPercentOfStat(statData);
  }

  /**
   * @param {Event} event
   */
  onEvent(event) {
    /** @type {Event[]} */
    const events = [];

    const isActive = this.isActive();
    if (event.type === "TimeChangeEvent") {
      this.currentTimeMs = event.currentTimeMs;
      if (isActive && !this.isActive()) {
        events.push({
          caster: this.caster,
          target: this.target,
          spell: this.spell,
          effectIndex: this.effectIndex,
          currentTimeMs: this.currentTimeMs,
          type: "ExpireAuraEvent",
          aura: this,
        });
      }
    }

    let shouldHandleEvent = isActive;
    if (event.type === "ExpireAuraEvent" && event.aura === this) {
      shouldHandleEvent = true;
    }

    /** @type {Event[]} */
    const baseEvents = shouldHandleEvent ? this.baseImpl.onEvent(event) : [];

    return [
      ...events,
      ...baseEvents,
    ];
  }
}

/**
 * @param {Spell} spell
 * @param {number} effectIndex
 * @param {Entity} caster
 * @param {Entity} target
 * @param {number} startTimeMs
 * @returns {Aura}
 */
export function makeAura(spell, effectIndex, caster, target, startTimeMs) {
  const effect = spell.effects[effectIndex];
  if (effect.type !== "ApplyAura") {
    throw new Error("Expected apply aura effect");
  }

  let auraImpl;
  if (spell.id === getSpellData("Lifebloom").id) {
    auraImpl = new LifebloomAura(
      spell,
      effectIndex,
      caster,
      target,
      startTimeMs
    );
  } else {
    switch (effect.aura.type) {
      case "PeriodicAura":
        auraImpl = new PeriodicAura(
          spell,
          effectIndex,
          caster,
          target,
          startTimeMs
        );
        break;

      case "ModifyStatsAura":
        auraImpl = new ModifyStatsAura(
          effect.aura.addedStats,
          effect.aura.maximumStacks
        );
        break;

      case "ModifyStatsPercentAura":
        auraImpl = new ModifyStatsPercentAura(
          effect.aura.value,
          effect.aura.affectedStats
        );
        break;

      case "ModifyStatsByPercentOfStatAura":
        auraImpl = new ModifyStatsByPercentOfStatAura(
          effect.aura.value,
          effect.aura.stat,
          effect.aura.affectedStats
        );
        break;

      case "ModifySpellEffectivenessAura":
        auraImpl = new ModifySpellEffectivenessAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ModifySpellEffectValueAura":
        auraImpl = new ModifySpellEffectValueAura(
          effect.aura.effectIndex,
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ModifyPercentSpellDamageTakenAura":
        auraImpl = new ModifyPercentSpellDamageTakenAura(
          effect.aura.value,
          effect.aura.schools
        );
        break;

      case "ModifyPercentSpellDamageDoneAura":
        auraImpl = new ModifyPercentSpellDamageDoneAura(
          effect.aura.value,
          effect.aura.schools
        );
        break;

      case "ModifyPowerCostAura":
        auraImpl = new ModifyPowerCostAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ModifyCooldownAura":
        auraImpl = new ModifyCooldownAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ModifyDurationAura":
        auraImpl = new ModifyDurationAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ModifySpellCritPercentAura":
        auraImpl = new ModifySpellCritPercentAura(effect.aura.value);
        break;

      case "ModifyCritChanceAura":
        auraImpl = new ModifyCritChanceAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "AllowPercentOfManaRegenInCombatAura":
        auraImpl = new AllowPercentOfManaRegenInCombatAura(effect.aura.value);
        break;

      case "ModifyManaRegenPercentAura":
        auraImpl = new ModifyManaRegenPercentAura(effect.aura.value);
        break;

      case "ModifyHitChanceAura":
        auraImpl = new ModifyHitChanceAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ModifySpellPowerAura":
        auraImpl = new ModifySpellPowerAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ModifyDamageHealingDoneAura":
        auraImpl = new ModifyDamageHealingDoneAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ModifyPeriodicDamageHealingDoneAura":
        auraImpl = new ModifyPeriodicDamageHealingDoneAura(
          effect.aura.value,
          effect.aura.affectedSpells
        );
        break;

      case "ManaRegenAura":
        auraImpl = new ManaRegenAura(effect.aura.value);
        break;

      case "ProcTriggerSpellAura":
        auraImpl = new ProcTriggerSpellAura(
          caster,
          effect.aura.value,
          effect.aura.auraProcChance,
          effect.aura.spellName,
          effect.aura.affectedSpells
        );
        break;
    }
  }

  return new AuraImpl(
    spell,
    effectIndex,
    caster,
    target,
    startTimeMs,
    auraImpl
  );
}
