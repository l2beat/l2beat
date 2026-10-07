/**
 * Field-by-field comparison of a committed (V1) entry's values with the
 * values the analyzer produced from a generated template.
 *
 * Values are compared after one normalisation applied to both sides:
 * chain-prefixed addresses (`eth:0x…`, `scr:0x…`) and bare addresses become
 * lowercase `0x…`. Committed templates re-prefix some getters for display
 * (`edit: ["format", "ScrollAddress"]` turns a counterpart into `scr:0x…`)
 * while a generated template keeps the chain it read from; both hold the
 * same 20 bytes and the benchmark measures extraction, not presentation.
 * Everything else (numbers, big-number strings, nesting, array order) must
 * match as V1's handlers produced it.
 *
 * `equal-renamed` exists because researchers name event-folded fields
 * freely (`sequencers`) while the model tends to name after the getter
 * (`isSequencer`); the values are equal and the name is a known, deliberate
 * difference. Only V1 handler and projection fields may be matched by value,
 * and only when the value is substantive (a non-empty array or object, or a
 * string): a `0`, a `false` or an empty list would pair up with anything.
 *
 * `equal-by-value` is the verdict for "same information, other shape". A
 * researcher chose the shape of handler output by hand (one field per
 * literal key, a struct as an object, a list), and the model picks its own,
 * so the same values arrive under other keys or another nesting. The
 * benchmark measures whether the values were extracted, so a V1 field is
 * credited when the generated values hold all of its leaf values: with the
 * same name when the multisets of all leaves are equal, and under any name
 * when every *distinctive* leaf (an address, a hash, a long string or
 * number) is found among the leaves of generated fields that no V1 field
 * claimed by name. Short leaves alone (`0`, `false`, small counts) never
 * credit a nameless match, because they would be found anywhere, and
 * generated fields already matched are not searched, so a value that is
 * also the owner does not make a missed `provers` list count as found.
 * Where both sides keep the same keys, the keys say which value is which,
 * so each key must hold the same leaves: `{ admin: A, guardian: B }`
 * against `{ admin: B, guardian: A }` is a difference, not a reshape, and
 * so is a list of such objects whose rows differ, in whatever order. Only
 * handler and projection fields are matched by value, as for renames: a
 * proxy value, a getter or an override field keeps its name and shape, so
 * a copy of its value elsewhere cannot hide its loss. This is deliberately
 * generous in one direction: it can credit a field whose values happen to
 * appear elsewhere, never fail one whose values are present. The verdict
 * carries the generated fields involved so a reader can check.
 *
 * `v2-only` is split by V1's effective `ignoreMethods`: a field the
 * committed template chose not to fetch is a precision question ("did the
 * model keep user data?"), a field V1 never mentioned is either new
 * information or noise.
 */
import type { ContractValue } from '../../output/types'
import { describeAttribution } from './attribution'
import {
  ATTRIBUTION_KINDS,
  type FieldVerdict,
  type V1Attribution,
  V2_ONLY_CLASSES,
  type VerdictCounts,
} from './types'

export type Values = Record<string, ContractValue | undefined>

export interface CompareContext {
  attribute(name: string): V1Attribution
  ignoreMethods: readonly string[]
}

export function compareValues(
  v1: Values,
  generated: Values,
  ctx: CompareContext,
): FieldVerdict[] {
  const v1Names = Object.keys(v1).sort()
  const generatedNames = Object.keys(generated).sort()
  const unclaimed = new Set(
    generatedNames.filter((name) => !Object.hasOwn(v1, name)),
  )
  const nameless = v1Names.filter((name) => !Object.hasOwn(generated, name))
  const renamed = matchRenamed(v1, generated, nameless, unclaimed, ctx)
  const unrenamed = nameless.filter((name) => !renamed.has(name))
  // Renamed matches are taken before leaf matching, so the generated fields
  // they consumed are not searched for leaves of the remaining V1 fields.
  const unclaimedLeaves = leafIndex(pick(generated, unclaimed))
  return [
    ...compareNamesakes(v1, generated, ctx),
    ...renamed.values(),
    ...unrenamed.map((name) =>
      matchByLeaves(name, v1[name], unclaimedLeaves, ctx),
    ),
    ...[...unclaimed].sort().map((name) => generatedOnly(name, ctx)),
  ]
}

function compareNamesakes(
  v1: Values,
  generated: Values,
  ctx: CompareContext,
): FieldVerdict[] {
  return Object.keys(v1)
    .sort()
    .filter((name) => Object.hasOwn(generated, name))
    .map((name): FieldVerdict => {
      const attribution = ctx.attribute(name)
      if (valuesEqual(v1[name], generated[name])) {
        return { verdict: 'equal', name, attribution }
      }
      if (
        canMatchByValue(attribution) &&
        sameLeaves(v1[name], generated[name])
      ) {
        return {
          verdict: 'equal-by-value',
          name,
          generatedNames: [name],
          attribution,
        }
      }
      return {
        verdict: 'different',
        name,
        attribution,
        diff: summariseDifference(v1[name], generated[name]),
      }
    })
}

/** Consumes each generated field it matches from `unclaimed`, so no two V1 fields share one. */
function matchRenamed(
  v1: Values,
  generated: Values,
  nameless: readonly string[],
  unclaimed: Set<string>,
  ctx: CompareContext,
): Map<string, FieldVerdict> {
  const renamed = new Map<string, FieldVerdict>()
  for (const name of nameless) {
    const attribution = ctx.attribute(name)
    const generatedName = findRenamed(
      v1[name],
      attribution,
      generated,
      unclaimed,
    )
    if (generatedName === undefined) {
      continue
    }
    unclaimed.delete(generatedName)
    renamed.set(name, {
      verdict: 'equal-renamed',
      name,
      generatedName,
      attribution,
    })
  }
  return renamed
}

function matchByLeaves(
  name: string,
  value: ContractValue | undefined,
  unclaimedLeaves: Map<string, string[]>,
  ctx: CompareContext,
): FieldVerdict {
  const attribution = ctx.attribute(name)
  const containing = canMatchByValue(attribution)
    ? fieldsContaining(value, unclaimedLeaves)
    : undefined
  return containing === undefined
    ? { verdict: 'v1-only', name, attribution }
    : {
        verdict: 'equal-by-value',
        name,
        generatedNames: containing,
        attribution,
      }
}

function generatedOnly(name: string, ctx: CompareContext): FieldVerdict {
  return {
    verdict: 'v2-only',
    name,
    class: ctx.ignoreMethods.includes(name) ? 'ignored-by-v1' : 'new',
  }
}

function findRenamed(
  value: ContractValue | undefined,
  attribution: V1Attribution,
  generated: Values,
  candidates: ReadonlySet<string>,
): string | undefined {
  if (!canMatchByValue(attribution) || !isSubstantive(value)) {
    return undefined
  }
  return [...candidates]
    .sort()
    .find((name) => valuesEqual(value, generated[name]))
}

function canMatchByValue(attribution: V1Attribution): boolean {
  return (
    attribution.kind === 'handler' || attribution.kind === 'template-projection'
  )
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

/** Leaf scalars of a value, normalised, as strings; order and nesting dropped. */
export function leavesOf(value: unknown): string[] {
  const normalised = normaliseValue(value)
  if (Array.isArray(normalised)) {
    return normalised.flatMap(leavesOf)
  }
  if (isRecord(normalised)) {
    return Object.values(normalised).flatMap(leavesOf)
  }
  return [String(normalised)]
}

function sameLeaves(a: unknown, b: unknown): boolean {
  return (
    leavesOf(a).length > 0 &&
    sameLeavesPerKey(normaliseValue(a), normaliseValue(b))
  )
}

/**
 * Objects with the same keys are compared key by key, lists of objects
 * with the same keys row by row in any order, anything else by its
 * multiset of leaves.
 */
function sameLeavesPerKey(a: unknown, b: unknown): boolean {
  if (isRecord(a) && isRecord(b) && sameKeys(a, b)) {
    return Object.keys(a).every((key) => sameLeavesPerKey(a[key], b[key]))
  }
  const left = tableOf(a)
  const right = tableOf(b)
  if (left !== undefined && right !== undefined && left.keys === right.keys) {
    return sameMultiset(left.rows, right.rows)
  }
  return sameMultiset(leavesOf(a), leavesOf(b))
}

function sameKeys(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  const keys = Object.keys(a)
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => Object.hasOwn(b, key))
  )
}

/** A non-empty list of objects that all have the same keys; each row is the leaves of each key. */
function tableOf(value: unknown): { keys: string; rows: string[] } | undefined {
  if (!Array.isArray(value) || !value.every(isRecord)) {
    return undefined
  }
  const [first] = value
  if (first === undefined) {
    return undefined
  }
  const keys = canonicalJson(Object.keys(first).sort())
  if (value.some((row) => canonicalJson(Object.keys(row).sort()) !== keys)) {
    return undefined
  }
  const rows = value.map((row) =>
    canonicalJson(
      Object.fromEntries(
        Object.entries(row).map(([key, entry]) => [
          key,
          leavesOf(entry).sort(),
        ]),
      ),
    ),
  )
  return { keys, rows }
}

function sameMultiset(a: readonly string[], b: readonly string[]): boolean {
  const left = [...a].sort()
  const right = [...b].sort()
  return (
    left.length === right.length && left.every((item, i) => item === right[i])
  )
}

const HEX_LEAF = /^0x[0-9a-f]{8,}$/
const DISTINCTIVE_LENGTH = 6

/** A leaf that would not be found by accident: an address, a hash, a long number or text. */
export function isDistinctive(leaf: string): boolean {
  return HEX_LEAF.test(leaf) || leaf.length >= DISTINCTIVE_LENGTH
}

function pick(values: Values, names: ReadonlySet<string>): Values {
  return Object.fromEntries([...names].map((name) => [name, values[name]]))
}

/** Which generated fields hold each leaf, so a match names its evidence. */
function leafIndex(values: Values): Map<string, string[]> {
  const index = new Map<string, string[]>()
  for (const [name, value] of Object.entries(values)) {
    for (const leaf of new Set(leavesOf(value))) {
      index.set(leaf, [...(index.get(leaf) ?? []), name])
    }
  }
  return index
}

function fieldsContaining(
  value: unknown,
  generatedLeaves: Map<string, string[]>,
): string[] | undefined {
  const distinctive = [...new Set(leavesOf(value))].filter(isDistinctive)
  if (distinctive.length === 0) {
    return undefined
  }
  const names = new Set<string>()
  for (const leaf of distinctive) {
    const holders = generatedLeaves.get(leaf)
    if (holders === undefined) {
      return undefined
    }
    for (const holder of holders) names.add(holder)
  }
  return [...names].sort()
}

export function valuesEqual(a: unknown, b: unknown): boolean {
  return canonicalJson(normaliseValue(a)) === canonicalJson(normaliseValue(b))
}

/** JSON with object keys sorted and undefined entries dropped, so key order never makes two values differ. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value))
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([key, entry]) => [key, sortKeys(entry)]),
    )
  }
  return value
}

const PREFIXED_ADDRESS = /^([a-z0-9]{2,10}:)?(0x[0-9a-fA-F]{40})$/
/** A bytes32 that is an address left-padded with zeros, as `batcherHash` holds one. */
const PADDED_ADDRESS = /^0x0{24}([0-9a-fA-F]{40})$/

export function normaliseValue(value: unknown): unknown {
  if (typeof value === 'string') {
    const match = PREFIXED_ADDRESS.exec(value) ?? PADDED_ADDRESS.exec(value)
    if (match === null) {
      return value
    }
    const hex = match[match.length - 1] as string
    return `${hex.startsWith('0x') ? '' : '0x'}${hex}`.toLowerCase()
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
export function summariseDifference(v1: unknown, generated: unknown): string {
  const a = normaliseValue(v1)
  const b = normaliseValue(generated)
  if (Array.isArray(a) && Array.isArray(b)) {
    return summariseArrays(a, b)
  }
  if (isRecord(a) && isRecord(b)) {
    return summariseObjects(a, b)
  }
  return `V1=${short(a)} generated=${short(b)}`
}

function summariseArrays(a: unknown[], b: unknown[]): string {
  const onlyA = elementsOnlyIn(a, b)
  const onlyB = elementsOnlyIn(b, a)
  const parts = [`arrays: V1 has ${a.length} item(s), generated ${b.length}`]
  if (onlyA.length > 0) parts.push(`only in V1: ${examples(onlyA)}`)
  if (onlyB.length > 0) parts.push(`only in generated: ${examples(onlyB)}`)
  if (onlyA.length === 0 && onlyB.length === 0) {
    parts.push('same elements in another order or multiplicity')
  }
  return parts.join('; ')
}

function summariseObjects(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): string {
  const keysA = Object.keys(a)
  const onlyA = keysA.filter((key) => !Object.hasOwn(b, key))
  const onlyB = Object.keys(b).filter((key) => !Object.hasOwn(a, key))
  const differing = keysA.filter(
    (key) =>
      Object.hasOwn(b, key) && canonicalJson(a[key]) !== canonicalJson(b[key]),
  )
  const parts = ['objects']
  if (onlyA.length > 0) parts.push(`keys only in V1: ${examples(onlyA)}`)
  if (onlyB.length > 0) parts.push(`keys only in generated: ${examples(onlyB)}`)
  if (differing.length > 0) parts.push(`differing keys: ${examples(differing)}`)
  return parts.join('; ')
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

const FOUND_VERDICTS: ReadonlySet<FieldVerdict['verdict']> = new Set([
  'equal',
  'equal-renamed',
  'equal-by-value',
])

/** The generated values hold the V1 field's values, under any name or shape. */
export function isFound(verdict: FieldVerdict): boolean {
  return FOUND_VERDICTS.has(verdict.verdict)
}

export function isHandlerField(verdict: FieldVerdict): boolean {
  return verdict.verdict !== 'v2-only' && verdict.attribution.kind === 'handler'
}

/** A handler field the model could have written: the headline denominator. */
export function isReachable(verdict: FieldVerdict): boolean {
  return (
    verdict.verdict !== 'v2-only' &&
    verdict.attribution.kind === 'handler' &&
    verdict.attribution.unreachable === undefined
  )
}

/**
 * A committed value that was not the template's work and is missing or
 * changed: a proxy value, a getter the generated template ignored or
 * renamed, an override field. A formatted getter is left out, because its
 * committed value went through the hidden template's `edit`.
 */
export function isRegression(verdict: FieldVerdict): boolean {
  if (verdict.verdict !== 'v1-only' && verdict.verdict !== 'different') {
    return false
  }
  const attribution = verdict.attribution
  return (
    attribution.kind === 'proxy' ||
    attribution.kind === 'override' ||
    (attribution.kind === 'getter' && attribution.edited === undefined)
  )
}

export function countVerdicts(verdicts: FieldVerdict[]): VerdictCounts {
  const counts = emptyCounts()
  for (const verdict of verdicts) {
    countVerdict(counts, verdict)
    if (isHandlerField(verdict)) {
      counts.handlerFields++
      if (isFound(verdict)) counts.handlerFound++
    }
    if (isReachable(verdict)) {
      counts.reachableFields++
      if (isFound(verdict)) counts.reachableFound++
    }
    if (isRegression(verdict)) counts.regressions++
  }
  return counts
}

function countVerdict(counts: VerdictCounts, verdict: FieldVerdict): void {
  switch (verdict.verdict) {
    case 'equal':
      counts.v1Fields++
      counts.generatedFields++
      counts.equal++
      break
    case 'equal-renamed':
      counts.v1Fields++
      counts.generatedFields++
      counts.equalRenamed++
      break
    case 'equal-by-value':
      counts.v1Fields++
      counts.equalByValue++
      // A namesake is the generated field itself; a nameless match's
      // fields are counted as v2-only on their own.
      if (verdict.generatedNames.includes(verdict.name)) {
        counts.generatedFields++
      }
      break
    case 'different':
      counts.v1Fields++
      counts.generatedFields++
      counts.different++
      break
    case 'v1-only':
      counts.v1Fields++
      counts.v1Only[verdict.attribution.kind]++
      break
    case 'v2-only':
      counts.generatedFields++
      counts.v2Only[verdict.class]++
      break
  }
}

export function emptyCounts(): VerdictCounts {
  return {
    v1Fields: 0,
    generatedFields: 0,
    equal: 0,
    equalRenamed: 0,
    equalByValue: 0,
    different: 0,
    v1Only: Object.fromEntries(
      ATTRIBUTION_KINDS.map((kind) => [kind, 0]),
    ) as VerdictCounts['v1Only'],
    v2Only: Object.fromEntries(
      V2_ONLY_CLASSES.map((kind) => [kind, 0]),
    ) as VerdictCounts['v2Only'],
    handlerFields: 0,
    handlerFound: 0,
    reachableFields: 0,
    reachableFound: 0,
    regressions: 0,
  }
}

export function addCounts(into: VerdictCounts, more: VerdictCounts): void {
  into.v1Fields += more.v1Fields
  into.generatedFields += more.generatedFields
  into.equal += more.equal
  into.equalRenamed += more.equalRenamed
  into.equalByValue += more.equalByValue
  into.different += more.different
  for (const kind of ATTRIBUTION_KINDS) {
    into.v1Only[kind] += more.v1Only[kind]
  }
  for (const kind of V2_ONLY_CLASSES) {
    into.v2Only[kind] += more.v2Only[kind]
  }
  into.handlerFields += more.handlerFields
  into.handlerFound += more.handlerFound
  into.reachableFields += more.reachableFields
  into.reachableFound += more.reachableFound
  into.regressions += more.regressions
}

/** `different (handler (event)): arrays: …` for lists of non-equal fields. */
export function describeVerdict(verdict: FieldVerdict): string {
  switch (verdict.verdict) {
    case 'equal':
      return `equal (${describeAttribution(verdict.attribution)})`
    case 'equal-renamed':
      return `equal-renamed → \`${verdict.generatedName}\` (${describeAttribution(verdict.attribution)})`
    case 'equal-by-value':
      return `equal-by-value in ${verdict.generatedNames.map((n) => `\`${n}\``).join(', ')} (${describeAttribution(verdict.attribution)})`
    case 'different':
      return `different (${describeAttribution(verdict.attribution)}): ${verdict.diff}`
    case 'v1-only':
      return `v1-only (${describeAttribution(verdict.attribution)})`
    case 'v2-only':
      return `v2-only (${verdict.class})`
  }
}
