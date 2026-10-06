/**
 * Picks the client for `--ai-model` and `--ai-effort`.
 *
 * opencode names models `provider/model`, and its own gateways, `opencode/…`
 * for a Zen account and `opencode-go/…` for a Go subscription, are
 * unambiguous signs the model is not one of Codex's; the whole string then
 * goes to opencode unchanged. Other `provider/model` names stay with Codex,
 * which takes them too when configured for OpenRouter. Everything else, no
 * model at all included, goes to Codex, whose default model is the
 * templatizer's default.
 *
 * The effort is checked here, before any contract is analysed, because
 * neither backend says so early: opencode silently runs a level the model
 * does not have at its default, and Codex sends it to the API, which
 * rejects it on every turn.
 */
import {
  CodexClient,
  REASONING_EFFORTS,
  type ReasoningEffort,
} from './CodexClient'
import type { ModelClient } from './ModelClient'
import { OpenCodeClient } from './OpenCodeClient'
import { openCodeEffortLevels } from './openCodeModels'

const OPENCODE_GATEWAYS = ['opencode/', 'opencode-go/']

/** High rather than either backend's default: authoring a template is the hard kind of turn. */
export const DEFAULT_EFFORT = 'high'

export interface ModelChoice {
  model?: string
  /** Unset means `DEFAULT_EFFORT`, unless the model has no levels at all. */
  effort?: string
}

export interface ChosenModel {
  client: ModelClient
  /** The model and effort, as the provenance header and the logs name them. */
  label: string
  /** Undefined when the model has no effort levels. */
  effort?: string
}

export async function chooseModel(
  choice: ModelChoice,
  effortLevelsOf: (
    model: string,
  ) => Promise<string[] | undefined> = openCodeEffortLevels,
): Promise<ChosenModel> {
  const { model } = choice
  if (isOpenCodeGatewayModel(model)) {
    const levels = await effortLevelsOf(model)
    const effort = openCodeEffort(model, levels, choice.effort)
    return {
      client: new OpenCodeClient({ model, variant: effort }),
      label: describeModel(model, effort),
      effort,
    }
  }
  const effort = codexEffort(choice.effort ?? DEFAULT_EFFORT)
  return {
    client: new CodexClient({ model, reasoningEffort: effort }),
    label: describeModel(model, effort),
    effort,
  }
}

function isOpenCodeGatewayModel(model: string | undefined): model is string {
  return OPENCODE_GATEWAYS.some((prefix) => model?.startsWith(prefix) === true)
}

function openCodeEffort(
  model: string,
  levels: string[] | undefined,
  asked: string | undefined,
): string | undefined {
  if (levels === undefined) {
    const provider = model.slice(0, model.indexOf('/'))
    throw new Error(
      `opencode lists no model ${model}; \`opencode models ${provider}\` shows the ones there are`,
    )
  }
  if (levels.length === 0 && asked === undefined) {
    return undefined
  }
  const effort = asked ?? DEFAULT_EFFORT
  if (levels.includes(effort)) {
    return effort
  }
  if (levels.length === 0) {
    throw new Error(
      `${model} has no effort levels; leave --ai-effort out to run it`,
    )
  }
  const which =
    asked === undefined ? `${effort} effort, the default` : `${effort} effort`
  throw new Error(
    `${model} has no ${which}; pass --ai-effort with one of ${levels.join(', ')}`,
  )
}

function codexEffort(effort: string): ReasoningEffort {
  const known = REASONING_EFFORTS.find((level) => level === effort)
  if (known === undefined) {
    throw new Error(
      `Codex takes --ai-effort ${REASONING_EFFORTS.join(', ')}; got ${effort}`,
    )
  }
  return known
}

/** The model as a provenance header names it, even when none was asked for. */
export function describeModel(
  model: string | undefined,
  effort: string | undefined,
): string {
  const name = model ?? 'codex default model'
  return effort === undefined ? name : `${name}, ${effort} effort`
}
