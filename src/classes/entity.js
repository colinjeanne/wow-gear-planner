import { makeAura } from "../aura.js";
import {
  canCrit,
  cloneSpell,
  getHealthChange,
  getSpMod,
  isHeal,
  isMagicDamage,
  usesSpellFactors
} from "../effects.js";
import { getGearData, getGemData, getItemSet, getSpellData } from "../databases.js";
import { hastedDuration } from "../time.js";
import { mergeStatData } from "../types.js";
import { RestoDruidStrategy } from "./druid.js";
import { ShadowPriestStrategy } from "./priest.js";

/**
 * @typedef {import("../characters.js").CharacterData} CharacterData
 * @typedef {import("../types.js").Aura} Aura
 * @typedef {import("../types.js").AuraDefinition} AuraDefinition
 * @typedef {import("../types.js").CalculatedStatData} CalculatedStatData
 * @typedef {import("../types.js").ClassAndSpecStrategy} ClassAndSpecStrategy
 * @typedef {import("../types.js").CooldownTracker} CooldownTracker
 * @typedef {import("../types.js").Effect} Effect
 * @typedef {import("../types.js").Entity} Entity
 * @typedef {import("../types.js").EntityChangeEvent} EntityChangeEvent
 * @typedef {import("../types.js").Event} Event
 * @typedef {import("../types.js").EventAction} EventAction
 * @typedef {import("../types.js").Gem} Gem
 * @typedef {import("../types.js").Item} Item
 * @typedef {import("../types.js").ItemData} ItemData
 * @typedef {import("../types.js").SimulationStrategy} SimulationStrategy
 * @typedef {import("../types.js").Slot} Slot
 * @typedef {import("../types.js").Spell} Spell
 * @typedef {import("../types.js").SpellFactors} SpellFactors
 * @typedef {import("../types.js").SpellName} SpellName
 * @typedef {import("../types.js").StatData} StatData
 */

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * @param {number[]} sockets
 * @param {Gem[]} gems
 */
function isGemBonusSatisfied(sockets, gems) {
  if (sockets.length !== gems.length) {
    return false;
  }

  for (let index = 0; index < gems.length; ++index) {
    if (!(sockets[index] & gems[index].color)) {
      return false;
    }
  }
  return true;
}

/**
 * @param {Effect[]} effects
 * @returns {Spell}
 */
function dummySpell(effects) {
  return {
    id: 0,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 0,
    school: "PHYSICAL",
    effects,
  };
}

/**
 * @implements {Entity}
 */
class EntityImpl {
  /**
   * @param {CharacterData} characterData
   * @param {ClassAndSpecStrategy} strategy
   */
  constructor(characterData, strategy) {
    this.characterData = characterData;
    this.strategy = strategy;

    /** @type {Aura[]} */
    this.auras = [];
    this.health = 0;
    this.mana = 0;

    /** @type {StatData} */
    this.stats = {
      STRENGTH: 0,
      AGILITY: 0,
      STAMINA: 0,
      INTELLECT: 0,
      SPIRIT: 0,
      MAX_HEALTH: 0,
      MAX_MANA: 0,
    };

    this.reset();
  }

  #getAurasFromTalents() {
    /** @type {Aura[]} */
    const auras = [];
    for (const spell of this.strategy.getSpellsFromTalents()) {
      let effectIndex = 0;
      for (const effect of spell.effects) {
        if (effect.type === "ApplyAura" && effect.aura.type !== "PeriodicAura") {
          auras.push(
            makeAura(
              spell,
              effectIndex,
              this,
              this,
              0
            )
          );
        }

        ++effectIndex;
      }
    }

    return auras;
  }

  #getAurasFromGear() {
    /** @type {Aura[]} */
    const auras = [];

    /** @type {Map<number, number>} */
    const itemSetCounts = new Map();
    for (const [slot, gearIds] of /** @type {[Slot, (number | string)[]][]} */ (Object.entries(this.characterData.equippedGear))) {
      for (const id of gearIds) {
        const gearData = getGearData(id);

        if (gearData.auras) {
          for (const auraDefinition of gearData.auras) {
            if (auraDefinition.type !== "PeriodicAura") {
              /** @type {Effect} */
              const effect = {
                type: "ApplyAura",
                aura: auraDefinition,
              };
              const spell = dummySpell([effect]);
              auras.push(
                makeAura(
                  spell,
                  0,
                  this,
                  this,
                  0
                )
              );
            }
          }
        }

        if (gearData.itemSetId) {
          let currentCount = itemSetCounts.get(gearData.itemSetId);
          if (currentCount === undefined) {
            currentCount = 0;
          }

          ++currentCount;
          itemSetCounts.set(gearData.itemSetId, currentCount);
        }
      }

      const enchants = this.characterData.equippedEnchants[slot];
      if (enchants) {
        for (const id of enchants) {
          const enchantData = getGearData(id);
          if (enchantData.auras) {
            for (const auraDefinition of enchantData.auras) {
              if (auraDefinition.type !== "PeriodicAura") {
                /** @type {Effect} */
                const effect = {
                  type: "ApplyAura",
                  aura: auraDefinition,
                };
                const spell = dummySpell([effect]);
                auras.push(
                  makeAura(
                    spell,
                    0,
                    this,
                    this,
                    0
                  )
                );
              }
            }
          }
        }
      }

      const gemIds = this.characterData.equippedGems[slot];
      if (gemIds) {
        const gemData = gemIds.map(getGemData);
        const gearId = this.characterData.equippedGear[slot]?.[0];
        if (gearId) {
          const gear = getGearData(gearId);
          if (gear.gems) {
            if (isGemBonusSatisfied(gear.gems.sockets, gemData)) {
              /** @type {Effect} */
              const effect = {
                type: "ApplyAura",
                aura: {
                  type: "ModifyStatsAura",
                  addedStats: gear.gems.bonus,
                  value: 0,
                  maximumStacks: 1,
                },
              };
              const spell = dummySpell([effect]);
              auras.push(
                makeAura(
                  spell,
                  0,
                  this,
                  this,
                  0
                )
              );
            }

            for (const gem of gemData) {
              if (gem.auras) {
                for (const auraDefinition of gem.auras) {
                  /** @type {Effect} */
                  const effect = {
                    type: "ApplyAura",
                    aura: auraDefinition,
                  };
                  const spell = dummySpell([effect]);
                  auras.push(
                    makeAura(
                      spell,
                      0,
                      this,
                      this,
                      0
                    )
                  );
                }
              }
            }
          }
        }
      }
    }

    for (const [itemSetId, count] of itemSetCounts) {
      const itemSet = getItemSet(itemSetId);
      for (const setAura of itemSet.auras) {
        if (setAura.requiredCount <= count) {
          /** @type {Effect} */
          const effect = {
            type: "ApplyAura",
            aura: setAura.aura,
          };
          const spell = dummySpell([effect]);
          auras.push(
            makeAura(
              spell,
              0,
              this,
              this,
              0
            )
          );
        }
      }
    }

    return auras;
  }

  #recalculateStats() {
    this.stats = this.strategy.baseStats;

    for (const [slot, gearIds] of /** @type {[Slot, (number | string)[]][]} */ (Object.entries(this.characterData.equippedGear))) {
      for (const id of gearIds) {
        const gearData = getGearData(id);
        this.stats = mergeStatData(this.stats, gearData.stats);
      }

      const enchants = this.characterData.equippedEnchants[slot];
      if (enchants) {
        for (const id of enchants) {
          const enchantData = getGearData(id);
          this.stats = mergeStatData(this.stats, enchantData.stats);
        }
      }

      const gems = this.characterData.equippedGems[slot];
      if (gems) {
        for (const id of gems) {
          const gemData = getGemData(id);
          this.stats = mergeStatData(this.stats, gemData.stats);
        }
      }
    }

    for (const aura of this.auras) {
      this.stats = aura.addToStatData(this.stats);
    }

    for (const aura of this.auras) {
      this.stats = aura.multiplyWithStatData(this.stats);
    }

    for (const aura of this.auras) {
      this.stats = aura.multiplyByPercentOfStat(this.stats);
    }

    const allowedCombatManaRegen = Math.max(
      ...this.auras.map(aura => aura.allowedCombatManaRegen()),
      0
    );

    const regenFactor = this.auras.reduce(
      (product, aura) => product * aura.manaRegenFactor(),
      1
    );

    const mp5ManaRegen = this.stats.MP5 || 0;
    const spiritManaRegen = regenFactor * 5 * (0.001 + Math.sqrt(this.stats.INTELLECT) * Math.floor(this.stats.SPIRIT) * 0.009327);
    const notCastingManaRegen = spiritManaRegen + mp5ManaRegen;

    /** @type {CalculatedStatData} */
    const calculatedStats = {
      ARMOR: 2 * this.stats.AGILITY,
      CRIT_SPELL_PERCENT: (this.stats.CRIT_SPELL_RATING || 0) / 22.0769 + this.stats.INTELLECT / 80,
      HASTE_SPELL_PERCENT: (this.stats.HASTE_SPELL_RATING || 0) / 15.77,
      MAX_HEALTH: this.stats.STAMINA * 10,
      HIT_SPELL_PERCENT: (this.stats.HIT_SPELL_PERCENT || 0) + (this.stats.HIT_SPELL_RATING || 0) / 12.62,
      MAX_MANA: 20 + (this.stats.INTELLECT - 20) * 15,
      MANA_REGEN_CASTING: allowedCombatManaRegen * spiritManaRegen + mp5ManaRegen,
      MANA_REGEN_NOT_CASTING: notCastingManaRegen,
    };

    this.stats = mergeStatData(this.stats, calculatedStats);
  }

  reset() {
    this.stats = this.strategy.baseStats;

    /** @type {Aura[]} */
    this.auras = [
      ...this.#getAurasFromTalents(),
      ...this.#getAurasFromGear(),
    ];

    // TODO: Get auras/stats from gear - DO NOT DO THIS IN #recalculateStats
    this.#recalculateStats();
    this.health = this.stats.MAX_HEALTH;
    this.mana = this.stats.MAX_MANA;
  }

  /**
   * @param {Aura} aura
   */
  applyAura(aura) {
    this.auras.push(aura);
    this.#recalculateStats();
  }

  /**
   * @param {number} spellId
   * @param {Entity} caster
   * @param {AuraDefinition["type"]} type
   * @returns {Aura=}
   */
  getExistingAura(spellId, caster, type) {
    return this.auras.find(aura => aura.isSameAura(spellId, caster, type));
  }

  removeExpiredAuras() {
    const currentAuraCount = this.auras.length;
    this.auras = this.auras.filter(aura => aura.isActive());

    if (this.auras.length !== currentAuraCount) {
      this.#recalculateStats();
    }
  }

  /**
   * @param {Spell} spell
   */
  getSpellCastTimeMs(spell) {
    spell = this.startCastingSpell(spell);

    let castDurationMs;
    if (spell.castTimeMs === "Channeled") {
      castDurationMs = spell.durationMs;
    } else if (spell.castTimeMs === "Instant") {
      castDurationMs = 0;
    } else {
      castDurationMs = spell.castTimeMs;
    }

    const hastePercent = this.stats.HASTE_SPELL_PERCENT || 0;
    return hastedDuration(castDurationMs, hastePercent, 0);
  }

  /**
   * @param {Spell} spell
   */
  startCastingSpell(spell) {
    spell = cloneSpell(spell);

    for (const aura of this.auras) {
      spell = aura.applyToSpell(spell);
    }

    return spell;
  }

  /**
   * @param {Spell} spell
   * @param {Entity} target
   * @param {number} currentTimeMs
   */
  castSpell(spell, target, currentTimeMs) {
    /** @type {EntityChangeEvent[]} */
    const events = [];

    const spellFactorsForEffects = this.getSpellFactorsForEffects(spell, target);
    spellFactorsForEffects.forEach((spellFactors, effectIndex) => {
      const effect = spell.effects[effectIndex];

      const eventBase = {
        caster: this,
        target,
        spell,
        effectIndex,
        currentTimeMs,
      };

      if (effect.type === "ApplyAura") {
        const existingAura = target.getExistingAura(spell.id, this, effect.aura.type);

        if (effect.aura.type === "PeriodicAura") {
          if (!spellFactors) {
            throw new Error("Failed to calculate spell factors for periodic aura");
          }

          if (existingAura) {
            if (existingAura.type !== "PeriodicAura") {
              throw new Error("Expected to find a periodic aura");
            }

            if (spell.castTimeMs === "Channeled") {
              throw new Error("Casting a channeled spell while already channeling");
            }

            if (!existingAura.spellFactors) {
              throw new Error("Periodic aura without spell factors");
            }

            const existingHealthChange = getHealthChange(existingAura.effect, existingAura.spellFactors);
            const newHealthChange = getHealthChange(effect, spellFactors);

            // Don't apply if the existing aura produces higher healing and can take only one stack
            if (effect.aura.maximumStacks > 1 || !isHeal(effect) || (existingHealthChange <= newHealthChange)) {
              // Replace the existing snapshot values and add stack
              existingAura.addStack(this);
              events.push({
                ...eventBase,
                type: "ApplyAuraEvent",
                aura: existingAura,
              });
            }
          } else {
            const aura = makeAura(
              spell,
              effectIndex,
              this,
              target,
              currentTimeMs
            );

            target.applyAura(aura);

            events.push({
              ...eventBase,
              type: "ApplyAuraEvent",
              aura,
            });
          }
        } else {
          if (existingAura) {
            if (effect.aura.maximumStacks > 1 || spell.durationMs >= existingAura.remainingTimeMs()) {
              existingAura.addStack(this);

              events.push({
                ...eventBase,
                type: "ApplyAuraEvent",
                aura: existingAura,
              });
            }
          } else {
            const aura = makeAura(
              spell,
              effectIndex,
              this,
              target,
              currentTimeMs
            );

            target.applyAura(aura);

            events.push({
              ...eventBase,
              type: "ApplyAuraEvent",
              aura,
            });
          }
        }
      } else if (effect.type === "Immediate") {
        if (!spellFactors) {
          throw new Error("Immediate effect without spell factors");
        }

        const healthChange = getHealthChange(effect, spellFactors);
        events.push({
          ...eventBase,
          type: "HealthChangeEvent",
          ...healthChange,
        });
      } else if (effect.type === "GiveMana") {
        events.push({
          ...eventBase,
          type: "ManaChangeEvent",
          value: effect.value,
        });
      }
    });

    if (events.length !== 0) {
      events.push({
        caster: this,
        target: this,
        spell,
        effectIndex: events[0].effectIndex,
        currentTimeMs,
        type: "ManaChangeEvent",
        value: -spell.cost,
      });
    }

    return events;
  }

  /**
   * @param {Spell} spell
   * @param {Entity} target
   */
  stopCastingSpell(spell, target) {
    /** @type {Event[]} */
    const events = [];

    if (spell.castTimeMs === "Channeled") {
      for (const effect of spell.effects) {
        if (effect.type === "ApplyAura") {
          const aura = target.getExistingAura(spell.id, this, effect.aura.type);
          if (aura) {
            events.push(...aura.dispell());
          }
        }
      }
    }

    return events;
  }

  /**
   * @param {Spell} spell
   * @param {Entity} target
   */
  getSpellFactorsForEffects(spell, target) {
    const auras = [...this.auras];
    if (this !== target) {
      auras.push(...target.auras);
    }

    return spell.effects.map((effect, index) => {
      if (!usesSpellFactors(effect)) {
        return undefined;
      }

      let bonus = 0;
      if (isHeal(effect)) {
        bonus = this.stats.HEALING || 0;
      } else if (isMagicDamage(effect)) {
        bonus = (this.stats.DAMAGE || 0) + (this.stats[`${spell.school}_DAMAGE`] || 0);
      }

      /** @type {SpellFactors} */
      let spellFactors = {
        hitChance: (this.stats.HIT_SPELL_PERCENT || 0) + 84,
        overallMultiplier: 1,
        spMod: getSpMod(effect),
        bonus,
        critBonus: 0.5,
        critChance: (this.stats.CRIT_SPELL_PERCENT || 0) / 100,
      };

      for (const aura of auras) {
        spellFactors = aura.applyToSpellFactors(spell, index, spellFactors);
      }

      spellFactors.hitChance = isHeal(effect) ? 1 : Math.min(spellFactors.hitChance, 0.99);
      spellFactors.critChance = canCrit(effect) ? spellFactors.critChance : 0;

      return spellFactors;
    });
  }

  /**
   * @param {Spell} spell
   * @param {Entity} target
   * @deprecated
   */
  getSpellResults(spell, target) {
    spell = this.startCastingSpell(spell);

    const spellFactorsForEffects = this.getSpellFactorsForEffects(spell, target);
    return spellFactorsForEffects.map((spellFactors, effectIndex) => {
      if (!spellFactors) {
        return [];
      }

      const effect = spell.effects[effectIndex];
      const healthChange = getHealthChange(effect, spellFactors);
      const target = {
        ...healthChange,
        modifies: "HEALTH",
      };

      const self = {
        modifies: "MANA",
        value: -spell.cost,
      };

      return {
        target,
        self,
      };
    });
  }

  /**
   * @param {Event[]} events
   */
  updateHealthAndMana(events) {
    for (const event of events) {
      if (event.type === "ManaChangeEvent" && event.target === this) {
        this.mana = clamp(this.mana + event.value, 0, this.stats.MAX_MANA);
      } else if (event.type === "HealthChangeEvent" && event.target === this) {
        this.health = clamp(this.mana + event.expected, 0, this.stats.MAX_HEALTH);
      } else if (event.type === "RegenTickEvent" && event.entity === this) {
        this.mana = clamp(this.mana + event.mana, 0, this.stats.MAX_MANA);
      }
    }
  }

  /**
   * @param {SpellName} spellName
   */
  isOnUseAvailable(spellName) {
    return Object.values(this.characterData.equippedGear).
      flat().
      map(getGearData).
      some(gearData => gearData.onUse === spellName);
  }

  getSimulationNames() {
    return this.strategy.simulationStrategies.map(strategy => strategy.name);
  }

  /**
   * @param {string} name
   */
  getSimulationStrategy(name) {
    return this.strategy.simulationStrategies.find(strategy => strategy.name === name);
  }
}

/** @type {CharacterData} */
const bufferCharacterData = {
  className: "Priest",
  spec: "Shadow",
  talents: {
    Darkness: 0,
    "Focused Mind": 0,
    "Improved Mind Blast": 0,
    "Improved Shadow Word: Pain": 0,
    "Inner Focus": 0,
    Meditation: 0,
    "Mind Flay": 0,
    Shadowform: 0,
    "Shadow Focus": 0,
    "Shadow Power": 0,
    "Vampiric Touch": 0,
  },
  notes: [],
  links: [],
  equippedEnchants: {},
  equippedGear: {},
  equippedGems: {},
  enchantRanking: {},
  gearRanking: {},
  gemRanking: [],
};

/** @implements {ClassAndSpecStrategy} */
class BufferStrategy {
  baseStats = {
    STRENGTH: 0,
    AGILITY: 0,
    STAMINA: 0,
    INTELLECT: 0,
    SPIRIT: 0,
    MAX_HEALTH: 0,
    MAX_MANA: 0,
    CRIT_SPELL_PERCENT: 0,
  };

  /** @type {SpellName[]} */
  relevantSpells = [];

  /** @type {SimulationStrategy[]} */
  simulationStrategies = [];

  /**
   * @param {Spell[]} talentSpells
   */
  constructor(talentSpells) {
    // Adjust duration on all effects to 0 since they are assumed to be present
    // for the entire duration of the simulation
    this.talentSpells = talentSpells.map(cloneSpell);

    for (const spell of this.talentSpells) {
      spell.durationMs = 0;
    }
  }

  getSpellsFromTalents() {
    return this.talentSpells;
  }
}

/**
 * @param {Entity} target
 * @param {SpellName[]} bufferAuraSpells
 * @param {Set<SpellName>} spells
 * @param {number} currentTimeMs
 */
export function applyBuffsToTarget(target, bufferAuraSpells, spells, currentTimeMs) {
  const spellModifiers = Array.from(spells).filter(spell => bufferAuraSpells.includes(spell));
  const castableBuffs = Array.from(spells).filter(spell => !bufferAuraSpells.includes(spell));

  const buffer = new EntityImpl(
    bufferCharacterData,
    new BufferStrategy(spellModifiers.map(getSpellData))
  );
  for (const spellName of castableBuffs) {
    buffer.castSpell(
      buffer.startCastingSpell(getSpellData(spellName)),
      target,
      currentTimeMs
    );
  }
}

/**
 *
 * @param {Set<SpellName>} spells
 */
export function makeGenericTarget(spells) {
  const buffSpells = Array.from(spells).map(getSpellData);
  return new EntityImpl(bufferCharacterData, new BufferStrategy(buffSpells));
}

/**
 * @param {CharacterData} characterData
 * @returns {EntityImpl}
 */
export function getEntityFromCharacterData(characterData) {
  switch (characterData.className) {
    case "Druid":
      return new EntityImpl(characterData, new RestoDruidStrategy(characterData));

    case "Priest":
      return new EntityImpl(characterData, new ShadowPriestStrategy(characterData));
  }
}
