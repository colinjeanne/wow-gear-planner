/** @typedef {import("../types.js").ItemSet} ItemSet */
/** @type {{ [x: number]: ItemSet }} */
export const itemSetDatabase = {
  553: {
    items: [
      21871,
      21869,
      21870,
    ],
    auras: [
      // TODO: Frozen Shadoweave
    ],
  },
  559: {
    items: [
      24266,
      24262,
    ],
    auras: [
      {
        requiredCount: 2,
        aura: {
          type: "ProcTriggerSpellAura",
          value: 100,
          auraProcChance: 5,
          spellName: "Lesser Spell Blasting",
          affectedSpells: [
            "Mind Blast",
            "Mindflay",
            "Shadow Word: Death",
            "Shadow Word: Pain",
            "Starshards",
            "Vampiric Touch",
          ],
          maximumStacks: 1,
        },
      },
    ],
  },
  571: {
    items: [
      24264,
      24261,
    ],
    auras: [
      {
        requiredCount: 2,
        aura: {
          type: "ModifyStatsByPercentOfStatAura",
          value: 10,
          maximumStacks: 1,
          stat: "INTELLECT",
          affectedStats: ["HEALING"],
        },
      },
    ],
  },
  638: {
    items: [
      29087,
      29086,
      29090,
      29088,
      29089,
    ],
    auras: [
      // TODO: Malorne Raiment
    ],
  },
  642: {
    items: [
      30216,
      30217,
      30219,
      30220,
      30221,
    ],
    auras: [
      {
        requiredCount: 2,
        aura: {
          type: "ModifyDurationAura",
          value: 6000,
          maximumStacks: 1,
          affectedSpells: ["Regrowth"],
        },
      },
      {
        requiredCount: 4,
        aura: {
          type: "ModifySpellEffectValueAura",
          value: 150,
          effectIndex: 2,
          maximumStacks: 1,
          affectedSpells: ["Lifebloom"],
        },
      },
    ],
  },
  666: {
    items: [
      30160,
      30161,
      30162,
      30159,
      30163,
    ],
    auras: [
      // TODO: Avatar Regalia
    ],
  },
  674: {
    items: [
      31061,
      31064,
      31067,
      31070,
      31065,
      34434,
      34528,
      34563,
    ],
    auras: [
      {
        requiredCount: 2,
        aura: {
          type: "ModifyDurationAura",
          value: 3000,
          maximumStacks: 1,
          affectedSpells: ["Shadow Word: Pain"],
        },
      },
      {
        requiredCount: 4,
        aura: {
          type: "ModifyDamageHealingDoneAura",
          value: 10,
          maximumStacks: 1,
          affectedSpells: ["Mind Blast"],
        },
      },
    ],
  },
  678: {
    items: [
      31041,
      31032,
      31037,
      31045,
      31047,
      34571,
      34445,
      34554,
    ],
    auras: [
      {
        requiredCount: 2,
        aura: {
          type: "ModifyCooldownAura",
          value: -2000,
          maximumStacks: 1,
          affectedSpells: ["Swiftmend"],
        },
      },
      {
        requiredCount: 4,
        aura: {
          type: "ModifyDamageHealingDoneAura",
          value: 5,
          maximumStacks: 1,
          affectedSpells: ["Healing Touch"],
        },
      },
    ],
  },
};
