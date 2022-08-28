/**
 * @typedef {import("./types.js").Effect} Effect
 * @typedef {import("./types.js").Spell} Spell
 * @typedef {import("./types.js").SpellFactors} SpellFactors
 */

/**
 * @param {Effect} effect
 */
function cloneEffect(effect) {
  if (effect.type === "ApplyAura") {
    return {
      ...effect,
      aura: {
        ...effect.aura,
      },
    };
  }

  return {
    ...effect,
  };
}

/**
 * @param {Spell} spell
 */
export function cloneSpell(spell) {
  return {
    ...spell,
    effects: spell.effects.map(cloneEffect),
  };
}

/**
 * @param {Effect} effect
 */
export function usesSpellFactors(effect) {
  if (effect.type === "GiveMana") {
    return false;
  }

  if (effect.type === "Immediate" || effect.type === "LifebloomBloom") {
    return true;
  } else if (effect.aura.type === "PeriodicAura") {
    return true;
  }

  return false;
}

/**
 * @param {Effect} effect
 */
export function getSpMod(effect) {
  if (effect.type === "GiveMana") {
    return 0;
  }

  if (effect.type === "Immediate" || effect.type === "LifebloomBloom") {
    return effect.spMod;
  } else if (effect.aura.type === "PeriodicAura") {
    return effect.aura.spMod;
  }

  return 0;
}

/**
 * @param {Effect} effect
 */
export function canCrit(effect) {
  if (effect.type === "Immediate" || effect.type === "LifebloomBloom") {
    return true;
  }

  return false;
}

/**
 * @param {Effect} effect
 */
export function isHeal(effect) {
  if (effect.type === "ApplyAura" && effect.aura.type === "PeriodicAura" && effect.aura.action === "Heal") {
    return true;
  } else if (effect.type === "Immediate" && effect.action === "Heal") {
    return true;
  } else if (effect.type === "LifebloomBloom") {
    return true;
  }

  return false;
}

/**
 * @param {Effect} effect
 */
export function isMagicDamage(effect) {
  if (effect.type === "ApplyAura" && effect.aura.type === "PeriodicAura" && effect.aura.action === "School Damage") {
    return true;
  } else if (effect.type === "Immediate" && effect.action === "School Damage") {
    return true;
  }

  return false;
}

/**
 * @param {Effect} effect
 * @param {SpellFactors} spellFactors
 */
export function getHealthChange(effect, spellFactors) {
  const value = effect.type !== "ApplyAura" ? effect.value : effect.aura.value;
  const base = Math.sign(value) * spellFactors.overallMultiplier * (value + spellFactors.spMod * spellFactors.bonus);
  const crit = effect.type !== "ApplyAura" ? base * (1 + spellFactors.critBonus) : base;

  return {
    expected: spellFactors.hitChance * base * (1 + spellFactors.critBonus * spellFactors.critChance),
    base,
    crit,
  };
}
