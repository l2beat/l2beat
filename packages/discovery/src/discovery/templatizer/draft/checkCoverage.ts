/**
 * R3: every worklist token gets exactly one verdict.
 *
 * A token is a function signature (`isSequencer(address)`) or an event name
 * (`UpdateSequencer`). It is ruled on by appearing in one field's `covers`
 * or in one `skips[].item`. This is the mechanical "nothing was forgotten"
 * check, so a token that is not on the worklist is an error too, with a
 * hint for the spellings models get wrong: events with parameters,
 * functions without, and 0-argument getters the baseline already read.
 */
import { closest, nameOf } from '../closest'
import { buildWorklist, worklistTokens } from '../worklist'
import { SKIP_REASONS } from './Draft'
import { fieldPath } from './Finding'
import type { RuleContext } from './ruleContext'

export function checkCoverage(ctx: RuleContext): void {
  const tokens = worklistTokens(ctx.worklist)
  const known = new Set(tokens)
  const verdicts = new Map<string, string>()

  const rule = (token: string, path: string) => {
    if (!known.has(token)) {
      ctx.findings.error(
        path,
        `"${token}" is not on the worklist; ${unknownTokenHint(token, tokens, ctx)}`,
      )
      return
    }
    const previous = verdicts.get(token)
    if (previous !== undefined) {
      ctx.findings.error(
        path,
        `"${token}" already has a verdict at ${previous}; give each worklist item exactly one verdict, in one field's covers or in one skip`,
      )
      return
    }
    verdicts.set(token, path)
  }

  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    field.covers.forEach((token, i) =>
      rule(token, `${fieldPath(name)}.covers[${i}]`),
    )
  }
  ctx.draft.skips.forEach((skip, i) => rule(skip.item, `skips[${i}].item`))

  for (const token of tokens.filter((token) => !verdicts.has(token))) {
    ctx.findings.error('draft', missingVerdict(token, ctx))
  }
}

function missingVerdict(token: string, ctx: RuleContext): string {
  const noun = ctx.worklist.events.some((event) => event.name === token)
    ? 'event'
    : 'function'
  return `${noun} ${token} has no verdict; add it to the covers of the field that reads it, or to skips with one of ${SKIP_REASONS.join(', ')}`
}

function unknownTokenHint(
  token: string,
  tokens: string[],
  ctx: RuleContext,
): string {
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
  if (worklistTokens(buildWorklist(ctx.facts.abi)).includes(token)) {
    return 'the existing template already decides it (a kept field answers it, or its ignoreMethods leaves it out); drop this verdict'
  }
  return `closest: ${closest(tokens, token, 3, nameOf).join(', ')}`
}
