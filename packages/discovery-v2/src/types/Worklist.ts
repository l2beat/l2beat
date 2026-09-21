/**
 * `worklist.json`: the closed list the model must rule on.
 *
 * Every view/pure function that takes at least one argument is state the
 * baseline cannot read on its own, so each needs exactly one verdict: a step
 * that `covers` it or a `skips` entry with a reason. Listing them here, rather
 * than letting the model pick from the ABI, is what makes "nothing was
 * forgotten" a mechanical check in the validator. Events are listed because
 * they are the only means of enumerating mapping keys.
 */
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import { AbiIndex } from '../abi/AbiIndex'

export const WorklistParam = v.object({
  name: v.string(),
  /** Canonical ABI type, tuples spelled out, e.g. `(address,uint256)[]`. */
  type: v.string(),
})

export const WorklistItem = v.object({
  /** `name(type,type)`, the token used in `covers` and `skips[].item`. */
  signature: v.string(),
  /** Full human-readable fragment, so the model sees names and mutability. */
  fragment: v.string(),
  inputs: v.array(WorklistParam),
  outputs: v.array(WorklistParam),
  stateMutability: v.enum(['view', 'pure']),
})

export const WorklistEvent = v.object({
  signature: v.string(),
  fragment: v.string(),
  inputs: v.array(
    v.object({ name: v.string(), type: v.string(), indexed: v.boolean() }),
  ),
})

export const Worklist = v.object({
  items: v.array(WorklistItem),
  events: v.array(WorklistEvent),
})

export type Worklist = v.infer<typeof Worklist>
export type WorklistItem = v.infer<typeof WorklistItem>
export type WorklistEvent = v.infer<typeof WorklistEvent>
export type WorklistParam = v.infer<typeof WorklistParam>

/**
 * Items and events are sorted by signature so two runs over the same ABI
 * produce byte-identical worklists, which keeps prompts and plan hashes
 * stable.
 */
export function buildWorklist(abi: string[]): Worklist {
  const index = AbiIndex.from(abi)
  const items = index.functions
    .filter(needsVerdict)
    .map(toWorklistItem)
    .sort(bySignature)
  const events = index.events.map(toWorklistEvent).sort(bySignature)
  return { items, events }
}

function needsVerdict(fragment: utils.FunctionFragment): boolean {
  return (
    (fragment.stateMutability === 'view' ||
      fragment.stateMutability === 'pure') &&
    fragment.inputs.length >= 1 &&
    (fragment.outputs?.length ?? 0) >= 1
  )
}

function toWorklistItem(fragment: utils.FunctionFragment): WorklistItem {
  return {
    signature: fragment.format(utils.FormatTypes.sighash),
    fragment: fragment.format(utils.FormatTypes.full),
    inputs: fragment.inputs.map(toParam),
    outputs: (fragment.outputs ?? []).map(toParam),
    stateMutability: fragment.stateMutability as 'view' | 'pure',
  }
}

function toWorklistEvent(fragment: utils.EventFragment): WorklistEvent {
  return {
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

function bySignature(a: { signature: string }, b: { signature: string }) {
  return a.signature.localeCompare(b.signature)
}
