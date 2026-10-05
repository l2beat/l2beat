/**
 * A field covers only what its handler names.
 *
 * `covers` is the model's claim that a worklist token is answered by this
 * field. For handlers that read one function (`call`, `array`) or a fixed
 * set (`accessControl`) the claim is checked against the names the handler
 * carries. An `event` field may claim any getter (it enumerates what
 * `isSequencer(address)` holds, which nothing but judgment can confirm) but
 * only the events its actions name, and the other handlers read no events
 * at all. A `constructorArgs` field answers the constructor, and no other
 * field does. Without this a missed item could hide behind a false claim.
 * A bare method name that several overloads of one arity answer to covers
 * none of them: V1 reads one, and which one is V1's to say, so the model
 * is asked for the full fragment.
 * A claimed getter stays unconfirmed: when the fold comes back empty, the
 * dry run notes it for the reviewer rather than rejecting it.
 */
import type { Worklist, WorklistItem } from '../worklist'
import type { DraftHandler } from './Draft'
import { fieldPath } from './Finding'
import { type FieldReads, type MethodReference, readsOf } from './fieldReads'
import type { RuleContext } from './ruleContext'

export interface NaturalCovers {
  functions: string[]
  events: string[]
}

/** OpenZeppelin AccessControl and AccessControlEnumerable (4.x and 5.x) role getters. */
const ACCESS_CONTROL_FUNCTIONS = [
  'hasRole(bytes32,address)',
  'getRoleAdmin(bytes32)',
  'getRoleMember(bytes32,uint256)',
  'getRoleMemberCount(bytes32)',
  'getRoleMembers(bytes32)',
]
const ACCESS_CONTROL_EVENTS = ['RoleGranted', 'RoleRevoked', 'RoleAdminChanged']

/**
 * Worklist tokens a handler answers by what it names, never by claim, so
 * an existing template's fields can be subtracted from the worklist.
 */
export function naturalCovers(
  fieldName: string,
  handler: DraftHandler,
  worklist: Worklist,
): NaturalCovers {
  return naturalCoversOf(handler, readsOf(fieldName, handler), worklist)
}

export function naturalCoversOf(
  handler: DraftHandler,
  reads: FieldReads,
  worklist: Worklist,
): NaturalCovers {
  switch (handler.type) {
    case 'call':
    case 'array': {
      const method = reads.method
      if (method === undefined || method.foreign) {
        return { functions: [], events: [] }
      }
      const named = namedItems(method, worklist)
      if (method.signature === undefined && named.length > 1) {
        return { functions: [], events: [] }
      }
      return { functions: named.map((item) => item.signature), events: [] }
    }
    case 'event':
      return {
        functions: [],
        events: worklist.events
          .filter((event) => reads.events.includes(event.name))
          .map((event) => event.name),
      }
    case 'accessControl':
      return {
        functions: worklist.items
          .filter((item) => ACCESS_CONTROL_FUNCTIONS.includes(item.signature))
          .map((item) => item.signature),
        events: worklist.events
          .filter((event) => ACCESS_CONTROL_EVENTS.includes(event.name))
          .map((event) => event.name),
      }
    case 'constructorArgs':
      return {
        functions:
          worklist.constructorItem === undefined
            ? []
            : [worklist.constructorItem.signature],
        events: [],
      }
    default:
      return { functions: [], events: [] }
  }
}

/** A full fragment names one signature; a bare name, the overloads of that arity. */
function namedItems(
  method: MethodReference,
  worklist: Worklist,
): WorklistItem[] {
  return worklist.items.filter((item) =>
    method.signature !== undefined
      ? item.signature === method.signature
      : item.name === method.name && item.inputs.length === method.arity,
  )
}

export function checkCovers(ctx: RuleContext): void {
  const functions = new Set(ctx.worklist.items.map((item) => item.signature))
  const events = new Set(ctx.worklist.events.map((event) => event.name))
  const constructorToken = ctx.worklist.constructorItem?.signature
  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    const reads = ctx.reads.get(name) as FieldReads
    const natural = naturalCoversOf(field.handler, reads, ctx.worklist)
    field.covers.forEach((token, i) => {
      const path = `${fieldPath(name)}.covers[${i}]`
      if (events.has(token) && !natural.events.includes(token)) {
        ctx.findings.error(path, unreadEvent(name, field.handler, token))
      } else if (
        token === constructorToken &&
        field.handler.type !== 'constructorArgs'
      ) {
        ctx.findings.error(
          path,
          `only a constructorArgs field reads the constructor; cover ${token} with one, or skip it`,
        )
      } else if (
        functions.has(token) &&
        answersOnlyWhatItNames(field.handler) &&
        !natural.functions.includes(token)
      ) {
        ctx.findings.error(
          path,
          unansweredFunction(
            field.handler,
            reads,
            natural,
            token,
            ctx.worklist,
          ),
        )
      }
    })
  }
}

function answersOnlyWhatItNames(handler: DraftHandler): boolean {
  return (
    handler.type === 'call' ||
    handler.type === 'array' ||
    handler.type === 'accessControl'
  )
}

function unreadEvent(
  name: string,
  handler: DraftHandler,
  token: string,
): string {
  const fix = `or skip ${token} as \`covered\` if its state is what ${name} holds`
  if (handler.type === 'event') {
    return `${name} does not read ${token}; read it in one of the handler's actions, ${fix}`
  }
  if (handler.type === 'accessControl') {
    return `an accessControl field reads only ${ACCESS_CONTROL_EVENTS.join(', ')}; cover ${token} with an event field, ${fix}`
  }
  return `${withArticle(handler.type)} field reads no events; cover ${token} with an event field, ${fix}`
}

function unansweredFunction(
  handler: DraftHandler,
  reads: FieldReads,
  natural: NaturalCovers,
  token: string,
  worklist: Worklist,
): string {
  if (handler.type === 'call' && handler.address !== undefined) {
    return `this field calls another contract (\`address\` is set), so it answers nothing on this contract's worklist; move ${token} to the field that reads it or to skips`
  }
  const method = reads.method
  if (method !== undefined && method.signature === undefined) {
    const overloads = namedItems(method, worklist)
    if (overloads.length > 1) {
      const arguments_ = method.arity === 1 ? 'argument' : 'arguments'
      return `\`${method.name}\` has ${overloads.length} overloads with ${method.arity} ${arguments_} (${overloads.map((item) => item.signature).join(', ')}) and a bare name reads only the first in the ABI; write \`method\` as the full fragment of the one this field reads, and cover only that one`
    }
  }
  const answered =
    natural.functions.length > 0 ? natural.functions.join(', ') : 'nothing'
  return `${withArticle(handler.type)} field answers only what it names (${answered}); move ${token} to the field that reads it or to skips`
}

function withArticle(type: string): string {
  return /^[aeiou]/i.test(type) ? `an ${type}` : `a ${type}`
}
