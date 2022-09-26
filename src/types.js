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
 *  "Black Temple" |
 *  "Hyjal Summit" |
 *  "Sunwell Plateau" |
 *  "Zul'Aman"
 * )} Instance
 *
 * @typedef {(
 *  "Honor Hold" |
 *  "Scale of the Sands" |
 *  "The Aldor" |
 *  "The Sha'tar"
 * )} Faction
 *
 * @typedef BaseItem
 * @property {1 | 2 | 3 | 4 | 5} phase
 * @property {Slot} slot
 * @property {number=} subItem
 *
 * @typedef {BaseItem & { source: "Auction House" }} AuctionItem
 * @typedef {BaseItem & { source: "Badges of Justice", cost: number }} BadgeItem
 * @typedef {BaseItem & { source: "Crafting" }} CraftingItem
 * @typedef {BaseItem & { source: "Instance", instance: Instance, boss?: string }} InstanceItem
 * @typedef {BaseItem & { source: "Quests", quest: number }} QuestItem
 * @typedef {BaseItem & { source: "Reputation", faction: Faction }} ReputationItem
 *
 * @typedef {(
 *  AuctionItem |
 *  BadgeItem |
 *  CraftingItem |
 *  QuestItem |
 *  InstanceItem |
 *  ReputationItem
 * )} Item
 */

/**
 * @typedef ItemData
 * @property {number[]=} exclusiveWith
 */
