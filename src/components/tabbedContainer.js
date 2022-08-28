import { h } from "https://cdn.pika.dev/preact";
import { useState } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

/**
 * @typedef Tab
 * @property {string} title
 * @property {any} component
 */

/**
 * @typedef Props
 * @property {Tab[]} tabs
 * @property {number} defaultSelectedIndex
 */

/**
 * @param {Props} props
 */
export default function TabbedContainer(props) {
  const [selectedIndex, setSelectedIndex] = useState(props.defaultSelectedIndex);

  const navigation = props.tabs.map((tab, index) => html`
    <li key=${tab.title}>
      <a
        class=${index === selectedIndex ? "selected" : undefined}
        onClick=${() => setSelectedIndex(index)}
      >
        ${tab.title}
      </a>
    </li>
  `);
  return html`
    <section class="tabbed-container">
      <nav>
        <ul>
          ${navigation}
        </ul>
      </nav>
      ${props.tabs[selectedIndex].component}
    </section>
  `;
}
