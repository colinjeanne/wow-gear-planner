import { writeFile } from "fs/promises";
import { ApiClient } from "./apiClient.js"
import { itemSourceDatabase } from "./src/databases/itemSourceDatabase.js";

/**
 * @typedef {import("./src/types.js").ItemData} ItemData
 */

const apiClient = new ApiClient();

/**
 * @param {number} duration
 */
async function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function generateGearDatabase() {
  /** @type {{ [x: number | string]: ItemData}} */
  const allData = {};

  for (const id of Object.keys(itemSourceDatabase)) {
    try {
      allData[id] = await apiClient.getItemData(id);
    } catch (e) {
      console.error(e);
    }

    await sleep(110);
  }

  const dataString = JSON.stringify(allData, null, 2);
  const fileString = `
/** @typedef {import("../types.js").ItemData} ItemData */
/** @type {{ [x: string]: ItemData }} */
export const gearDatabase = ${dataString};
`;

  await writeFile("./src/databases/gearDatabase.js", fileString);
};

await generateGearDatabase();
