import { h } from "https://cdn.pika.dev/preact";
import { useContext, useLayoutEffect } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import Tooltips from "./tooltipContext.js";

const html = htm.bind(h);

/**
 * @typedef {import("../sim.js").SimState} SimState
 * @typedef {import("../types.js").Entity} Entity
 * @typedef {import("../types.js").Event} Event
 * @typedef {import("../types.js").EventAction} EventAction
 */

const timeGranularityMs = 100;
const sectionSizePx = 6;
const pixelsPerMs = sectionSizePx / timeGranularityMs;

/**
 * @typedef RulerProps
 * @property {number} lastEventTimeMs
 */

/**
 * @param {RulerProps} props
 */
function Ruler(props) {
  const sectionCount = Math.ceil(props.lastEventTimeMs / timeGranularityMs);
  const secondMultiple = 1000 / timeGranularityMs;

  /** @type {unknown[]} */
  const rules = [];
  for (let section = 0; section < sectionCount; ++section) {
    let className;
    let rulerTick;
    if (section % secondMultiple === 0) {
      className = "second";
      rulerTick = html`
        <div class="ruler-tick">
          ${(section / secondMultiple).toFixed(1)}
        </div>
      `;
    } else if (section % (secondMultiple / 2) === 0) {
      className = "half-second";
      rulerTick = html`
        <div class="ruler-tick">
          ${(section / secondMultiple).toFixed(1)}
        </div>
      `;
    } else {
      className = "hundredth-second";
      rulerTick = undefined;
    }

    rules.push(html`
      <div key=${section} class=${className}>
        ${rulerTick}
      </div>
    `);
  }

  return html`
    <div class="ruler-container">
      ${rules}
    </div>
  `;
}

/**
 * @param {Entity} entity
 * @param {Event[]} events
 */
function eventsForEntity(entity, events) {
  const entityEvents = events.filter(event => {
    switch (event.type) {
      case "ApplyAuraEvent":
      case "ExpireAuraEvent":
      case "HealthChangeEvent":
      case "ManaChangeEvent":
        return event.target === entity;

      case "CastCompletedEvent":
      case "CastStartedEvent":
      case "CastStoppedEvent":
      case "GcdExpiredEvent":
      case "SpellCooldownExpiredEvent":
        return event.caster === entity;
    }

    return false;
  });

  entityEvents.sort((a, b) => a.currentTimeMs - b.currentTimeMs);
  return entityEvents;
}

/** @typedef {{ start: Event, end: Event }} EventBlock */

/**
 * @param {Event[]} events
 * @param {number} lastEventTimeMs
 * @return {EventBlock[]}
 */
function aggregateEvents(events, lastEventTimeMs) {
  /** @type {EventBlock[]} */
  const completedBlocks = [];

  /** @type {Event[]} */
  let inProgressBlocks = [];

  for (const event of events) {
    switch (event.type) {
      case "ApplyAuraEvent":
        if (!inProgressBlocks.some(block => block.type === "ApplyAuraEvent" && block.aura === event.aura)) {
          inProgressBlocks.push(event);
        }
        break;

      case "CastStartedEvent":
        inProgressBlocks.push(event);
        break;

      case "CastCompletedEvent":
      case "CastStoppedEvent":
        for (const block of inProgressBlocks) {
          if (
            block.type === "CastStartedEvent" &&
            block.caster === event.caster &&
            block.target === event.target &&
            block.spell === event.spell
          ) {
            completedBlocks.push({
              start: block,
              end: event,
            });

            inProgressBlocks = inProgressBlocks.filter(block =>
              block.type !== "CastStartedEvent" ||
              block.caster !== event.caster &&
              block.target !== event.target &&
              block.spell !== event.spell
            );
            break;
          }
        }
        break;

      case "ExpireAuraEvent":
        for (const block of inProgressBlocks) {
          if (block.type === "ApplyAuraEvent" && block.aura === event.aura) {
            completedBlocks.push({
              start: block,
              end: event,
            });

            inProgressBlocks = inProgressBlocks.filter(block =>
              block.type !== "ApplyAuraEvent" || block.aura !== event.aura);
            break;
          }
        }
        break;

      case "GcdExpiredEvent":
      case "HealthChangeEvent":
      case "ManaChangeEvent":
      case "SpellCooldownExpiredEvent":
        completedBlocks.push({
          start: event,
          end: event,
        });
        break;
    }
  }

  // Synthesize any remaining end events
  for (const event of inProgressBlocks) {
    switch (event.type) {
      case "ApplyAuraEvent":
        completedBlocks.push({
          start: event,
          end: {
            ...event,
            type: "ExpireAuraEvent",
            currentTimeMs: lastEventTimeMs,
          },
        });
        break;

      case "CastStartedEvent":
        completedBlocks.push({
          start: event,
          end: {
            ...event,
            type: "CastCompletedEvent",
            currentTimeMs: lastEventTimeMs,
          },
        });
        break;
    }
  }

  return completedBlocks;
}

/**
 * @param {EventBlock} eventBlock
 */
function contentForEventBlock(eventBlock) {
  switch (eventBlock.start.type) {
    case "ApplyAuraEvent":
    case "CastStartedEvent":
      return html`
        <a
          href=${`https://tbc.wowhead.com/spell=${eventBlock.start.spell.id}`}
          data-wh-icon-size="small"
          data-wh-rename-link="false"
        >
        </a>
      `;

    case "GcdExpiredEvent":
      return "\xa0";

    case "HealthChangeEvent":
      return "\xa0";

    case "ManaChangeEvent":
      return "\xa0";

    case "SpellCooldownExpiredEvent":
      return "\xa0";
  }
}

/**
 * @param {Event[]} events
 * @param {number} lastEventTimeMs
 */
function eventsToDivs(events, lastEventTimeMs) {
  const eventBlocks = aggregateEvents(events, lastEventTimeMs);
  return eventBlocks.map((block, index) => {
    const durationMs = block.end.currentTimeMs - block.start.currentTimeMs;
    const style = {
      left: `${block.start.currentTimeMs * pixelsPerMs}px`,
      width: `${(Math.max(durationMs, timeGranularityMs) * pixelsPerMs) - 1}px`,
    };
    return html`
      <div
        key=${index}
        class="timeline-event"
        style=${style}
        title=${`${block.start.type}, ${block.end.type}`}
      >
        ${contentForEventBlock(block)}
      </div>
    `;
  });
}

/**
 * @typedef SwimlaneProps
 * @property {string} name
 * @property {Entity} entity
 * @property {Event[]} events
 */

/**
 * @param {SwimlaneProps} props
 */
function Swimlane(props) {
  const lastEventTimeMs = Math.max(...props.events.map(event => event.currentTimeMs));

  const castingLane = props.events.filter(event =>
    event.type === "CastCompletedEvent" ||
    event.type === "CastStartedEvent" ||
    event.type === "CastStoppedEvent"
  );

  const auraLanes = props.events.reduce((lanes, event) => {
    if (event.type !== "ApplyAuraEvent" && event.type !== "ExpireAuraEvent") {
      return lanes;
    }

    if (!(event.spell.id in lanes)) {
      lanes[event.spell.id] = [];
    }

    lanes[event.spell.id].push(event);

    return lanes;
  }, /** @type {{ [spellId: number]: Event[] }} */({}));

  const auraLaneDivs = Object.entries(auraLanes).map(([spellId, events]) => html`
    <div key=${spellId}>
      ${eventsToDivs(events, lastEventTimeMs)}
    </div>
  `);

  const cooldownLane = props.events.filter(event =>
    event.type === "GcdExpiredEvent" ||
    event.type === "SpellCooldownExpiredEvent"
  );
  const healthLane = props.events.filter(event =>
    event.type === "HealthChangeEvent"
  );
  const manaLane = props.events.filter(event =>
    event.type === "ManaChangeEvent"
  );

  return html`
    <tr>
      <th>${props.name}</th>
      <td>
        <div>${eventsToDivs(castingLane, lastEventTimeMs)}</div>
        <div>${eventsToDivs(cooldownLane, lastEventTimeMs)}</div>
        ${auraLaneDivs}
        <div>${eventsToDivs(manaLane, lastEventTimeMs)}</div>
        <div>${eventsToDivs(healthLane, lastEventTimeMs)}</div>
      </td>
    </tr>
  `;
}

/**
 * @typedef TimelineProps
 * @property {SimState[]} simStates
 */

/**
 * @param {TimelineProps} props
 */
export default function Timeline(props) {
  /**
   * @type {() => void}
   */
  const refreshTooltips = useContext(Tooltips);

  useLayoutEffect(refreshTooltips);

  if (props.simStates.length === 0) {
    return undefined;
  }

  const events = props.simStates.flatMap(state => state.events);
  const lastEventTimeMs = Math.max(...events.map(event => event.currentTimeMs));

  const swimlanes = [
    html`
      <${Swimlane}
        key=${"Self"}
        name=${"Self"}
        entity=${props.simStates[0].entity}
        events=${eventsForEntity(props.simStates[0].entity, events)}
      />
    `,
    ...props.simStates[0].targets.map((target, index) => {
      const eventsForTarget = eventsForEntity(target, events);
      if (eventsForTarget.length === 0) {
        return undefined;
      }

      return html`
        <${Swimlane}
          key=${index}
          name=${`Target ${index}`}
          entity=${target}
          events=${eventsForTarget}
        />
      `;
    }),
  ]
  return html`
    <section class="timeline">
      <table>
        <thead>
          <tr>
            <th></th>
            <td>
              <${Ruler} lastEventTimeMs=${lastEventTimeMs} />
            </td>
          </tr>
        </thead>
        <tbody>
          ${swimlanes}
        </tbody>
      </table>
    </section>
  `;
}
