/**
 * R3: every worklist token gets exactly one verdict.
 *
 * A token is a function signature (`isSequencer(address)`) or an event name
 * (`UpdateSequencer`). It is ruled on by appearing in one field's `covers`
 * or in one `skips[].item`. This is the mechanical "nothing was forgotten"
 * check, so a token that is not on the worklist is an error too, with a
 * hint for the spellings models get wrong: events with parameters,
 * functions without, and 0-argument getters the baseline already read.
 *
 * The one plurality allowed: a function read by several `call` (or
 * `array`) fields with different literal arguments, one per enum value or
 * known key, is listed in the covers of each, because each of them does
 * read it. That is how researchers write a getter keyed by a `uint8`, which
 * `array` cannot enumerate. A skip, or a field that only claims the
 * function, next to such a field is still a second verdict.
 */
import { closest, nameOf } from '../closest'
import { buildWorklist, worklistTokens } from '../worklist'
import { naturalCoversOf } from './checkCovers'
import { SKIP_REASONS } from './Draft'
import { fieldPath } from './Finding'
import type { FieldReads } from './fieldReads'
import type { RuleContext } from './ruleContext'

interface Verdict {
  path: string
  /** True when the field's handler names the function it covers; see the header. */
  reads: boolean
}

export function checkCoverage(ctx: RuleContext): void {
  const tokens = worklistTokens(ctx.worklist)
  const known = new Set(tokens)
  const verdicts = new Map<string, Verdict>()

  const rule = (token: string, path: string, reads = false) => {
    if (!known.has(token)) {
      ctx.findings.error(
        path,
        `"${token}" is not on the worklist; ${unknownTokenHint(token, tokens, ctx)}`,
      )
      return
    }
    const previous = verdicts.get(token)
    if (previous !== undefined) {
      if (reads && previous.reads) {
        return
      }
      ctx.findings.error(
        path,
        `"${token}" already has a verdict at ${previous.path}; give each worklist item exactly one verdict, in one field's covers or in one skip`,
      )
      return
    }
    verdicts.set(token, { path, reads })
  }

  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    const read = readFunctions(name, field.handler, ctx)
    field.covers.forEach((token, i) =>
      rule(token, `${fieldPath(name)}.covers[${i}]`, read.includes(token)),
    )
  }
  ctx.draft.skips.forEach((skip, i) => rule(skip.item, `skips[${i}].item`))

  for (const token of tokens.filter((token) => !verdicts.has(token))) {
    ctx.findings.error('draft', missingVerdict(token, ctx))
  }
}

/** The worklist functions a call or array field reads by name; nothing for the handlers that only claim. */
function readFunctions(
  name: string,
  handler: RuleContext['draft']['fields'][string]['handler'],
  ctx: RuleContext,
): string[] {
  if (handler.type !== 'call' && handler.type !== 'array') {
    return []
  }
  const reads = ctx.reads.get(name) as FieldReads
  return naturalCoversOf(handler, reads, ctx.worklist).functions
}

function missingVerdict(token: string, ctx: RuleContext): string {
  const reasons = SKIP_REASONS.join(', ')
  if (token === ctx.worklist.constructorItem?.signature) {
    return `${token} has no verdict; cover it with a constructorArgs field, or add it to skips with one of ${reasons}`
  }
  const noun = ctx.worklist.events.some((event) => event.name === token)
    ? 'event'
    : 'function'
  return `${noun} ${token} has no verdict; add it to the covers of the field that reads it, or to skips with one of ${reasons}`
}

function unknownTokenHint(
  token: string,
  tokens: string[],
  ctx: RuleContext,
): string {
  if (/^constructor\b/.test(token)) {
    return constructorHint(ctx)
  }
  const eventName = nameOf(token)
  if (
    token.includes('(') &&
    ctx.worklist.events.some((event) => event.name === eventName)
  ) {
    return `events are named without parameters: "${eventName}"`
  }
  const signatures = ctx.worklist.items
    .filter((item) => item.name === token)
    .map((item) => `"${item.signature}"`)
  if (signatures.length > 0) {
    return `functions are written as signatures: ${signatures.join(' or ')}`
  }
  const fragment = ctx.abi.lookupFunction(token).fragment
  if (
    fragment !== undefined &&
    fragment.inputs.length === 0 &&
    fragment.constant
  ) {
    return 'it is a 0-argument getter the baseline already reads; it needs no verdict'
  }
  if (fragment !== undefined && !fragment.constant) {
    return 'it changes state, and V1 never reads such functions; only view functions with arguments and events need a verdict'
  }
  if (
    worklistTokens(buildWorklist(ctx.facts.abi, ctx.facts.baseline)).includes(
      token,
    )
  ) {
    return 'the existing template already decides it (a kept field answers it, or its ignoreMethods leaves it out); drop this verdict'
  }
  return `closest: ${closest(tokens, token, 3, nameOf).join(', ')}`
}

/** The listed spelling; or why the constructor is not listed: decided already, or nothing to decode. */
function constructorHint(ctx: RuleContext): string {
  const listed = ctx.worklist.constructorItem
  if (listed !== undefined) {
    return `the constructor is written as its signature: "${listed.signature}"`
  }
  const declared = buildWorklist(
    ctx.facts.abi,
    ctx.facts.baseline,
  ).constructorItem
  return declared === undefined
    ? 'the constructor has no parameters, so it needs no verdict'
    : 'the existing template already decides it (its constructorArgs field reads it); drop this verdict'
}
