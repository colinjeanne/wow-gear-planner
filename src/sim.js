import { makeGenericTarget } from "./classes/entity.js";
import { getSpellData } from "./databases.js";
import { hastedDuration, timeRange } from "./time.js";

/**
 * @typedef {import("./types.js").Cooldown} Cooldown
 * @typedef {import("./types.js").CooldownTracker} CooldownTracker
 * @typedef {import("./types.js").Entity} Entity
 * @typedef {import("./types.js").Event} Event
 * @typedef {import("./types.js").EventAction} EventAction
 * @typedef {import("./types.js").OnEvent} OnEvent
 * @typedef {import("./types.js").Spell} Spell
 * @typedef {import("./types.js").SpellName} SpellName
 * @typedef {import("./types.js").TimeChangeEvent} TimeChangeEvent
 */

/**
 * @param {Entity} entity
 * @param {boolean} inCombat
 */
function getMp2ForEntity(entity, inCombat) {
  const regenStat = inCombat ?
    entity.stats.MANA_REGEN_CASTING :
    entity.stats.MANA_REGEN_NOT_CASTING;

  return ((regenStat || 0) - (entity.stats.MP5 || 0)) * 2 / 5;
}

/**
 * @implements {CooldownTracker}
 */
class CooldownTrackerImpl {
  /** @type {Map<Cooldown, number>} */
  #cooldowns = new Map();

  #currentTimeMs = 0;

  /**
   * @param {Cooldown} cooldown
   * @param {number} durationMs
   */
  startCooldown(cooldown, durationMs) {
    this.#cooldowns.set(cooldown, this.#currentTimeMs + durationMs);
  }

  /**
   * @param {Cooldown} cooldown
   */
  remainingCooldown(cooldown) {
    const endTime = this.#cooldowns.get(cooldown) || 0;
    return Math.max(endTime - this.#currentTimeMs, 0);
  }

  /**
   * @param {SpellName} spellName
   */
  isOnCooldown(spellName) {
    return this.remainingCooldown(spellName) > 0;
  }

  isOnGCD() {
    return this.remainingCooldown("GCD") > 0;
  }

  isCasting() {
    return this.remainingCooldown("Cast") > 0;
  }

  isInCombat() {
    return this.remainingCooldown("Combat") > 0;
  }

  /**
   * @param {number} currentTimeMs
   */
  updateTime(currentTimeMs) {
    this.#currentTimeMs = currentTimeMs;

    /** @type {Cooldown[]} */
    const elapsedCooldowns = [];
    for (const [cooldown, endTimeMs] of this.#cooldowns) {
      if (this.#currentTimeMs >= endTimeMs) {
        elapsedCooldowns.push(cooldown);
        this.#cooldowns.delete(cooldown);
      }
    }

    return elapsedCooldowns;
  }
}

/**
 * @typedef HealthAndManaAggregate
 * @property {number} castCount
 * @property {number} healthChange
 * @property {number} manaChange
 */

/**
 * @param {Entity} caster
 * @param {Event[]} events
 */
export function analyzeHealthAndManaEffects(caster, events) {
  /** @type {Map<number, HealthAndManaAggregate>} */
  const spellAnalytics = new Map();

  let totalCasts = 0;
  let totalHealthChange = 0;
  let totalManaChange = 0;
  for (const event of events) {
    if (
      event.type !== "HealthChangeEvent" &&
      event.type !== "ManaChangeEvent" &&
      event.type !== "CastCompletedEvent"
    ) {
      continue;
    }

    if (event.caster !== caster) {
      continue;
    }

    let spellData = spellAnalytics.get(event.spell.id);
    if (!spellData) {
      spellData = {
        castCount: 0,
        healthChange: 0,
        manaChange: 0,
      };
    }

    if (event.type === "HealthChangeEvent") {
      spellData.healthChange += event.expected;
      totalHealthChange += event.expected;
    } else if (event.type === "ManaChangeEvent") {
      spellData.manaChange += event.value;
      totalManaChange += event.value;
    } else {
      ++spellData.castCount;
      ++totalCasts;
    }

    spellAnalytics.set(event.spell.id, spellData);
  }

  return {
    spellAnalytics,
    totalCasts,
    totalHealthChange,
    totalManaChange,
  };
}

/**
 * @typedef SimState
 * @property {Entity} entity
 * @property {Entity[]} targets
 * @property {Event[]} events
 * @property {EventAction} nextAction
 * @property {number} currentTimeMs
 */

/**
 * @param {Entity} entity
 * @param {number} targetCount
 * @param {Set<SpellName>} targetAuras
 * @param {number} maximumDurationMs
 * @param {OnEvent} onEvent
 */
export function* simulate(entity, targetCount, targetAuras, maximumDurationMs, onEvent) {
  const clock = timeRange(maximumDurationMs, 10);

  /** @type {Entity[]} */
  const targets = [];
  for (let index = 0; index < targetCount; ++index) {
    targets.push(makeGenericTarget(targetAuras));
  }

  const allEntities = [entity, ...targets];

  const cooldowns = new CooldownTrackerImpl();
  cooldowns.startCooldown("Regen", 2000);

  /** @type {Spell?} */
  let currentSpellCast = null;

  /** @type {SpellName?} */
  let currentSpellName = null;

  /** @type {Entity?} */
  let currentCastTarget = null;

  /** @type {EventAction} */
  let nextAction = {
    type: "Continue",
  };

  for (const currentTimeMs of clock) {
    /** @type {Event[]} */
    const unprocessedEvents = [];

    const hastePercent = entity.stats.HASTE_SPELL_PERCENT || 0;

    switch (nextAction.type) {
      case "Cast":
        if (cooldowns.isOnCooldown(nextAction.spellName) || cooldowns.isOnGCD()) {
          break;
        }

        if (currentSpellCast && currentCastTarget) {
          unprocessedEvents.push({
            type: "CastStoppedEvent",
            caster: entity,
            target: currentCastTarget,
            spell: currentSpellCast,
            currentTimeMs,
          });

          unprocessedEvents.push(
            ...entity.stopCastingSpell(currentSpellCast, currentCastTarget)
          );

          currentCastTarget = null;
          currentSpellCast = null;
          currentSpellName = null;
        }

        let spell = getSpellData(nextAction.spellName);

        // Call this before startCastingSpell because this method expects the
        // raw spell information
        const castDurationMs = entity.getSpellCastTimeMs(spell);

        spell = entity.startCastingSpell(spell);
        if (entity.mana < spell.cost) {
          break;
        }

        cooldowns.startCooldown("Cast", castDurationMs);

        if (spell.gcdCategory === "Normal") {
          cooldowns.startCooldown(
            "GCD",
            hastedDuration(spell.gcdMs, hastePercent, 1000)
          );
        }

        cooldowns.startCooldown("Combat", 5000);

        if (spell.cooldownMs > 0) {
          cooldowns.startCooldown(nextAction.spellName, spell.cooldownMs);
        }

        currentCastTarget = nextAction.target;
        currentSpellCast = spell;
        currentSpellName = nextAction.spellName;

        unprocessedEvents.push({
          type: "CastStartedEvent",
          caster: entity,
          target: currentCastTarget,
          spell: currentSpellCast,
          currentTimeMs,
        });

        break;

      case "Continue":
        break;
    }

    const elapsedCooldowns = cooldowns.updateTime(currentTimeMs);

    for (const cooldown of elapsedCooldowns) {
      switch (cooldown) {
        case "Cast":
          if (!currentCastTarget || !currentSpellCast || !currentSpellName) {
            throw new Error("Missing cast data");
          }

          unprocessedEvents.push({
            type: "CastCompletedEvent",
            caster: entity,
            target: currentCastTarget,
            spell: currentSpellCast,
            currentTimeMs,
          });

          unprocessedEvents.push(
            ...entity.castSpell(currentSpellCast, currentCastTarget, currentTimeMs)
          );

          currentCastTarget = null;
          currentSpellCast = null;
          currentSpellName = null;
          break;

        case "GCD":
          unprocessedEvents.push({
            type: "GcdExpiredEvent",
            caster: entity,
            currentTimeMs,
          });
          break;

        case "Combat":
          break;

        case "Regen":
          cooldowns.startCooldown("Regen", 2000);

          unprocessedEvents.push({
            type: "RegenTickEvent",
            entity,
            mana: getMp2ForEntity(entity, cooldowns.isInCombat()),
            currentTimeMs,
          });

          for (const target of targets) {
            unprocessedEvents.push({
              type: "RegenTickEvent",
              entity: target,
              mana: getMp2ForEntity(target, cooldowns.isInCombat()),
              currentTimeMs,
            });
          }
          break;

        default:
          unprocessedEvents.push({
            type: "SpellCooldownExpiredEvent",
            caster: entity,
            spellName: cooldown,
            currentTimeMs,
          });
          break;
      }
    }

    /** @type {TimeChangeEvent} */
    const timeChangeEvent = {
      type: "TimeChangeEvent",
      currentTimeMs,
    };

    unprocessedEvents.push(timeChangeEvent);

    /** @type {Event[]} */
    const processedEvents = [];
    while (unprocessedEvents.length > 0) {
      const currentEvent = /** @type {Event} */ (unprocessedEvents.shift());

      for (const processingEntity of allEntities) {
        for (const aura of processingEntity.auras) {
          unprocessedEvents.push(...aura.onEvent(currentEvent));
        }
      }

      processedEvents.push(currentEvent);
    }

    for (const processingEntity of allEntities) {
      processingEntity.removeExpiredAuras();
      processingEntity.updateHealthAndMana(processedEvents);
    }

    nextAction = onEvent(entity, targets, cooldowns);

    /** @type {SimState} */
    yield {
      entity,
      targets,
      events: processedEvents,
      nextAction,
      currentTimeMs,
    };
  }
}
