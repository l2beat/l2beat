/**
 * The closed list the model must rule on.
 *
 * Every view/pure function that takes at least one argument is state V1
 * cannot read without a handler (the 5-index probe of single-`uint256`
 * getters is a guess, not a read), so each needs exactly one verdict: a
 * field that `covers` it or a `skips` entry with a reason. Events are items
 * too, because event-only state (a list of reverted batches, a history of
 * routes) has no getter to put on the list and was silently dropped when
 * events were only offered as a means of enumeration. Listing both here,
 * rather than letting the model pick from the ABI, is what makes "nothing
 * was forgotten" a mechanical check.
 */
import { utils } from 'ethers'
import { AbiIndex } from './abi/AbiIndex'

export interface WorklistParam {
  name: string
  /** Canonical ABI type, tuples spelled out, e.g. `(address,uint256)[]`. */
  type: string
}

export interface WorklistItem {
  /** `name(type,type)`, the token used in `covers` and `skips[].item`. */
  signature: string
  name: string
  /** Full human-readable fragment, so the model sees names and mutability. */
  fragment: string
  inputs: WorklistParam[]
  outputs: WorklistParam[]
  /** V1's system handlers read this one at indices 0–4 unless it is ignored. */
  probed: boolean
}

export interface WorklistEvent {
  /** The event name, the token used in `covers` and `skips[].item`. */
  name: string
  signature: string
  fragment: string
  inputs: (WorklistParam & { indexed: boolean })[]
}

export interface Worklist {
  items: WorklistItem[]
  events: WorklistEvent[]
}

/**
 * Items and events are sorted so two runs over the same ABI produce
 * byte-identical worklists, which keeps prompts stable. Overloaded events
 * collapse to one entry per name because V1 resolves an event by name.
 */
export function buildWorklist(abi: readonly string[]): Worklist {
  const index = AbiIndex.from(abi)
  const items = index.functions
    .filter(needsVerdict)
    .map(toWorklistItem)
    .sort(bySignature)
  const events = uniqueByName(index.events)
    .map(toWorklistEvent)
    .sort(bySignature)
  return { items, events }
}

export function isEmptyWorklist(worklist: Worklist): boolean {
  return worklist.items.length === 0 && worklist.events.length === 0
}

/** Every token that needs a verdict: function signatures, then event names. */
export function worklistTokens(worklist: Worklist): string[] {
  return [
    ...worklist.items.map((item) => item.signature),
    ...worklist.events.map((event) => event.name),
  ]
}

function needsVerdict(fragment: utils.FunctionFragment): boolean {
  return (
    fragment.constant &&
    fragment.inputs.length >= 1 &&
    (fragment.outputs?.length ?? 0) >= 1
  )
}

/** The same condition under which `getSystemHandlers` adds a `LimitedArrayHandler`. */
export function isProbed(fragment: utils.FunctionFragment): boolean {
  return fragment.inputs.length === 1 && fragment.inputs[0]?.type === 'uint256'
}

function toWorklistItem(fragment: utils.FunctionFragment): WorklistItem {
  return {
    signature: fragment.format(utils.FormatTypes.sighash),
    name: fragment.name,
    fragment: fragment.format(utils.FormatTypes.full),
    inputs: fragment.inputs.map(toParam),
    outputs: (fragment.outputs ?? []).map(toParam),
    probed: isProbed(fragment),
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
