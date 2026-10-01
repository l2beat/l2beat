/**
 * What a draft field reads from the contract: the function a `call` or
 * `array` handler calls and the events each action of an `event` handler
 * reads, resolved the way V1 resolves them.
 *
 * Names, ABI checks and covers all depend on this, and the freeze path asks
 * the same question of an old template's fields, so it is one pure function
 * of the handler and the ABI.
 */
import type { utils } from 'ethers'
import type { AbiIndex } from '../abi/AbiIndex'
import { sighash } from '../abi/AbiIndex'
import { type DraftHandler, eventActions, eventNamesOf } from './Draft'
import { type EventResolution, resolveEvent } from './resolveEvent'
import {
  type MethodRequest,
  type MethodResolution,
  resolveMethod,
} from './resolveMethod'

export interface FieldReads {
  /** Set for `call` and `array` handlers. */
  method?: MethodResolution
  /** Set for `event` handlers, in `set`, `add`, `remove` order. */
  actions: ActionReads[]
}

export interface ActionReads {
  /** Path inside the handler, e.g. `add` or `add[1]`. */
  path: string
  events: EventRead[]
  where?: unknown
}

export interface EventRead {
  reference: string
  /** Path inside the handler, e.g. `add.event` or `add.event[1]`. */
  path: string
  resolution: EventResolution
}

export function readsOf(
  fieldName: string,
  handler: DraftHandler,
  abi: readonly string[],
  index: AbiIndex,
): FieldReads {
  switch (handler.type) {
    case 'call':
      return {
        method: resolveMethod(callRequest(fieldName, handler), abi, index),
        actions: [],
      }
    case 'array':
      return {
        method: resolveMethod(arrayRequest(fieldName, handler), abi, index),
        actions: [],
      }
    case 'event':
      return { actions: actionReads(handler, abi, index) }
    default:
      return { actions: [] }
  }
}

/** Every event the field reads that resolved, once per declaration. */
export function readEvents(reads: FieldReads): utils.EventFragment[] {
  const seen = new Map<string, utils.EventFragment>()
  for (const action of reads.actions) {
    for (const event of action.events) {
      const fragment = event.resolution.fragment
      if (fragment !== undefined && !seen.has(sighash(fragment))) {
        seen.set(sighash(fragment), fragment)
      }
    }
  }
  return [...seen.values()]
}

function actionReads(
  handler: DraftHandler,
  abi: readonly string[],
  index: AbiIndex,
): ActionReads[] {
  return eventActions(handler).map(({ path, action }) => {
    const references = eventNamesOf(action)
    const many = Array.isArray(action.event)
    return {
      path,
      where: action.where,
      events: references.map((reference, i) => ({
        reference,
        path: many ? `${path}.event[${i}]` : `${path}.event`,
        resolution: resolveEvent(reference, abi, index),
      })),
    }
  })
}

/** CallHandler: `method ?? field`, a view or pure function taking exactly `args.length` inputs. */
function callRequest(fieldName: string, handler: DraftHandler): MethodRequest {
  const method = handler.method as string | undefined
  const arity = (handler.args as unknown[]).length
  return {
    method: method ?? fieldName,
    defaulted: method === undefined,
    foreign: handler.address !== undefined,
    rejects: (fragment) => {
      if (!isCallable(fragment)) {
        return `${sighash(fragment)} is ${fragment.stateMutability}; V1's call handler only calls view or pure functions`
      }
      if (fragment.inputs.length !== arity) {
        return `${sighash(fragment)} takes ${fragment.inputs.length} argument(s) but \`args\` has ${arity}`
      }
      return undefined
    },
  }
}

const ARRAY_INDEX_TYPES = ['uint16', 'uint32', 'uint64', 'uint256']

/** ArrayHandler: `method ?? field`, a view or pure function of one unsigned index. */
function arrayRequest(fieldName: string, handler: DraftHandler): MethodRequest {
  const method = handler.method as string | undefined
  return {
    method: method ?? fieldName,
    defaulted: method === undefined,
    foreign: false,
    rejects: (fragment) => {
      if (
        fragment.stateMutability !== 'view' &&
        fragment.stateMutability !== 'pure'
      ) {
        return `${sighash(fragment)} is ${fragment.stateMutability}; V1's array handler only calls view or pure functions`
      }
      const [input] = fragment.inputs
      if (
        fragment.inputs.length !== 1 ||
        !ARRAY_INDEX_TYPES.includes(input?.type ?? '')
      ) {
        return `${sighash(fragment)} does not take a single ${ARRAY_INDEX_TYPES.join(', ')} index, which is all V1's array handler calls with; read fixed keys with one \`call\` field each, or skip it`
      }
      return undefined
    },
  }
}

function isCallable(fragment: utils.FunctionFragment): boolean {
  return (
    fragment.stateMutability === 'view' ||
    fragment.stateMutability === 'pure' ||
    fragment.constant
  )
}
