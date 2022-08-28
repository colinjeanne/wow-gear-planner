import { h } from "https://cdn.pika.dev/preact";
import { useState } from "https://cdn.pika.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";

import { applyBuffsToTarget, getEntityFromCharacterData } from "../classes/entity.js";
import { simulate } from "../sim.js";
import SimulationAnalysis from "./simulationAnalysis.js";
import Timeline from "./timeline.js";

/**
 * @typedef { import("../characters.js").CharacterData } CharacterData
 * @typedef { import("../types.js").Entity } Entity
 * @typedef { import("../types.js").EventAction } EventAction
 * @typedef { import("../types.js").SimulationStrategy } SimulationStrategy
 * @typedef { import("../types.js").SpellName } SpellName
 * @typedef { import("../sim.js").SimState } SimState
 */

const html = htm.bind(h);

/**
 * @param {CharacterData} characterData
 * @param {SpellName[]} bufferAuraSpellNames
 * @param {Set<SpellName>} entityAuras
 */
function buildEntity(characterData, bufferAuraSpellNames, entityAuras) {
  const entity = getEntityFromCharacterData(characterData);
  applyBuffsToTarget(entity, bufferAuraSpellNames, entityAuras, 0);
  return entity;
}

/**
 * @typedef RunnerProps
 * @property {Entity} entity
 * @property {Set<SpellName>} targetAuras
 * @property {SimulationStrategy} simulationStrategy
 */

/**
 * @param {RunnerProps} props
 */
function SimulationRunner(props) {
  const simulationLengthMs = 240000;

  /** @type {[Generator<SimState, void, unknown>]} */
  const [iterator] = useState(
    simulate(
      props.entity,
      1,
      props.targetAuras,
      simulationLengthMs,
      props.simulationStrategy.onSimulationEvent.bind(props.simulationStrategy)
    )
  );

  /** @type {[SimState[], (v: SimState[]) => void]} */
  const [states, setStates] = useState([]);

  /** @type {[boolean, (v: boolean) => void]} */
  const [isDone, setIsDone] = useState(false);

  const allEvents = states.flatMap(state => state.events);

  return html`
    <section class="simulation-selection">
      <button
        disabled=${isDone}
        onClick=${() => {
      let next = iterator.next();
      while (
        !next.done &&
        (
          next.value.nextAction.type === "Continue" &&
          next.value.events.length === 1
        )
      ) {
        next = iterator.next();
      }

      if (next.done) {
        setIsDone(true);
      } else {
        setStates([...states, next.value]);
      }
    }}
      >
        Next
      </button>
      <button
        disabled=${isDone}
        onClick=${() => {
      const newStates = [];
      let next = iterator.next();
      while (!next.done) {
        if (next.value.nextAction.type !== "Continue" || next.value.events.length > 1) {
          newStates.push(next.value);
        }
        next = iterator.next();
      }

      setIsDone(true);
      setStates([...states, ...newStates]);
    }}
      >
        Full Run
      </button>
    </section>
    ${allEvents.length > 0 && html`
      <${SimulationAnalysis}
        entity=${props.entity}
        events=${states.flatMap(state => state.events)}
        simulationLengthMs=${simulationLengthMs}
      />
      <${Timeline}
        simStates=${states}
      />
    `}
  `;
}

/**
 * @typedef Props
 * @property {CharacterData} characterData
 * @property {Set<SpellName>} entityAuras
 * @property {Set<SpellName>} targetAuras
 * @property {SpellName[]} bufferAuraSpellNames
 */

/**
 * @param {Props} props
 */
export default function Simulation(props) {
  /** @type {[Entity]} */
  const [entity] = useState(
    buildEntity(props.characterData, props.bufferAuraSpellNames, props.entityAuras),
    [props.characterData]
  );

  /** @type {[string | undefined, (strategyName: string) => void]} */
  const [simulationStrategy, setSimulationStrategy] = useState(entity.getSimulationNames()[0]);

  const simulationOptions = entity.getSimulationNames().map(name => html`
    <option key=${name} value=${name}>${name}</option>
  `);
  const simulationSelect = html`
    <select
      onChange=${(/** @type {Event} */ e) =>
      setSimulationStrategy(/** @type {HTMLSelectElement} */(e.target).value)}
    >
      ${simulationOptions}
    </select>
  `;

  if (!simulationStrategy) {
    return simulationSelect;
  }

  return html`
    ${simulationSelect}
    <${SimulationRunner}
      entity=${entity}
      targetAuras=${props.targetAuras}
      simulationStrategy=${entity.getSimulationStrategy(simulationStrategy)}
    />
  `;
}
