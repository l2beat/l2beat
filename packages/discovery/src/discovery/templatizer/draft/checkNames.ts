/**
 * R4: field names V1 can hold without changing anything else.
 *
 * `getHandlers` keeps the first field of a name and puts template fields
 * before the system ones, so a draft field named like a baseline getter
 * silently replaces that getter's value; the same goes for a field kept
 * from an older template. Those collisions, the identifier pattern (a `$`
 * prefix is V1's proxy namespace) and the two names V1 hard-codes are
 * errors. The one sanctioned reuse is an `array` field over a
 * single-`uint256` getter: it replaces V1's 5-index probe with the whole
 * array under the same name.
 *
 * Whether a name says where the value comes from is a readability matter
 * researchers settle in review (they name membership mappings after their
 * members, `sequencers` for `isSequencer(address)`), so that check only
 * warns, and only when the name shares no word with what the field reads.
 */
import { rewriteSolidityIdentifier } from '../../handlers/utils/rewriteSolidityIdentifier'
import { nameOf } from '../closest'
import type { BaselineField } from '../facts'
import { isProbed } from '../worklist'
import type { DraftField, DraftHandler } from './Draft'
import { FIXED_FIELD_NAMES } from './Draft'
import { fieldPath } from './Finding'
import { type FieldReads, readEvents } from './fieldReads'
import type { RuleContext } from './ruleContext'
import { show } from './schemaProblems'

const FIELD_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/

export function checkNames(ctx: RuleContext): void {
  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    const reads = ctx.reads.get(name) as FieldReads
    const problem = reservedNameProblem(name, field, reads, ctx)
    if (problem !== undefined) {
      ctx.findings.error(fieldPath(name), problem)
      continue
    }
    checkDescriptiveName(name, field, reads, ctx)
  }
}

function reservedNameProblem(
  name: string,
  field: DraftField,
  reads: FieldReads,
  ctx: RuleContext,
): string | undefined {
  if (!FIELD_NAME.test(name)) {
    return `"${name}" is not a field name V1 can hold: use a Solidity identifier (letters, digits and _, not starting with a digit); a leading $ is reserved for proxy values`
  }
  const fixed = fixedNameOf(field.handler)
  if (fixed !== undefined && name !== fixed) {
    return fixedNameProblem(field.handler.type, fixed)
  }
  if (ctx.lockedFieldNames.has(name)) {
    return `"${name}" is a field of the existing template, kept as it is; pick another name (reference it as {{ ${name} }} if you need its value)`
  }
  const baseline = Object.hasOwn(ctx.facts.baseline.fields, name)
    ? ctx.facts.baseline.fields[name]
    : undefined
  if (baseline?.kind === 'getter') {
    return `"${name}" is a baseline getter (${describeBaseline(baseline)}); V1 keeps the first field of a name and template fields come first, so this field would replace that value; pick another name and reference the getter as {{ ${name} }} if you need it`
  }
  if (baseline?.kind === 'probe' && !replacesProbe(name, field, reads)) {
    return `"${name}" is V1's 5-index probe of ${name}(uint256); only an \`array\` field reading ${name}(uint256) may take this name (it replaces the probe with the whole array), so pick another name`
  }
  return undefined
}

/**
 * `accessControl` is read by name when V1 derives permissions, unless the
 * field only picks one role's members; `constructorArgs` is enforced by
 * the handler's constructor.
 */
function fixedNameOf(handler: DraftHandler): string | undefined {
  if (
    handler.type === 'accessControl' &&
    handler.pickRoleMembers !== undefined
  ) {
    return undefined
  }
  return FIXED_FIELD_NAMES[handler.type]
}

function fixedNameProblem(type: string, fixed: string): string {
  if (type === 'accessControl') {
    return `an accessControl field must be named "${fixed}", the name V1's permission analysis reads; to list one role's members under another name, add "pickRoleMembers"`
  }
  return `a ${type} field must be named "${fixed}"; V1's handler refuses any other name`
}

function replacesProbe(
  name: string,
  field: DraftField,
  reads: FieldReads,
): boolean {
  const fragment = reads.method?.fragment
  return (
    field.handler.type === 'array' &&
    fragment !== undefined &&
    rewriteSolidityIdentifier(fragment.name) === name &&
    isProbed(fragment)
  )
}

function describeBaseline(field: BaselineField): string {
  if (field.value !== undefined) {
    return `V1 reads it as ${show(field.value)}`
  }
  return `V1 reads it, currently with an error: ${field.error ?? 'unknown'}`
}

function checkDescriptiveName(
  name: string,
  field: DraftField,
  reads: FieldReads,
  ctx: RuleContext,
): void {
  const related = relatedIdentifiers(field, reads)
  if (
    FIXED_FIELD_NAMES[field.handler.type] === name ||
    ctx.abi.functionNames().includes(name) ||
    related.some(
      (identifier) =>
        lowerFirst(identifier) === name || sharesWord(name, identifier),
    )
  ) {
    return
  }
  const suggestions = suggestedNames(field, reads)
  const hint =
    suggestions.length > 0
      ? `; names from what it reads: ${suggestions.join(', ')}`
      : ''
  if (appearsInSource(name, ctx)) {
    ctx.findings.warning(
      fieldPath(name),
      `"${name}" shares no word with the function or events it reads, but appears in the source, so it is kept as a state variable name${hint}`,
    )
    return
  }
  ctx.findings.warning(
    fieldPath(name),
    `"${name}" shares no word with the function or events it reads and does not appear in the source; name the field after the getter, state variable or event subject it comes from${hint}`,
  )
}

/** The function it calls, the events it reads and the tokens it covers. */
function relatedIdentifiers(field: DraftField, reads: FieldReads): string[] {
  return [
    ...(reads.method?.fragment ? [reads.method.fragment.name] : []),
    ...readEvents(reads).map((event) => event.name),
    ...field.covers.map(nameOf),
  ]
}

function suggestedNames(field: DraftField, reads: FieldReads): string[] {
  const names = [
    ...field.covers.filter((token) => token.includes('(')).map(nameOf),
    ...readEvents(reads).map((event) => lowerFirst(event.name)),
  ]
  return [...new Set(names)]
}

/**
 * Two identifiers share a word when a camelCase or snake_case part of one
 * starts with a part of the other of at least four letters, so plurals and
 * participles match (`sequencers` and `isSequencer`, `revertedBatches` and
 * `RevertBatch`) but `is`, `get` and `set` do not.
 */
export function sharesWord(a: string, b: string): boolean {
  const theirs = identifierWords(b)
  return identifierWords(a).some((mine) =>
    theirs.some((other) => {
      const [short, long] =
        mine.length <= other.length ? [mine, other] : [other, mine]
      return short.length >= 4 && long.startsWith(short)
    }),
  )
}

export function identifierWords(identifier: string): string[] {
  return identifier
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    .split(/[\s_$]+/)
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase())
}

function appearsInSource(identifier: string, ctx: RuleContext): boolean {
  const word = new RegExp(`(^|[^A-Za-z0-9_$])${identifier}(?![A-Za-z0-9_$])`)
  return ctx.facts.sources.some((source) => word.test(source.flattened))
}

function lowerFirst(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1)
}
