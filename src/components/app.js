import { h } from "https://cdn.pika.dev/preact";
import { useState } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import CharacterDisplay from "./characterDisplay.js";
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

  /**
   * @type {[boolean, (v: boolean) => void]}
   */
  const [debugStats, setDebugStats] = useState(false);

  const tabs = [];
  for (const [name, characterData] of Object.entries(characters)) {
    tabs.push({
      title: name,
      component: html`
        <${CharacterDisplay}
          key=${name}
          characterData=${characterData}
          sourceFilter=${sourceFilter}
          latestPhase=${latestPhase}
          showObsolete=${showObsolete}
          debugStats=${debugStats}
        />
      `,
    });
  }

  return html`
    <div>
      <${GearFilters}
        sourceFilter=${sourceFilter}
        onSourceFilterChanged=${setSourceFilter}
        latestPhase=${latestPhase}
        onLatestPhaseChanged=${setLatestPhase}
        showObsolete=${showObsolete}
        onShowObsoleteChanged=${setShowObsolete}
        debugStats=${debugStats}
        onDebugStatsChanged=${setDebugStats}
      />
      <div>
        <a href="https://wowwiki-archive.fandom.com/wiki/Stat_comparison">Stat Comparison</a>
      </div>
    </div>
    <${TabbedContainer} tabs=${tabs} defaultSelectedIndex=${0} />
  `;
}
