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
 *  "Enchanting" |
 *  "Honor Hold" |
 *  "Hyjal Summit" |
 *  "Scale of the Sands" |
 *  "Sunwell Plateau" |
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
 * @typedef ItemData
 * @property {number[]=} exclusiveWith
 */
