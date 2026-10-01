/**
 * R8: a field covers only what its handler can answer.
 *
 * `covers` is the model's claim that a worklist token is answered by this
 * field. For handlers that read one function (`call`, `array`) or a fixed
 * set (`accessControl`) the claim can be checked exactly. An `event` field
 * may claim any getter (it enumerates what `isSequencer(address)` holds,
 * which no ABI fact can confirm) but only the events it actually reads,
 * and the other handlers read no events at all. A claimed getter stays
 * unconfirmed: when the fold comes back empty, the dry run notes it for
 * the reviewer rather than rejecting it.
 */

import type { AbiIndex } from '../abi/AbiIndex'
import { sighash } from '../abi/AbiIndex'
import type { ContractFacts } from '../facts'
import type { DraftHandler } from './Draft'
import { fieldPath } from './Finding'
import { type FieldReads, readEvents, readsOf } from './fieldReads'
import { abiIndexOf, type RuleContext } from './ruleContext'

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
 * Worklist tokens a handler answers by what it reads, never by claim, so
 * the freeze path can tell what an old template's field covers.
 */
export function naturalCovers(
  fieldName: string,
  handler: DraftHandler,
  facts: Pick<ContractFacts, 'abi'>,
): NaturalCovers {
  const index = abiIndexOf(facts.abi)
  return naturalCoversOf(
    handler,
    readsOf(fieldName, handler, facts.abi, index),
    index,
  )
}

function naturalCoversOf(
  handler: DraftHandler,
  reads: FieldReads,
  index: AbiIndex,
): NaturalCovers {
  const fragment = reads.method?.fragment
  switch (handler.type) {
    case 'call':
      return {
        functions:
          fragment !== undefined && handler.address === undefined
            ? [sighash(fragment)]
            : [],
        events: [],
      }
    case 'array':
      return { functions: fragment ? [sighash(fragment)] : [], events: [] }
    case 'event':
      return {
        functions: [],
        events: [...new Set(readEvents(reads).map((event) => event.name))],
      }
    case 'accessControl':
      return {
        functions: ACCESS_CONTROL_FUNCTIONS.filter(
          (signature) => index.lookupFunction(signature).fragment !== undefined,
        ),
        events: ACCESS_CONTROL_EVENTS.filter((name) =>
          index.eventNames().includes(name),
        ),
      }
    default:
      return { functions: [], events: [] }
  }
}

export function checkCovers(ctx: RuleContext): void {
  const functions = new Set(ctx.worklist.items.map((item) => item.signature))
  const events = new Set(ctx.worklist.events.map((event) => event.name))
  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    const reads = ctx.reads.get(name) as FieldReads
    const natural = naturalCoversOf(field.handler, reads, ctx.abi)
    field.covers.forEach((token, i) => {
      const path = `${fieldPath(name)}.covers[${i}]`
      if (events.has(token) && !natural.events.includes(token)) {
        ctx.findings.error(path, unreadEvent(name, field.handler, token))
      } else if (
        functions.has(token) &&
        answersOnlyWhatItReads(field.handler) &&
        reads.method?.error === undefined &&
        !natural.functions.includes(token)
      ) {
        ctx.findings.error(
          path,
          unansweredFunction(field.handler, natural, token),
        )
      }
    })
  }
}

function answersOnlyWhatItReads(handler: DraftHandler): boolean {
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
  natural: NaturalCovers,
  token: string,
): string {
  if (handler.type === 'call' && handler.address !== undefined) {
    return `this field calls another contract (\`address\` is set), so it answers nothing on this contract's worklist; move ${token} to the field that reads it or to skips`
  }
  const answered =
    natural.functions.length > 0 ? natural.functions.join(', ') : 'nothing'
  return `${withArticle(handler.type)} field answers only what it calls (${answered}); move ${token} to the field that reads it or to skips`
}

function withArticle(type: string): string {
  return /^[aeiou]/i.test(type) ? `an ${type}` : `a ${type}`
}
