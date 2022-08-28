/**
 * @typedef {import("../types.js").ApplyAuraEffect} ApplyAuraEffect
 * @typedef {import("../types.js").Effect} Effect
 * @typedef {import("../types.js").Spell} Spell
 * @typedef {import("../types.js").SpellName} SpellName
 */

/**
 * @param {number} id
 * @param {ApplyAuraEffect[]} effects
 * @returns {Spell}
 */
function talentSpell(id, effects) {
  return {
    id,
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
 * @param {number} id
 * @param {number} rank
 */
function Darkness(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyDamageHealingDoneAura",
          value: 2 * rank,
          affectedSpells: [
            "Mind Blast",
            "Shadow Word: Death",
          ],
          maximumStacks: 1,
        },
      },
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPeriodicDamageHealingDoneAura",
          value: 2 * rank,
          affectedSpells: [
            "Mindflay",
            "Shadow Word: Pain",
          ],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function EmpoweredRejuvenation(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifySpellPowerAura",
          value: 4 * rank,
          affectedSpells: [
            "Lifebloom",
            "Regrowth",
            "Rejuvenation",
          ],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function FocusedMind(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPowerCostAura",
          value: -5 * rank,
          affectedSpells: [
            "Mind Blast",
            "Mindflay",
          ],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function GiftOfNature(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyDamageHealingDoneAura",
          value: 2 * rank,
          affectedSpells: [
            "Lifebloom",
            "Regrowth",
          ],
          maximumStacks: 1,
        },
      },
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPeriodicDamageHealingDoneAura",
          value: 2 * rank,
          affectedSpells: [
            "Lifebloom",
            "Regrowth",
            "Rejuvenation",
          ],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function ImprovedMindBlast(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyCooldownAura",
          value: -500 * rank,
          affectedSpells: ["Mind Blast"],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function ImprovedRegrowth(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyCritChanceAura",
          value: 10 * rank,
          affectedSpells: ["Regrowth"],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function ImprovedRejuvenation(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPeriodicDamageHealingDoneAura",
          value: 5 * rank,
          affectedSpells: ["Rejuvenation"],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function ImprovedShadowWordPain(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyDurationAura",
          value: 3000 * rank,
          affectedSpells: ["Shadow Word: Pain"],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function Intensity(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "AllowPercentOfManaRegenInCombatAura",
          value: 10 * rank,
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function LivingSpirit(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsPercentAura",
          value: 5 * rank,
          affectedStats: ["SPIRIT"],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function NaturalPerfection(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifySpellCritPercentAura",
          value: rank,
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function ShadowFocus(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyHitChanceAura",
          value: 2 * rank,
          affectedSpells: [
            "Mind Blast",
            "Mindflay",
            "Shadow Word: Death",
            "Shadow Word: Pain",
            "Vampiric Touch",
          ],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/**
 * @param {number} id
 * @param {number} rank
 */
function ShadowPower(id, rank) {
  return talentSpell(
    id,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyCritChanceAura",
          value: 3 * rank,
          affectedSpells: [
            "Mind Blast",
            "Shadow Word: Death"
          ],
          maximumStacks: 1,
        },
      },
    ]
  );
}

/** @type {{ [x in SpellName]: Spell }} */
export const spellDatabase = {
  "Arcane Brilliance": {
    id: 27127,
    cost: 1800,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 3600000,
    school: "ARCANE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            INTELLECT: 40,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Aura of the Crusader": {
    id: 39441,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 10000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            DAMAGE: 8,
          },
          maximumStacks: 10,
        },
      },
    ],
  },
  "Band of the Eternal Restorer": {
    id: 35087,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 60000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 10000,
    school: "ARCANE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            HEALING: 175,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Band of the Eternal Sage": {
    id: 35084,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 60000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 10000,
    school: "ARCANE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            DAMAGE: 95,
            HEALING: 95,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Blessing of the Silver Crescent": {
    id: 35163,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 120000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 20000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            DAMAGE: 155,
            HEALING: 155,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Brilliant Mana Oil": {
    id: 25123,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 3600000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            MP5: 12,
            HEALING: 25,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Curse of Elements": {
    id: 27228,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 300000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPercentSpellDamageTakenAura",
          value: 10,
          schools: ["ARCANE", "FROST", "SHADOW"],
          maximumStacks: 1,
        },
      },
    ],
  },
  "Dark Iron Pipeweed": {
    id: 51953,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 120000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 20000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            DAMAGE: 155,
            HEALING: 155,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Darkness (Rank 1)": Darkness(15259, 1),
  "Darkness (Rank 2)": Darkness(15307, 2),
  "Darkness (Rank 3)": Darkness(15308, 3),
  "Darkness (Rank 4)": Darkness(15309, 4),
  "Darkness (Rank 5)": Darkness(15310, 5),
  "Divine Spirit": {
    id: 25312,
    cost: 680,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 3600000,
    school: "HOLY",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            SPIRIT: 50,
          },
          maximumStacks: 1,
        },
      },
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsByPercentOfStatAura",
          value: 0,
          stat: "SPIRIT",
          affectedStats: [
            "ARCANE_DAMAGE",
            "DAMAGE",
            "HEALING",
            "HOLY_DAMAGE",
            "SHADOW_DAMAGE",
          ],
          maximumStacks: 1,
        },
      },
    ],
  },
  "Elixir of Draenic Wisdom": {
    id: 39627,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 3600000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            INTELLECT: 30,
            SPIRIT: 30,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Elixir of Healing Power": {
    id: 28491,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 3600000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            HEALING: 50,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Empowered Rejuvenation (Rank 1)": EmpoweredRejuvenation(33886, 1),
  "Empowered Rejuvenation (Rank 2)": EmpoweredRejuvenation(33887, 2),
  "Empowered Rejuvenation (Rank 3)": EmpoweredRejuvenation(33888, 3),
  "Empowered Rejuvenation (Rank 4)": EmpoweredRejuvenation(33889, 4),
  "Empowered Rejuvenation (Rank 5)": EmpoweredRejuvenation(33890, 5),
  "Essence of the Martyr": {
    id: 35165,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 120000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 20000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            HEALING: 297,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Fel Infusion": {
    id: 40396,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 120000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 20000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            HASTE_SPELL_RATING: 175,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Flask of Pure Death": {
    id: 28540,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 7200000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            FIRE_DAMAGE: 80,
            FROST_DAMAGE: 80,
            SHADOW_DAMAGE: 80,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Focused Mind (Rank 1)": FocusedMind(33213, 1),
  "Focused Mind (Rank 2)": FocusedMind(33214, 2),
  "Focused Mind (Rank 3)": FocusedMind(33215, 3),
  "Gift of Nature (Rank 1)": GiftOfNature(17104, 1),
  "Gift of Nature (Rank 2)": GiftOfNature(24943, 2),
  "Gift of Nature (Rank 3)": GiftOfNature(24944, 3),
  "Gift of Nature (Rank 4)": GiftOfNature(24945, 4),
  "Gift of Nature (Rank 5)": GiftOfNature(24946, 5),
  "Gift of the Wild": {
    id: 26991,
    cost: 1515,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 3600000,
    school: "NATURE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            ARMOR: 340,
            STRENGTH: 14,
            AGILITY: 14,
            STAMINA: 14,
            INTELLECT: 14,
            SPIRIT: 14,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Greater Blessing of Kings": {
    id: 25898,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 3600000,
    school: "HOLY",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsPercentAura",
          value: 10,
          affectedStats: [
            "STRENGTH",
            "AGILITY",
            "STAMINA",
            "INTELLECT",
            "SPIRIT",
          ],
          maximumStacks: 1,
        },
      },
    ],
  },
  "Greater Blessing of Wisdom": {
    id: 27143,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 3600000,
    school: "HOLY",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ManaRegenAura",
          value: 41,
          maximumStacks: 1,
        },
      },
    ],
  },
  "Heal (Crystal Spire of Karabor)": {
    id: 40972,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 0,
    school: "HOLY",
    effects: [
      {
        action: "Heal",
        type: "Immediate",
        value: 180,
        spMod: 1,
      },
    ],
  },
  "Healing Touch": {
    id: 26979,
    cost: 935,
    castTimeMs: 3500,
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 0,
    school: "NATURE",
    effects: [
      {
        action: "Heal",
        type: "Immediate",
        value: 2707,
        spMod: 1,
      },
    ],
  },
  "Hopped Up": {
    id: 51954,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 120000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 20000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            HEALING: 297,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Improved Blessing of Wisdom": talentSpell(
    20245,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifySpellEffectivenessAura",
          value: 20,
          affectedSpells: [
            "Greater Blessing of Wisdom",
          ],
          maximumStacks: 1,
        },
      },
    ],
  ),
  "Improved Divine Spirit": talentSpell(
    33182,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifySpellEffectValueAura",
          effectIndex: 1,
          value: 10,
          affectedSpells: ["Divine Spirit"],
          maximumStacks: 1,
        },
      },
    ]
  ),
  "Improved Mark of the Wild": talentSpell(
    17055,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifySpellEffectivenessAura",
          value: 35,
          affectedSpells: ["Gift of the Wild"],
          maximumStacks: 1,
        },
      },
    ]
  ),
  "Improved Mind Blast (Rank 1)": ImprovedMindBlast(15273, 1),
  "Improved Mind Blast (Rank 2)": ImprovedMindBlast(15312, 2),
  "Improved Mind Blast (Rank 3)": ImprovedMindBlast(15313, 3),
  "Improved Mind Blast (Rank 4)": ImprovedMindBlast(15314, 4),
  "Improved Mind Blast (Rank 5)": ImprovedMindBlast(15316, 5),
  "Improved Power Word: Fortitude": talentSpell(
    14767,
    [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifySpellEffectivenessAura",
          value: 30,
          affectedSpells: ["Prayer of Fortitude"],
          maximumStacks: 1,
        },
      },
    ]
  ),
  "Improved Regrowth (Rank 1)": ImprovedRegrowth(17074, 1),
  "Improved Regrowth (Rank 2)": ImprovedRegrowth(17075, 2),
  "Improved Regrowth (Rank 3)": ImprovedRegrowth(17076, 3),
  "Improved Regrowth (Rank 4)": ImprovedRegrowth(17077, 4),
  "Improved Regrowth (Rank 5)": ImprovedRegrowth(17078, 5),
  "Improved Rejuvenation (Rank 1)": ImprovedRejuvenation(17111, 1),
  "Improved Rejuvenation (Rank 2)": ImprovedRejuvenation(17112, 2),
  "Improved Rejuvenation (Rank 3)": ImprovedRejuvenation(17113, 3),
  "Improved Shadow Word: Pain (Rank 1)": ImprovedShadowWordPain(15275, 1),
  "Improved Shadow Word: Pain (Rank 2)": ImprovedShadowWordPain(15317, 2),
  "Inner Focus": {
    id: 14751,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 180000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 0,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPowerCostAura",
          value: -100,
          affectedSpells: [
            "Mind Blast",
            "Mindflay",
            "Shadowform",
            "Shadow Word: Death",
            "Shadow Word: Pain",
            "Starshards",
            "Vampiric Touch",
          ],
          maximumStacks: 1,
        },
      },
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyCritChanceAura",
          value: 25,
          affectedSpells: [
            "Mind Blast",
            "Shadow Word: Death",
          ],
          maximumStacks: 1,
        },
      },
    ],
  },
  Innervate: {
    id: 29166,
    cost: 94,
    castTimeMs: "Instant",
    cooldownMs: 360000,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 20000,
    school: "NATURE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "AllowPercentOfManaRegenInCombatAura",
          value: 100,
          maximumStacks: 1,
        },
      },
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyManaRegenPercentAura",
          value: 400,
          maximumStacks: 1,
        },
      },
    ],
  },
  "Inspiring Presence": {
    id: 28878,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 0,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            HIT_SPELL_PERCENT: 1,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Intensity (Rank 1)": Intensity(17106, 1),
  "Intensity (Rank 2)": Intensity(17107, 2),
  "Intensity (Rank 3)": Intensity(17108, 3),
  "Lesser Spell Blasting": {
    id: 32108,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 10000,
    school: "ARCANE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            DAMAGE: 92,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  Lifebloom: {
    id: 33763,
    cost: 220,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 7000,
    school: "NATURE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          action: "Heal",
          type: "PeriodicAura",
          value: 39,
          periodMs: 1000,
          spMod: 0.0742,
          maximumStacks: 3,
        },
      },
      {
        type: "LifebloomBloom",
        value: 600,
        spMod: 0.3434,
      },
    ],
  },
  "Living Spirit (Rank 1)": LivingSpirit(34151, 1),
  "Living Spirit (Rank 2)": LivingSpirit(34152, 2),
  "Living Spirit (Rank 3)": LivingSpirit(34153, 3),
  "Meditation (Rank 1)": Intensity(14521, 1),
  "Meditation (Rank 2)": Intensity(14776, 2),
  "Meditation (Rank 3)": Intensity(14777, 3),
  Mindflay: {
    id: 15407,
    cost: 45,
    castTimeMs: "Channeled",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 3000,
    school: "SHADOW",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          action: "School Damage",
          type: "PeriodicAura",
          value: 25,
          periodMs: 1000,
          spMod: 0.19,
          maximumStacks: 1,
        },
      },
    ],
  },
  "Mind Blast": {
    id: 25375,
    cost: 450,
    castTimeMs: 1500,
    cooldownMs: 8000,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 0,
    school: "SHADOW",
    effects: [
      {
        action: "School Damage",
        type: "Immediate",
        value: 708,
        spMod: 0.429,
      },
    ],
  },
  Misery: {
    id: 33200,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 24000,
    school: "SHADOW",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPercentSpellDamageTakenAura",
          value: 5,
          schools: [
            "ARCANE",
            "FROST",
            "HOLY",
            "NATURE",
            "SHADOW",
          ],
          maximumStacks: 1,
        },
      },
    ],
  },
  "Mojo Madness": {
    id: 43712,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 120000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 20000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            DAMAGE: 211,
            HEALING: 211,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Natural Perfection (Rank 1)": NaturalPerfection(33881, 1),
  "Natural Perfection (Rank 2)": NaturalPerfection(33882, 2),
  "Natural Perfection (Rank 3)": NaturalPerfection(33883, 3),
  "Prayer of Fortitude": {
    id: 25392,
    cost: 1800,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 3600000,
    school: "HOLY",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            STAMINA: 79,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  Regrowth: {
    id: 26980,
    cost: 675,
    castTimeMs: 2000,
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 21000,
    school: "NATURE",
    effects: [
      {
        action: "Heal",
        type: "Immediate",
        value: 1215,
        spMod: 0.286,
      },
      {
        type: "ApplyAura",
        aura: {
          action: "Heal",
          type: "PeriodicAura",
          value: 182,
          periodMs: 3000,
          spMod: 0.1,
          maximumStacks: 1,
        },
      },
    ],
  },
  Rejuvenation: {
    id: 26982,
    cost: 415,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 12000,
    school: "NATURE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          action: "Heal",
          type: "PeriodicAura",
          value: 265,
          periodMs: 3000,
          spMod: 0.2,
          maximumStacks: 1,
        },
      },
    ],
  },
  Shadowform: {
    id: 15473,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 0,
    school: "SHADOW",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPercentSpellDamageDoneAura",
          value: 15,
          schools: ["SHADOW"],
          maximumStacks: 1,
        },
      },
    ],
  },
  "Shadow Focus (Rank 1)": ShadowFocus(15260, 1),
  "Shadow Focus (Rank 2)": ShadowFocus(15327, 2),
  "Shadow Focus (Rank 3)": ShadowFocus(15328, 3),
  "Shadow Focus (Rank 4)": ShadowFocus(15329, 4),
  "Shadow Focus (Rank 5)": ShadowFocus(15330, 5),
  "Shadow Power (Rank 1)": ShadowPower(33221, 1),
  "Shadow Power (Rank 2)": ShadowPower(33222, 2),
  "Shadow Power (Rank 3)": ShadowPower(33223, 3),
  "Shadow Power (Rank 4)": ShadowPower(33224, 4),
  "Shadow Power (Rank 5)": ShadowPower(33225, 5),
  "Shadow Weaving": {
    id: 15334,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 0,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPercentSpellDamageTakenAura",
          value: 10,
          schools: ["SHADOW"],
          maximumStacks: 1,
        },
      },
    ],
  },
  "Shadow Word: Death": {
    id: 32996,
    cost: 309,
    castTimeMs: "Instant",
    cooldownMs: 12000,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 0,
    school: "SHADOW",
    effects: [
      {
        action: "School Damage",
        type: "Immediate",
        value: 572,
        spMod: 0.429,
      },
    ],
  },
  "Shadow Word: Pain": {
    id: 25368,
    cost: 575,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 18000,
    school: "SHADOW",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          action: "School Damage",
          type: "PeriodicAura",
          value: 206,
          periodMs: 3000,
          spMod: 0.183,
          maximumStacks: 1,
        },
      },
    ],
  },
  "Spell Focus Trigger": {
    id: 32837,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 35000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 6000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            HASTE_SPELL_RATING: 320,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  Starshards: {
    id: 25446,
    cost: 575,
    castTimeMs: "Instant",
    cooldownMs: 30000,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 15000,
    school: "ARCANE",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          action: "School Damage",
          type: "PeriodicAura",
          value: 157,
          periodMs: 3000,
          spMod: 0.167,
          maximumStacks: 1,
        },
      },
    ],
  },
  "Super Mana Potion": {
    id: 28499,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 120000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 0,
    school: "PHYSICAL",
    effects: [
      {
        type: "GiveMana",
        value: 2400,
      },
    ],
  },
  "Superior Wizard Oil": {
    id: 28012,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 3600000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            DAMAGE: 42,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Swiftmend": {
    id: 18562,
    cost: 379,
    castTimeMs: "Instant",
    cooldownMs: 15000,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 0,
    school: "NATURE",
    effects: [
      // TODO: Swiftmend
    ],
  },
  "Tree of Life": {
    id: 33891,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 0,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyPowerCostAura",
          value: -20,
          affectedSpells: [
            "Lifebloom",
            "Regrowth",
            "Rejuvenation",
            "Swiftmend",
          ],
          maximumStacks: 1,
        },
      },
    ],
  },
  "Vampiric Touch": {
    id: 34914,
    cost: 325,
    castTimeMs: 1500,
    cooldownMs: 0,
    gcdMs: 1500,
    gcdCategory: "Normal",
    durationMs: 15000,
    school: "SHADOW",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          action: "School Damage",
          type: "PeriodicAura",
          value: 90,
          periodMs: 3000,
          spMod: 0.2,
          maximumStacks: 1,
        },
      },
    ],
  },
  "Well Fed (23 Spell Damage, 20 Spirit)": {
    id: 33263,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 1800000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            DAMAGE: 23,
            SPIRIT: 20,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Well Fed (44 Healing, 20 Spirit)": {
    id: 33268,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 0,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 1800000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ModifyStatsAura",
          value: 0,
          addedStats: {
            HEALING: 44,
            SPIRIT: 20,
          },
          maximumStacks: 1,
        },
      },
    ],
  },
  "Wisdom (Memento of Tyrande)": {
    id: 37656,
    cost: 0,
    castTimeMs: "Instant",
    cooldownMs: 50000,
    gcdMs: 0,
    gcdCategory: "None",
    durationMs: 15000,
    school: "PHYSICAL",
    effects: [
      {
        type: "ApplyAura",
        aura: {
          type: "ManaRegenAura",
          value: 76,
          maximumStacks: 1,
        },
      },
    ],
  },
};
