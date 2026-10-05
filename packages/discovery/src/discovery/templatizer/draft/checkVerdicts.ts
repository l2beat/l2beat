/**
 * Every worklist token is covered by fields or explicitly skipped.
 *
 * A token is a function signature (`isSequencer(address)`) or an event name
 * (`UpdateSequencer`). It is ruled on by appearing in the `covers` of one
 * or more fields, or in one `skips[].item`, never both. This is the
 * mechanical "nothing was forgotten" check, so a token that is not on the
 * worklist is an error too, with a hint for the spellings models get
 * wrong: events with parameters, functions without, and 0-argument getters
 * the baseline already read.
 *
 * Several fields may cover one item because they can read different parts
 * of it: one `call` per literal argument (how researchers read a getter
 * keyed by a `uint8`, which `array` cannot enumerate), or one `event` field
 * per projection of an event. Coverage is a checklist, not a one-to-one
 * mapping from the ABI to state; `checkCovers` checks separately that a
 * field reads what it claims.
 */
import { closest, nameOf } from '../closest'
import { buildWorklist, worklistTokens } from '../worklist'
import { SKIP_REASONS } from './Draft'
import { fieldPath } from './Finding'
import type { RuleContext } from './ruleContext'

interface Verdict {
  path: string
  covered: boolean
}

export function checkVerdicts(ctx: RuleContext): void {
  const tokens = worklistTokens(ctx.worklist)
  const known = new Set(tokens)
  const verdicts = new Map<string, Verdict>()

  const rule = (token: string, path: string, covered = false) => {
    if (!known.has(token)) {
      ctx.findings.error(
        path,
        `"${token}" is not on the worklist; ${unknownTokenHint(token, tokens, ctx)}`,
      )
      return
    }
    const previous = verdicts.get(token)
    if (previous !== undefined) {
      if (covered && previous.covered) {
        return
      }
      ctx.findings.error(
        path,
        `"${token}" already has a verdict at ${previous.path}; cover an item with fields or skip it once, never both`,
      )
      return
    }
    verdicts.set(token, { path, covered })
  }

  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    field.covers.forEach((token, i) =>
      rule(token, `${fieldPath(name)}.covers[${i}]`, true),
    )
  }
  ctx.draft.skips.forEach((skip, i) => rule(skip.item, `skips[${i}].item`))

  for (const token of tokens.filter((token) => !verdicts.has(token))) {
    ctx.findings.error('draft', missingVerdict(token, ctx))
  }
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
  const fragment = ctx.abi.functionNamed(token)
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
