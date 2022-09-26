import { h } from "https://cdn.pika.dev/preact";
import { useState } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import CharacterDisplay from "./characterDisplay.js";
import GearDatabase from "./gearDatabase.js";
import GearFilters from "./gearFilters.js";
import TabbedContainer from "./tabbedContainer.js";
import { characters } from "../characters.js";

const html = htm.bind(h);

export default function App() {
  /**
   * @type {[string, (v: string) => void]}
   */
  const [sourceFilter, setSourceFilter] = useState("");

  /**
   * @type {[number, (v: number) => void]}
   */
  const [latestPhase, setLatestPhase] = useState(5);

  /**
   * @type {[boolean, (v: boolean) => void]}
   */
  const [showObsolete, setShowObsolete] = useState(false);

  const tabs = [];
  for (const character of characters) {
    const characterData = Object.values(character.specs)[0];
    tabs.push({
      title: character.name,
      component: html`
        <${CharacterDisplay}
          key=${character.name}
          characterData=${characterData}
          sourceFilter=${sourceFilter}
          latestPhase=${latestPhase}
          showObsolete=${showObsolete}
        />
      `,
    });
  }

  const appModeTabs = [
    {
      title: "Characters",
      component: html`
        <div>
          <${GearFilters}
            sourceFilter=${sourceFilter}
            onSourceFilterChanged=${setSourceFilter}
            latestPhase=${latestPhase}
            onLatestPhaseChanged=${setLatestPhase}
            showObsolete=${showObsolete}
            onShowObsoleteChanged=${setShowObsolete}
          />
        </div>
        <${TabbedContainer} tabs=${tabs} defaultSelectedIndex=${0} />
      `,
    },
    {
      title: "Gear Database",
      component: html`<${GearDatabase} />`,
    },
  ];

  return html`
    <${TabbedContainer} tabs=${appModeTabs} defaultSelectedIndex=${0} />
  `;
}
