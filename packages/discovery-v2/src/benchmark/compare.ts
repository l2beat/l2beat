/**
 * Field-by-field comparison of a V1 entry with a V2 entry.
 *
 * Values are compared after one normalisation applied to both sides:
 * chain-prefixed addresses (`eth:0x…`, `scr:0x…`) and bare addresses become
 * lowercase `0x…`. V1 templates re-prefix some getters for display
 * (`edit: ["format", "ScrollAddress"]` turns a counterpart into `scr:0x…`)
 * and V2 always prefixes with the chain it read from; both hold the same 20
 * bytes and the benchmark measures extraction, not presentation. Everything
 * else (numbers, big-number strings, nesting, array order) must match as
 * V1's `toContractValue` produced it, since V2 runs the same formatter.
 *
 * `equal-renamed` exists because V1 names event-folded fields freely
 * (`sequencers`) while V2 names after the getter (`isSequencer`); the values
 * were equal in the real run and the name is a known, deliberate difference.
 * Only V1 handler and projection fields may be matched by value, and only
 * when the value is substantive (a non-empty array or object, or a string):
 * a `0`, a `false` or an empty list would pair up with anything.
 *
 * `v2-only` is split by V1's effective `ignoreMethods`: a field V1 chose not
 * to fetch is a precision question ("did V2 fetch user data?"), a field V1
 * never mentioned is either new information or noise, and the report lists
 * every one of them so a reader can judge.
 */
import type { ContractValue, EntryParameters } from '@l2beat/discovery'
import { canonicalJson } from '../plans/planHash'
import { describeAttribution } from './attribution'
import {
  ATTRIBUTION_KINDS,
  ENTRY_FACTS,
  type FactComparison,
  type FieldVerdict,
  type V1Attribution,
  type VerdictCounts,
} from './types'

export type Values = Record<string, ContractValue | undefined>

export interface CompareContext {
  attribute(name: string): V1Attribution
  ignoreMethods: readonly string[]
}

export function compareValues(
  v1: Values,
  v2: Values,
  ctx: CompareContext,
): FieldVerdict[] {
  const v1Names = Object.keys(v1).sort()
  const v2Names = Object.keys(v2).sort()
  const v2Unmatched = new Set(v2Names.filter((name) => !(name in v1)))
  const verdicts: FieldVerdict[] = []

  // Pass 1: same name on both sides.
  for (const name of v1Names) {
    if (!(name in v2)) {
      continue
    }
    const attribution = ctx.attribute(name)
    verdicts.push(
      valuesEqual(v1[name], v2[name])
        ? { verdict: 'equal', name, attribution }
        : {
            verdict: 'different',
            name,
            attribution,
            diff: summariseDifference(v1[name], v2[name]),
          },
    )
  }

  // Pass 2: V1 fields with no namesake, matched by value where allowed.
  for (const name of v1Names) {
    if (name in v2) {
      continue
    }
    const attribution = ctx.attribute(name)
    const renamed = findRenamed(v1[name], attribution, v2, v2Unmatched)
    if (renamed !== undefined) {
      v2Unmatched.delete(renamed)
      verdicts.push({
        verdict: 'equal-renamed',
        name,
        v2Name: renamed,
        attribution,
      })
    } else {
      verdicts.push({ verdict: 'v1-only', name, attribution })
    }
  }

  // Pass 3: what V2 produced that V1 did not.
  for (const name of v2Names) {
    if (!v2Unmatched.has(name)) {
      continue
    }
    verdicts.push({
      verdict: 'v2-only',
      name,
      class: ctx.ignoreMethods.includes(name) ? 'ignored-by-v1' : 'new',
    })
  }
  return verdicts
}

function findRenamed(
  value: ContractValue | undefined,
  attribution: V1Attribution,
  v2: Values,
  candidates: ReadonlySet<string>,
): string | undefined {
  const matchable =
    attribution.kind === 'handler' || attribution.kind === 'template-projection'
  if (!matchable || !isSubstantive(value)) {
    return undefined
  }
  return [...candidates].sort().find((name) => valuesEqual(value, v2[name]))
}

function isSubstantive(value: ContractValue | undefined): boolean {
  if (typeof value === 'string') {
    return value.length > 0
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length > 0
  }
  return false
}

export function valuesEqual(a: unknown, b: unknown): boolean {
  return canonicalJson(normaliseValue(a)) === canonicalJson(normaliseValue(b))
}

const PREFIXED_ADDRESS = /^([a-z0-9]{2,10}:)?(0x[0-9a-fA-F]{40})$/

export function normaliseValue(value: unknown): unknown {
  if (typeof value === 'string') {
    const match = PREFIXED_ADDRESS.exec(value)
    return match === null ? value : (match[2] as string).toLowerCase()
  }
  if (Array.isArray(value)) {
    return value.map(normaliseValue)
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normaliseValue(entry)]),
    )
  }
  return value
}

const DIFF_EXAMPLES = 3
const DIFF_SCALAR_CHARS = 60

/** One line a reader can act on: which elements or keys differ, or both scalars. */
export function summariseDifference(v1: unknown, v2: unknown): string {
  const a = normaliseValue(v1)
  const b = normaliseValue(v2)
  if (Array.isArray(a) && Array.isArray(b)) {
    const onlyA = elementsOnlyIn(a, b)
    const onlyB = elementsOnlyIn(b, a)
    const parts = [`arrays: V1 has ${a.length} item(s), V2 ${b.length}`]
    if (onlyA.length > 0) parts.push(`only in V1: ${examples(onlyA)}`)
    if (onlyB.length > 0) parts.push(`only in V2: ${examples(onlyB)}`)
    if (onlyA.length === 0 && onlyB.length === 0) {
      parts.push('same elements in another order or multiplicity')
    }
    return parts.join('; ')
  }
  if (isRecord(a) && isRecord(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    const onlyA = keysA.filter((key) => !(key in b))
    const onlyB = keysB.filter((key) => !(key in a))
    const differing = keysA.filter(
      (key) => key in b && canonicalJson(a[key]) !== canonicalJson(b[key]),
    )
    const parts = ['objects']
    if (onlyA.length > 0) parts.push(`keys only in V1: ${examples(onlyA)}`)
    if (onlyB.length > 0) parts.push(`keys only in V2: ${examples(onlyB)}`)
    if (differing.length > 0)
      parts.push(`differing keys: ${examples(differing)}`)
    return parts.join('; ')
  }
  return `V1=${short(a)} V2=${short(b)}`
}

function elementsOnlyIn(xs: unknown[], ys: unknown[]): unknown[] {
  const present = new Set(ys.map(canonicalJson))
  return xs.filter((x) => !present.has(canonicalJson(x)))
}

function examples(items: unknown[]): string {
  const shown = items.slice(0, DIFF_EXAMPLES).map(short)
  const more = items.length - shown.length
  return `${shown.join(', ')}${more > 0 ? ` (+${more} more)` : ''} (${items.length})`
}

function short(value: unknown): string {
  const text = typeof value === 'string' ? value : canonicalJson(value)
  return text.length <= DIFF_SCALAR_CHARS
    ? text
    : `${text.slice(0, DIFF_SCALAR_CHARS)}…`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * The entry facts V2's `output` must reproduce from `prepared`; `sinceTimestamp`
 * and `deployerAddress` follow from `sinceBlock` and are not repeated.
 */
export function compareFacts(
  v1: EntryParameters,
  v2: EntryParameters,
): FactComparison[] {
  return ENTRY_FACTS.map((fact) => ({
    fact,
    equal: valuesEqual(v1[fact], v2[fact]),
    v1: v1[fact],
    v2: v2[fact],
  }))
}

export function countVerdicts(verdicts: FieldVerdict[]): VerdictCounts {
  const counts = emptyCounts()
  for (const verdict of verdicts) {
    switch (verdict.verdict) {
      case 'equal':
        counts.v1Fields++
        counts.v2Fields++
        counts.equal++
        break
      case 'equal-renamed':
        counts.v1Fields++
        counts.v2Fields++
        counts.equalRenamed++
        break
      case 'different':
        counts.v1Fields++
        counts.v2Fields++
        counts.different++
        break
      case 'v1-only':
        counts.v1Fields++
        counts.v1Only[verdict.attribution.kind]++
        break
      case 'v2-only':
        counts.v2Fields++
        counts.v2Only[verdict.class]++
        break
    }
  }
  return counts
}

export function emptyCounts(): VerdictCounts {
  return {
    v1Fields: 0,
    v2Fields: 0,
    equal: 0,
    equalRenamed: 0,
    different: 0,
    v1Only: Object.fromEntries(
      ATTRIBUTION_KINDS.map((kind) => [kind, 0]),
    ) as VerdictCounts['v1Only'],
    v2Only: { 'ignored-by-v1': 0, new: 0 },
  }
}

export function addCounts(into: VerdictCounts, more: VerdictCounts): void {
  into.v1Fields += more.v1Fields
  into.v2Fields += more.v2Fields
  into.equal += more.equal
  into.equalRenamed += more.equalRenamed
  into.different += more.different
  for (const kind of ATTRIBUTION_KINDS) {
    into.v1Only[kind] += more.v1Only[kind]
  }
  into.v2Only['ignored-by-v1'] += more.v2Only['ignored-by-v1']
  into.v2Only.new += more.v2Only.new
}

/** `different (handler (event)): arrays: …` for lists of non-equal fields. */
export function describeVerdict(verdict: FieldVerdict): string {
  switch (verdict.verdict) {
    case 'equal':
      return `equal (${describeAttribution(verdict.attribution)})`
    case 'equal-renamed':
      return `equal-renamed → \`${verdict.v2Name}\` (${describeAttribution(verdict.attribution)})`
    case 'different':
      return `different (${describeAttribution(verdict.attribution)}): ${verdict.diff}`
    case 'v1-only':
      return `v1-only (${describeAttribution(verdict.attribution)})`
    case 'v2-only':
      return `v2-only (${verdict.class})`
  }
}
