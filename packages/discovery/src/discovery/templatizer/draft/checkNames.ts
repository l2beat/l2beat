/**
 * R4: field names V1 can hold without replacing anything.
 *
 * `getHandlers` keeps the first field of a name and puts template fields
 * before the system ones, so a draft field named like a baseline value
 * (a getter, a probe, a field of the project config) silently replaces that
 * value; so does a field named like one of the existing template's. Those
 * collisions and the identifier pattern (a `$` prefix is V1's proxy
 * namespace) are errors. The one sanctioned reuse is an `array` field over
 * the single-`uint256` getter V1 probes under that name: it replaces the
 * 0–4 probe with the whole array, which is what researchers write.
 *
 * Whether a name says what the field holds is for the reviewer.
 */
import { rewriteSolidityIdentifier } from '../../handlers/utils/rewriteSolidityIdentifier'
import type { BaselineField } from '../facts'
import type { DraftField } from './Draft'
import { fieldPath } from './Finding'
import type { FieldReads } from './fieldReads'
import type { RuleContext } from './ruleContext'
import { show } from './schemaProblems'

const FIELD_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/

export function checkNames(ctx: RuleContext): void {
  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    const problem = nameProblem(name, field, ctx)
    if (problem !== undefined) {
      ctx.findings.error(fieldPath(name), problem)
    }
  }
}

function nameProblem(
  name: string,
  field: DraftField,
  ctx: RuleContext,
): string | undefined {
  if (!FIELD_NAME.test(name)) {
    return `"${name}" is not a field name V1 can hold: use a Solidity identifier (letters, digits and _, not starting with a digit); a leading $ is reserved for proxy values`
  }
  if (ctx.existingFieldNames.has(name)) {
    return `"${name}" is a field of the existing template, kept as it is; pick another name (reference it as {{ ${name} }} if you need its value)`
  }
  const baseline = Object.hasOwn(ctx.facts.baseline.fields, name)
    ? ctx.facts.baseline.fields[name]
    : undefined
  if (baseline === undefined) {
    return undefined
  }
  if (baseline.kind === 'probe') {
    if (replacesProbe(name, field, ctx.reads.get(name) as FieldReads)) {
      return undefined
    }
    return `"${name}" is V1's 5-index probe of ${name}(uint256); only an \`array\` field reading ${name}(uint256) may take this name (it replaces the probe with the whole array), so pick another name`
  }
  return `"${name}" is ${describeBaseline(baseline)}; V1 keeps the first field of a name and template fields come first, so this field would replace that value; pick another name and reference it as {{ ${name} }} if you need it`
}

/** An `array` over the function of the probe's own name takes the probe over. */
function replacesProbe(
  name: string,
  field: DraftField,
  reads: FieldReads,
): boolean {
  return (
    field.handler.type === 'array' &&
    reads.method !== undefined &&
    rewriteSolidityIdentifier(reads.method.name) === name
  )
}

function describeBaseline(field: BaselineField): string {
  const origin =
    field.kind === 'getter'
      ? 'a baseline getter'
      : 'a field of the project config'
  const value =
    field.value !== undefined
      ? `V1 reads it as ${show(field.value)}`
      : `V1 reads it, currently with an error: ${field.error ?? 'unknown'}`
  return `${origin} (${value})`
}
