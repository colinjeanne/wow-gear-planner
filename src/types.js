export const slots = {
  head: "Head",
  neck: "Neck",
  shoulders: "Shoulders",
  back: "Back",
  chest: "Chest",
  wrist: "Wrist",
  hands: "Hands",
  waist: "Waist",
  legs: "Legs",
  feet: "Feet",
  ring: "Ring",
  trinket: "Trinket",
  relic: "Relic",
  twoHand: "Two Hand",
  mainHand: "Main Hand",
  offHand: "Off-hand",
  wand: "Wand",
};

/**
 * @typedef {keyof slots} Slot
 */

/**
 * @typedef {(
 *  "AGILITY" |
 *  "INTELLECT" |
 *  "MAX_HEALTH" |
 *  "MAX_MANA" |
 *  "SPIRIT" |
 *  "STAMINA" |
 *  "STRENGTH"
 * )} PrimaryStat
 *
 * @typedef {(
 *  "ARCANE_DAMAGE" |
 *  "ARMOR" |
 *  "CRIT_SPELL_RATING" |
 *  "DAMAGE" |
 *  "FIRE_DAMAGE" |
 *  "FROST_DAMAGE" |
 *  "HASTE_SPELL_RATING" |
 *  "HEALING" |
 *  "HIT_SPELL_RATING" |
 *  "HOLY_DAMAGE" |
 *  "MP5" |
 *  "NATURE_DAMAGE" |
 *  "PENETRATION" |
 *  "PHYSICAL_DAMAGE" |
 *  "RESILIENCE_RATING" |
 *  "SHADOW_DAMAGE"
 * )} SecondaryStat
 *
 * @typedef {(
 *  "ARMOR" |
 *  "CRIT_SPELL_PERCENT" |
 *  "HASTE_SPELL_PERCENT" |
 *  "HIT_SPELL_PERCENT" |
 *  "MAX_HEALTH" |
 *  "MAX_MANA" |
 *  "MANA_REGEN_CASTING" |
 *  "MANA_REGEN_NOT_CASTING"
 * )} CalculatedStat
 *
 * @typedef {PrimaryStat | SecondaryStat | CalculatedStat} Stat
 */

/**
 * @typedef {{ [x in PrimaryStat]: number }} PrimaryStatData
 *
 * @typedef {{ [x in SecondaryStat]?: number }} SecondaryStatData
 *
 * @typedef {{ [x in CalculatedStat]?: number }} CalculatedStatData
 *
 * @typedef {PrimaryStatData & SecondaryStatData & CalculatedStatData} StatData
 */

/**
 * @typedef ItemSetAura
 * @property {number} requiredCount
 * @property {AuraDefinition} aura
 *
 * @typedef ItemSet
 * @property {number[]} items
 * @property {ItemSetAura[]} auras
 */

/** @enum {number} */
export const GemColor = {
  "red": 0x01,
  "yellow": 0x02,
  "blue": 0x08,
  "meta": 0x10,
};

/**
 * @typedef GemData
 * @property {number[]} sockets
 * @property {Partial<StatData>} bonus
 *
 * @typedef Gem
 * @property {Partial<StatData>} stats
 * @property {number} color
 * @property {AuraDefinition[]=} auras
 */

/**
 * @template {Partial<StatData>} U
 * @template {Partial<StatData>} V
 * @param {U} a
 * @param {V} b
 * @returns {U & V}
 */
export function mergeStatData(a, b) {
  // Ensure all keys are present, then sum in the values from b

  /** @type {V} */
  const emptyV = /** @type {V} */ (Object.fromEntries(Object.entries(b).map(([key]) => [key, 0])));

  /** @type {U & V} */
  const merged = { ...emptyV, ...a };
  for (const [stat, value] of /** @type {[Stat, number][]} */ (Object.entries(b))) {
    /** @type {number} */ (merged[stat]) += value;
  }

  return merged;
}

/**
 * @typedef {(
 *  "Black Temple" |
 *  "Brewfest" |
 *  "Cenarion Expedition" |
 *  "Enchanting" |
 *  "Gruul's Lair" |
 *  "Heroic Underbog" |
 *  "Honor Hold" |
 *  "Hyjal Summit" |
 *  "Karazhan" |
 *  "Magtheridon's Lair" |
 *  "PVP" |
 *  "Scale of the Sands" |
 *  "Shadow Labyrinth" |
 *  "Sunwell Plateau" |
 *  "SSC" |
 *  "Tempest Keep" |
 *  "The Aldor" |
 *  "The Sha'tar" |
 *  "Zul'Aman"
 * )} InstancesAndRep
 *
 * @typedef BaseItem
 * @property {1 | 2 | 3 | 4 | 5} phase
 * @property {Slot} slot
 *
 * @typedef {BaseItem & { source: "Auction House" }} AuctionItem
 * @typedef {BaseItem & { source: "Badges of Justice", cost: number }} BadgeItem
 * @typedef {BaseItem & { source: "Crafting" }} CraftingItem
 * @typedef {BaseItem & { source: "Quests", quest: number }} QuestItem
 * @typedef {BaseItem & { source: InstancesAndRep, subItem?: number, boss?: string }} InstanceItem
 *
 * @typedef {(
 *  AuctionItem |
 *  BadgeItem |
 *  CraftingItem |
 *  QuestItem |
 *  InstanceItem
 * )} Item
 */

/**
 * @typedef {(
 *  "Arcane Brilliance" |
 *  "Aura of the Crusader" |
 *  "Band of the Eternal Restorer" |
 *  "Band of the Eternal Sage" |
 *  "Blessing of the Silver Crescent" |
 *  "Brilliant Mana Oil" |
 *  "Curse of Elements" |
 *  "Dark Iron Pipeweed" |
 *  "Darkness (Rank 1)" |
 *  "Darkness (Rank 2)" |
 *  "Darkness (Rank 3)" |
 *  "Darkness (Rank 4)" |
 *  "Darkness (Rank 5)" |
 *  "Divine Spirit" |
 *  "Elixir of Draenic Wisdom" |
 *  "Elixir of Healing Power" |
 *  "Empowered Rejuvenation (Rank 1)" |
 *  "Empowered Rejuvenation (Rank 2)" |
 *  "Empowered Rejuvenation (Rank 3)" |
 *  "Empowered Rejuvenation (Rank 4)" |
 *  "Empowered Rejuvenation (Rank 5)" |
 *  "Essence of the Martyr" |
 *  "Fel Infusion" |
 *  "Flask of Pure Death" |
 *  "Focused Mind (Rank 1)" |
 *  "Focused Mind (Rank 2)" |
 *  "Focused Mind (Rank 3)" |
 *  "Gift of Nature (Rank 1)" |
 *  "Gift of Nature (Rank 2)" |
 *  "Gift of Nature (Rank 3)" |
 *  "Gift of Nature (Rank 4)" |
 *  "Gift of Nature (Rank 5)" |
 *  "Gift of the Wild" |
 *  "Greater Blessing of Kings" |
 *  "Greater Blessing of Wisdom" |
 *  "Heal (Crystal Spire of Karabor)" |
 *  "Healing Touch" |
 *  "Hopped Up" |
 *  "Improved Blessing of Wisdom" |
 *  "Improved Divine Spirit" |
 *  "Improved Mark of the Wild" |
 *  "Improved Mind Blast (Rank 1)" |
 *  "Improved Mind Blast (Rank 2)" |
 *  "Improved Mind Blast (Rank 3)" |
 *  "Improved Mind Blast (Rank 4)" |
 *  "Improved Mind Blast (Rank 5)" |
 *  "Improved Power Word: Fortitude" |
 *  "Improved Regrowth (Rank 1)" |
 *  "Improved Regrowth (Rank 2)" |
 *  "Improved Regrowth (Rank 3)" |
 *  "Improved Regrowth (Rank 4)" |
 *  "Improved Regrowth (Rank 5)" |
 *  "Improved Rejuvenation (Rank 1)" |
 *  "Improved Rejuvenation (Rank 2)" |
 *  "Improved Rejuvenation (Rank 3)" |
 *  "Improved Shadow Word: Pain (Rank 1)" |
 *  "Improved Shadow Word: Pain (Rank 2)" |
 *  "Inner Focus" |
 *  "Innervate" |
 *  "Inspiring Presence" |
 *  "Intensity (Rank 1)" |
 *  "Intensity (Rank 2)" |
 *  "Intensity (Rank 3)" |
 *  "Lesser Spell Blasting" |
 *  "Lifebloom" |
 *  "Living Spirit (Rank 1)" |
 *  "Living Spirit (Rank 2)" |
 *  "Living Spirit (Rank 3)" |
 *  "Meditation (Rank 1)" |
 *  "Meditation (Rank 2)" |
 *  "Meditation (Rank 3)" |
 *  "Mindflay" |
 *  "Mind Blast" |
 *  "Misery" |
 *  "Mojo Madness" |
 *  "Natural Perfection (Rank 1)" |
 *  "Natural Perfection (Rank 2)" |
 *  "Natural Perfection (Rank 3)" |
 *  "Prayer of Fortitude" |
 *  "Regrowth" |
 *  "Rejuvenation" |
 *  "Shadowform" |
 *  "Shadow Focus (Rank 1)" |
 *  "Shadow Focus (Rank 2)" |
 *  "Shadow Focus (Rank 3)" |
 *  "Shadow Focus (Rank 4)" |
 *  "Shadow Focus (Rank 5)" |
 *  "Shadow Power (Rank 1)" |
 *  "Shadow Power (Rank 2)" |
 *  "Shadow Power (Rank 3)" |
 *  "Shadow Power (Rank 4)" |
 *  "Shadow Power (Rank 5)" |
 *  "Shadow Weaving" |
 *  "Shadow Word: Death" |
 *  "Shadow Word: Pain" |
 *  "Spell Focus Trigger" |
 *  "Starshards" |
 *  "Super Mana Potion" |
 *  "Superior Wizard Oil" |
 *  "Swiftmend" |
 *  "Tree of Life" |
 *  "Vampiric Touch" |
 *  "Well Fed (23 Spell Damage, 20 Spirit)" |
 *  "Well Fed (44 Healing, 20 Spirit)" |
 *  "Wisdom (Memento of Tyrande)"
 * )} SpellName
 */

/**
 * @typedef {(
 *  "ARCANE" |
 *  "FIRE" |
 *  "FROST" |
 *  "HOLY" |
 *  "NATURE" |
 *  "SHADOW" |
 *  "PHYSICAL"
 * )} School
 *
 * @typedef BaseAuraDefinition
 * @property {number} value
 * @property {number} maximumStacks
 *
 * @typedef PeriodicAura
 * @property {"Heal" | "School Damage"} action
 * @property {"PeriodicAura"} type
 * @property {number} periodMs
 * @property {number} spMod
 *
 * @typedef ModifyStatsAura
 * @property {"ModifyStatsAura"} type
 * @property {Partial<StatData>} addedStats
 *
 * @typedef ModifyStatsPercentAura
 * @property {"ModifyStatsPercentAura"} type
 * @property {Stat[]} affectedStats
 *
 * @typedef ModifyStatsByPercentOfStatAura
 * @property {"ModifyStatsByPercentOfStatAura"} type
 * @property {Stat} stat
 * @property {Stat[]} affectedStats
 *
 * @typedef ModifySpellEffectivenessAura
 * @property {"ModifySpellEffectivenessAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ModifySpellEffectValueAura
 * @property {"ModifySpellEffectValueAura"} type
 * @property {number} effectIndex
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ModifyPercentSpellDamageTakenAura
 * @property {"ModifyPercentSpellDamageTakenAura"} type
 * @property {School[]} schools
 *
 * @typedef ModifyPercentSpellDamageDoneAura
 * @property {"ModifyPercentSpellDamageDoneAura"} type
 * @property {School[]} schools
 *
 * @typedef ModifyPowerCostAura
 * @property {"ModifyPowerCostAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ModifyCooldownAura
 * @property {"ModifyCooldownAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ModifyDurationAura
 * @property {"ModifyDurationAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ModifySpellCritPercentAura
 * @property {"ModifySpellCritPercentAura"} type
 *
 * @typedef ModifyCritChanceAura
 * @property {"ModifyCritChanceAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef AllowPercentOfManaRegenInCombatAura
 * @property {"AllowPercentOfManaRegenInCombatAura"} type
 *
 * @typedef ModifyManaRegenPercentAura
 * @property {"ModifyManaRegenPercentAura"} type
 *
 * @typedef ModifyHitChanceAura
 * @property {"ModifyHitChanceAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ModifySpellPowerAura
 * @property {"ModifySpellPowerAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ModifyDamageHealingDoneAura
 * @property {"ModifyDamageHealingDoneAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ModifyPeriodicDamageHealingDoneAura
 * @property {"ModifyPeriodicDamageHealingDoneAura"} type
 * @property {SpellName[]} affectedSpells
 *
 * @typedef ManaRegenAura
 * @property {"ManaRegenAura"} type
 *
 * @typedef ProcTriggerSpellAura
 * @property {"ProcTriggerSpellAura"} type
 * @property {number} auraProcChance
 * @property {SpellName} spellName
 * @property {SpellName[]=} affectedSpells
 *
 * @typedef {BaseAuraDefinition & (
 *  PeriodicAura |
 *  ModifyStatsAura |
 *  ModifyStatsPercentAura |
 *  ModifyStatsByPercentOfStatAura |
 *  ModifySpellEffectivenessAura |
 *  ModifySpellEffectValueAura |
 *  ModifyPercentSpellDamageTakenAura |
 *  ModifyPercentSpellDamageDoneAura |
 *  ModifyPowerCostAura |
 *  ModifyCooldownAura |
 *  ModifyDurationAura |
 *  ModifySpellCritPercentAura |
 *  ModifyCritChanceAura |
 *  AllowPercentOfManaRegenInCombatAura |
 *  ModifyManaRegenPercentAura |
 *  ModifyHitChanceAura |
 *  ModifySpellPowerAura |
 *  ModifyDamageHealingDoneAura |
 *  ModifyPeriodicDamageHealingDoneAura |
 *  ManaRegenAura |
 *  ProcTriggerSpellAura
 * )} AuraDefinition
 *
 * @typedef SpellFactors
 * @property {number} hitChance
 * @property {number} overallMultiplier
 * @property {number} spMod
 * @property {number} bonus
 * @property {number} critBonus
 * @property {number} critChance
 *
 * @typedef Aura
 * @property {Readonly<AuraDefinition["type"]>} type
 * @property {Readonly<Spell>} spell
 * @property {Readonly<number>} effectIndex
 * @property {Readonly<ApplyAuraEffect>} effect
 * @property {Readonly<SpellFactors>=} spellFactors
 * @property {Readonly<number>} maximumStacks
 * @property {Readonly<number>} currentStacks
 * @property {() => Event[]} dispell
 * @property {() => number} remainingTimeMs
 * @property {() => boolean} isActive
 * @property {(spellId: number, caster: Entity, type: AuraDefinition["type"]) => boolean} isSameAura
 * @property {(caster: Entity) => void} addStack
 * @property {(spell: Spell) => Spell} applyToSpell
 * @property {(spell: Spell, effectIndex: number, spellFactors: SpellFactors) => SpellFactors} applyToSpellFactors
 * @property {() => number} allowedCombatManaRegen
 * @property {() => number} manaRegenFactor
 * @property {<T extends Partial<StatData>>(stats: T) => T} addToStatData
 * @property {<T extends Partial<StatData>>(stats: T) => T} multiplyWithStatData
 * @property {<T extends Partial<StatData>>(stats: T) => T} multiplyByPercentOfStat
 * @property {(event: Event) => Event[]} onEvent
 *
 * @typedef ApplyAuraEffect
 * @property {"ApplyAura"} type
 * @property {AuraDefinition} aura
 *
 * @typedef GiveManaEffect
 * @property {"GiveMana"} type
 * @property {number} value
 *
 * @typedef ImmediateEffect
 * @property {"Heal" | "School Damage"} action
 * @property {"Immediate"} type
 * @property {number} value
 * @property {number} spMod
 *
 * @typedef LifebloomBloomEffect
 * @property {"LifebloomBloom"} type
 * @property {number} value
 * @property {number} spMod
 *
 * @typedef {(
 *  ApplyAuraEffect |
 *  GiveManaEffect |
 *  ImmediateEffect |
 *  LifebloomBloomEffect
 * )} Effect
 *
 * @typedef Spell
 * @property {number} id
 * @property {number} cost
 * @property {number | "Channeled" | "Instant"} castTimeMs
 * @property {number} cooldownMs
 * @property {number} gcdMs
 * @property {"Normal" | "None"} gcdCategory
 * @property {number} durationMs
 * @property {School} school
 * @property {Effect[]} effects
 */

/**
 * @typedef ItemData
 * @property {Partial<StatData>} stats
 * @property {number=} itemSetId
 * @property {GemData=} gems
 * @property {AuraDefinition[]=} auras
 * @property {boolean} unique
 * @property {(number | string)[]=} exclusiveWith
 * @property {SpellName=} onUse // TODO - shared cooldown
 */

/**
 * @typedef Entity
 * @property {number} health
 * @property {number} mana
 * @property {Aura[]} auras
 * @property {StatData} stats
 * @property {() => void} reset
 * @property {(aura: Aura) => void} applyAura
 * @property {(spellId: number, caster: Entity, type: AuraDefinition["type"]) => (Aura | undefined)} getExistingAura
 * @property {() => void} removeExpiredAuras
 * @property {(spell: Spell) => number} getSpellCastTimeMs
 * @property {(spell: Spell) => Spell} startCastingSpell
 * @property {(spell: Spell, target: Entity, currentTimeMs: number) => Event[]} castSpell
 * @property {(spell: Spell, target: Entity) => Event[]} stopCastingSpell
 * @property {(spell: Spell, target: Entity) => (SpellFactors | undefined)[]} getSpellFactorsForEffects
 * @property {(events: Event[]) => void} updateHealthAndMana
 * @property {(spellName: SpellName) => boolean} isOnUseAvailable
 * @property {() => string[]} getSimulationNames
 * @property {(name: string) => (SimulationStrategy | undefined)} getSimulationStrategy
 */

/**
 * @typedef BaseEntityChangeEvent
 * @property {Entity} caster
 * @property {Entity} target
 * @property {Spell} spell
 * @property {number} effectIndex
 * @property {number} currentTimeMs
 *
 * @typedef ApplyAuraEvent
 * @property {"ApplyAuraEvent"} type
 * @property {Aura} aura
 *
 * @typedef ExpireAuraEvent
 * @property {"ExpireAuraEvent"} type
 * @property {Aura} aura
 *
 * @typedef HealthChangeEvent
 * @property {"HealthChangeEvent"} type
 * @property {number} expected
 * @property {number} base
 * @property {number} crit
 *
 * @typedef ManaChangeEvent
 * @property {"ManaChangeEvent"} type
 * @property {number} value
 *
 * @typedef {BaseEntityChangeEvent & (
 *  ApplyAuraEvent |
 *  ExpireAuraEvent |
 *  HealthChangeEvent |
 *  ManaChangeEvent
 * )} EntityChangeEvent
 *
 * @typedef BaseEntityActionEvent
 * @property {Entity} caster
 * @property {Entity} target
 * @property {Spell} spell
 * @property {number} currentTimeMs
 *
 * @typedef CastStartedEvent
 * @property {"CastStartedEvent"} type
 *
 * @typedef CastCompletedEvent
 * @property {"CastCompletedEvent"} type
 *
 * @typedef CastStoppedEvent
 * @property {"CastStoppedEvent"} type
 *
 * @typedef {BaseEntityActionEvent & (
 *  CastStartedEvent |
 *  CastCompletedEvent |
 *  CastStoppedEvent
 * )} EntityActionEvent
 *
 * @typedef GcdExpiredEvent
 * @property {"GcdExpiredEvent"} type
 * @property {Entity} caster
 * @property {number} currentTimeMs
 *
 * @typedef RegenTickEvent
 * @property {"RegenTickEvent"} type
 * @property {Entity} entity
 * @property {number} mana
 * @property {number} currentTimeMs
 *
 * @typedef SpellCooldownExpiredEvent
 * @property {"SpellCooldownExpiredEvent"} type
 * @property {Entity} caster
 * @property {SpellName} spellName
 * @property {number} currentTimeMs
 *
 * @typedef TimeChangeEvent
 * @property {"TimeChangeEvent"} type
 * @property {number} currentTimeMs
 *
 * @typedef {(
 *  EntityActionEvent |
 *  EntityChangeEvent |
 *  GcdExpiredEvent |
 *  RegenTickEvent |
 *  SpellCooldownExpiredEvent |
 *  TimeChangeEvent
 * )} Event
 */

/**
 * @typedef {SpellName | "GCD" | "Cast" | "Combat" | "Regen"} Cooldown
 *
 * @typedef CooldownTracker
 * @property {(cooldown: Cooldown, durationMs: number) => void} startCooldown
 * @property {(cooldown: Cooldown) => number} remainingCooldown
 * @property {(spellName: SpellName) => boolean} isOnCooldown
 * @property {() => boolean} isOnGCD
 * @property {() => boolean} isCasting
 * @property {() => boolean} isInCombat
 * @property {(currentTimeMs: number) => Cooldown[]} updateTime
 *
 * @typedef ContinueAction
 * @property {"Continue"} type
 *
 * @typedef CastAction
 * @property {"Cast"} type
 * @property {SpellName} spellName
 * @property {Entity} target
 *
 * @typedef {(
 *  ContinueAction |
 *  CastAction
 * )} EventAction
 *
 * @callback OnEvent
 * @param {Entity} self
 * @param {Entity[]} targets
 * @param {CooldownTracker} cooldowns
 * @returns {EventAction}
 */

/**
 * @typedef SimulationStrategy
 * @property {string} name
 * @property {(
 *  self: Entity,
 *  targets: Entity[],
 *  cooldowns: CooldownTracker
 * ) => EventAction} onSimulationEvent
 *
 *
 * @typedef ClassAndSpecStrategy
 * @property {Readonly<StatData>} baseStats
 * @property {SpellName[]} relevantSpells
 * @property {() => Spell[]} getSpellsFromTalents
 * @property {SimulationStrategy[]} simulationStrategies
 */
