/**
 * What discovery does not read by itself, listed for the model to go
 * through.
 *
 * Every view/pure function that takes at least one argument is state V1
 * cannot read without a handler (the probe of single-`uint256`
 * getters is a guess, not a read). Events are listed too, because
 * event-only state (a list of reverted batches, a history of routes) has no
 * getter to put on the list and was silently dropped when events were only
 * offered as a means of enumeration. The constructor is listed when it has
 * parameters: its arguments are state only a `constructorArgs` field can
 * read, and until it was listed no draft of the quick suite ever wrote that
 * field, while four committed templates of the suite have it. Nothing
 * checks that every item was read: most need no field. An anonymous event
 * is left out: V1's event handler finds logs by the event's topic, which an
 * anonymous log does not carry.
 */
import { utils } from 'ethers'
import { rewriteSolidityIdentifier } from '../handlers/utils/rewriteSolidityIdentifier'
import { AbiIndex } from './abi/AbiIndex'
import type { Baseline } from './facts'

export interface WorklistParam {
  name: string
  /** Canonical ABI type, tuples spelled out, e.g. `(address,uint256)[]`. */
  type: string
}

export interface WorklistItem {
  /** `name(type,type)`. */
  signature: string
  name: string
  /** Full human-readable fragment, so the model sees names and mutability. */
  fragment: string
  inputs: WorklistParam[]
  outputs: WorklistParam[]
  /** V1's system handlers probe this one for this address. */
  probed: boolean
}

export interface WorklistEvent {
  name: string
  signature: string
  fragment: string
  inputs: (WorklistParam & { indexed: boolean })[]
}

export interface WorklistConstructor {
  /** `constructor(type,type)`. */
  signature: string
  /** With parameter names, so the model sees what the deployment set. */
  fragment: string
  inputs: WorklistParam[]
}

export interface Worklist {
  items: WorklistItem[]
  /** Present when the constructor has parameters; see `toConstructorItem`. */
  constructorItem?: WorklistConstructor
  events: WorklistEvent[]
}

/**
 * Items and events are sorted so two runs over the same ABI produce
 * byte-identical worklists, which keeps prompts stable. Overloaded events
 * collapse to one entry per name because V1 resolves an event by name.
 * Whether an item is probed is read off the baseline, where V1's handler
 * list put it, rather than derived from the ABI again.
 */
export function buildWorklist(
  abi: readonly string[],
  baseline: Baseline,
): Worklist {
  const index = AbiIndex.of(abi)
  const items = index.functions
    .filter(needsHandler)
    .map((fragment) => toWorklistItem(fragment, baseline))
    .sort(bySignature)
  const events = uniqueByName(index.events.filter((event) => !event.anonymous))
    .map(toWorklistEvent)
    .sort(bySignature)
  const constructorItem = toConstructorItem(index.deploy)
  return {
    items,
    ...(constructorItem !== undefined && { constructorItem }),
    events,
  }
}

export function isEmptyWorklist(worklist: Worklist): boolean {
  return (
    worklist.items.length === 0 &&
    worklist.constructorItem === undefined &&
    worklist.events.length === 0
  )
}

function needsHandler(fragment: utils.FunctionFragment): boolean {
  return (
    fragment.constant &&
    fragment.inputs.length >= 1 &&
    (fragment.outputs?.length ?? 0) >= 1
  )
}

function toWorklistItem(
  fragment: utils.FunctionFragment,
  baseline: Baseline,
): WorklistItem {
  const field = baseline.fields[rewriteSolidityIdentifier(fragment.name)]
  return {
    signature: fragment.format(utils.FormatTypes.sighash),
    name: fragment.name,
    fragment: fragment.format(utils.FormatTypes.full),
    inputs: fragment.inputs.map(toParam),
    outputs: (fragment.outputs ?? []).map(toParam),
    probed: field?.kind === 'probe' && isProbeFragment(fragment),
  }
}

/**
 * V1 probes exactly the single-`uint256` getters (`getSystemHandlers`), so
 * the baseline's probe under a name is of that overload; a namesake keyed
 * otherwise shares the field name, not the probe, and ruling on it must
 * not put the name into `ignoreMethods`.
 */
function isProbeFragment(fragment: utils.FunctionFragment): boolean {
  return fragment.inputs.length === 1 && fragment.inputs[0]?.type === 'uint256'
}

/**
 * The ABI's first constructor, because that is the one V1's handler decodes
 * the deployment with. One without parameters has nothing to read and is
 * not listed. The token is `constructor(types)` without the mutability,
 * as a constructor has no sighash and `payable` is not part of what it set.
 */
function toConstructorItem(
  fragment: utils.ConstructorFragment | undefined,
): WorklistConstructor | undefined {
  if (fragment === undefined || fragment.inputs.length === 0) {
    return undefined
  }
  const inputs = fragment.inputs.map(toParam)
  return {
    signature: `constructor(${inputs.map((input) => input.type).join(',')})`,
    fragment: fragment.format(utils.FormatTypes.full),
    inputs,
  }
}

function toWorklistEvent(fragment: utils.EventFragment): WorklistEvent {
  return {
    name: fragment.name,
    signature: fragment.format(utils.FormatTypes.sighash),
    fragment: fragment.format(utils.FormatTypes.full),
    inputs: fragment.inputs.map((input) => ({
      ...toParam(input),
      indexed: input.indexed === true,
    })),
  }
}

function toParam(param: utils.ParamType): WorklistParam {
  return {
    name: param.name ?? '',
    type: param.format(utils.FormatTypes.sighash),
  }
}

function uniqueByName(events: utils.EventFragment[]): utils.EventFragment[] {
  const seen = new Set<string>()
  return events.filter((event) => {
    if (seen.has(event.name)) {
      return false
    }
    seen.add(event.name)
    return true
  })
}

function bySignature(a: { signature: string }, b: { signature: string }) {
  return a.signature.localeCompare(b.signature)
}
