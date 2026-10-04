/**
 * What a draft field reads from the contract, read off the handler's own
 * text: the function a `call` or `array` handler names and the events an
 * `event` handler's actions name.
 *
 * Nothing is resolved against the ABI here. Which function or event V1
 * actually reads for a bare name is V1's business, and the dry run reports
 * it. These names decide only what a field may claim to cover and which
 * worklist items an existing template's fields already answer.
 */
import { utils } from 'ethers'
import { nameOf } from '../closest'
import { type DraftHandler, eventActions, eventNamesOf } from './Draft'

export interface FieldReads {
  /** For `call` and `array`: the function the handler names. */
  method?: MethodReference
  /** For `event`: the bare names of the events the actions name, each once, in action order. */
  events: string[]
}

export interface MethodReference {
  /** A bare `method`, the name of a full fragment, or the field name when `method` is absent. */
  name: string
  /** `name(types)` when `method` is a full fragment; absent for a bare name. */
  signature?: string
  /** How many arguments the handler passes, to tell overloads of a bare name apart. */
  arity: number
  /** A `call` on another contract (`address` given) answers nothing on this contract's worklist. */
  foreign: boolean
}

export function readsOf(fieldName: string, handler: DraftHandler): FieldReads {
  switch (handler.type) {
    case 'call':
      return {
        method: methodReference(
          fieldName,
          handler,
          Array.isArray(handler.args) ? handler.args.length : 0,
        ),
        events: [],
      }
    case 'array':
      return { method: methodReference(fieldName, handler, 1), events: [] }
    case 'event':
      return {
        events: [
          ...new Set(
            eventActions(handler).flatMap(({ action }) =>
              eventNamesOf(action).map(eventName),
            ),
          ),
        ],
      }
    default:
      return { events: [] }
  }
}

function methodReference(
  fieldName: string,
  handler: DraftHandler,
  arity: number,
): MethodReference {
  const method =
    typeof handler.method === 'string' ? handler.method.trim() : fieldName
  const foreign = handler.type === 'call' && handler.address !== undefined
  const fragment = parseFragment(method, 'function')
  if (fragment !== undefined) {
    return {
      name: fragment.name,
      signature: fragment.format(utils.FormatTypes.sighash),
      arity,
      foreign,
    }
  }
  return { name: nameOf(method), arity, foreign }
}

/** The bare name of an event reference: `Foo`, `Foo(uint256)` or `event Foo(uint256 a)`. */
export function eventName(reference: string): string {
  const trimmed = reference.trim()
  return parseFragment(trimmed, 'event')?.name ?? nameOf(trimmed)
}

function parseFragment(
  text: string,
  type: 'function' | 'event',
): utils.FunctionFragment | utils.EventFragment | undefined {
  if (!text.startsWith(`${type} `)) {
    return undefined
  }
  try {
    const fragment = utils.Fragment.from(text)
    return fragment.type === type
      ? (fragment as utils.FunctionFragment | utils.EventFragment)
      : undefined
  } catch {
    return undefined
  }
}
