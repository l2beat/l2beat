/**
 * R6: every `{{ … }}` reference names a value V1 has when the field runs.
 *
 * V1 orders handlers by the field names their references start with and
 * throws for the whole contract when a name never becomes available or
 * names form a cycle ("Impossible to resolve dependencies"), so an unknown
 * or circular reference costs every field of the contract, not just one.
 * Where the referenced value is already in the baseline its shape is
 * checked against what the position needs, walking sub-paths the way
 * `resolveReference` does (object keys only).
 */
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { utils } from 'ethers'
import { rewriteSolidityIdentifier } from '../../handlers/utils/rewriteSolidityIdentifier'
import type { ContractValue } from '../../output/types'
import { checkLiteral, isAddressLiteral } from '../abi/literals'
import { closest } from '../closest'
import type { BaselineField } from '../facts'
import { arrayLengthProblem } from './checkHandlers'
import type { DraftField, DraftHandler } from './Draft'
import { fieldPath, joinPath } from './Finding'
import type { FieldReads } from './fieldReads'
import {
  findCycles,
  isMalformedReference,
  type ReferenceSite,
  referenceSites,
  referenceSlots,
} from './references'
import type { RuleContext } from './ruleContext'
import { show } from './schemaProblems'

const SPECIAL_REFERENCES =
  '{{ $.address }}, {{ $$.blockNumber }} and {{ $$.chainName }}'

export function checkReferences(ctx: RuleContext): void {
  const dropped = namesDroppedBySkips(ctx)
  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    const handlerPath = joinPath(fieldPath(name), 'handler')
    for (const slot of referenceSlots(field.handler)) {
      if (isMalformedReference(slot.value)) {
        ctx.findings.error(
          joinPath(handlerPath, slot.path),
          `V1 reads a reference only when the whole string is "{{ name }}" or "{{ name.key }}" with a field name; ${show(slot.value)} would be passed on literally`,
        )
      }
    }
    for (const site of referenceSites(field.handler)) {
      const problem = siteProblem(name, site, dropped, ctx)
      const path = joinPath(handlerPath, site.path)
      if (problem?.severity === 'warning') {
        ctx.findings.warning(path, problem.message)
      } else if (problem !== undefined) {
        ctx.findings.error(path, problem.message)
      }
    }
  }
  checkCycles(ctx)
}

interface Problem {
  severity: 'error' | 'warning'
  message: string
}

function siteProblem(
  fieldName: string,
  site: ReferenceSite,
  dropped: Map<string, string>,
  ctx: RuleContext,
): Problem | undefined {
  const { base } = site
  if (base === '$' || base === '$$') {
    return asError(specialReferenceProblem(site, ctx))
  }
  if (base.startsWith('$')) {
    return asError(dollarNameProblem(site, ctx))
  }
  if (base === fieldName) {
    return asError(
      `a field cannot reference itself: V1 would wait for {{ ${base} }} forever and fail the whole contract ("Impossible to resolve dependencies")`,
    )
  }
  if (hasOwn(ctx.draft.fields, base) || ctx.lockedFieldNames.has(base)) {
    return undefined
  }
  const baseline = hasOwn(ctx.facts.baseline.fields, base)
    ? ctx.facts.baseline.fields[base]
    : undefined
  if (baseline === undefined) {
    return asError(unknownReferenceProblem(site, ctx))
  }
  const skipped = dropped.get(base)
  if (skipped !== undefined) {
    return asError(
      `the draft skips ${skipped}, which puts "${base}" into the template's ignoreMethods, so V1 no longer reads {{ ${base} }}; cover that item instead of skipping it, or reference something else`,
    )
  }
  const handler = (ctx.draft.fields[fieldName] as DraftField).handler
  return baselineReferenceProblem(
    site,
    baseline,
    handler,
    ctx.reads.get(fieldName),
  )
}

function specialReferenceProblem(
  site: ReferenceSite,
  ctx: RuleContext,
): string | undefined {
  const allowed = site.base === '$' ? ['address'] : ['blockNumber', 'chainName']
  if (site.rest.length !== 1 || !allowed.includes(site.rest[0] as string)) {
    return `V1 provides only ${SPECIAL_REFERENCES}; {{ ${site.referenced} }} is none of them`
  }
  if (site.referenced === '$.address' && site.position === 'arg') {
    const plain = ChainSpecificAddress.address(ctx.facts.address)
    return `{{ $.address }} is this contract's chain-prefixed address, which ethers cannot encode as a call argument; write it as the literal "${plain}"`
  }
  if (site.referenced === '$.address' || site.position !== 'address') {
    return undefined
  }
  return `\`address\` needs an address, and {{ ${site.referenced} }} is not one`
}

function dollarNameProblem(site: ReferenceSite, ctx: RuleContext): string {
  const what = hasOwn(ctx.facts.proxyValues, site.base)
    ? 'a proxy value, not a handler result'
    : 'not a value V1 knows'
  return `${site.base} is ${what}, so V1 cannot resolve {{ ${site.referenced} }} ("Missing dependency"); the only $ references are ${SPECIAL_REFERENCES}`
}

function unknownReferenceProblem(
  site: ReferenceSite,
  ctx: RuleContext,
): string {
  const names = [
    ...Object.keys(ctx.facts.baseline.fields),
    ...Object.keys(ctx.draft.fields),
    ...ctx.lockedFieldNames,
  ]
  const kept =
    ctx.lockedFieldNames.size > 0
      ? ', a field kept from the existing template'
      : ''
  return `there is no field "${site.base}" to reference; a reference names a baseline field, another draft field${kept}, or one of ${SPECIAL_REFERENCES}; closest: ${closest(names, site.base).join(', ')}`
}

function baselineReferenceProblem(
  site: ReferenceSite,
  baseline: BaselineField,
  handler: DraftHandler,
  reads: FieldReads | undefined,
): Problem | undefined {
  if (baseline.value === undefined) {
    return {
      severity: 'warning',
      message: `baseline field "${site.base}" has no value (${baseline.error ?? 'nothing was read'}), so this field fails unless it reads at run time`,
    }
  }
  const walked = walkReferencePath(baseline.value, site)
  if (typeof walked === 'string') {
    return asError(walked)
  }
  const problem =
    positionProblem(site, walked.value, reads) ??
    (site.position === 'length'
      ? arrayLengthProblem(Number(walked.value), handler)
      : undefined)
  return problem === undefined
    ? undefined
    : asError(`{{ ${site.referenced} }} is ${show(walked.value)}: ${problem}`)
}

/** `resolveReference`: each path element is a key of an object, never an index. */
function walkReferencePath(
  value: ContractValue,
  site: ReferenceSite,
): { value: ContractValue } | string {
  let current = value
  let reached = site.base
  for (const key of site.rest) {
    if (
      typeof current !== 'object' ||
      current === null ||
      Array.isArray(current)
    ) {
      return `V1 walks reference paths through object keys only, and ${reached} is ${show(current)}`
    }
    const next: ContractValue | undefined = current[key]
    if (next === undefined) {
      return `${reached} has no key "${key}"; its keys are ${Object.keys(current).join(', ')}`
    }
    current = next
    reached = `${reached}.${key}`
  }
  return { value: current }
}

function positionProblem(
  site: ReferenceSite,
  value: ContractValue,
  reads: FieldReads | undefined,
): string | undefined {
  switch (site.position) {
    case 'address':
      return isAddressValue(value)
        ? undefined
        : '`address` needs a field holding an address'
    case 'length':
      return isNonNegativeInteger(value)
        ? undefined
        : '`length` needs a field holding a non-negative integer'
    case 'indices':
      return Array.isArray(value) && value.every(isIntegerLike)
        ? undefined
        : '`indices` needs a field holding an array of keys'
    case 'slot':
    case 'offset':
      return isIntegerLike(value)
        ? undefined
        : `\`${site.position}\` needs a field holding a number or hex string`
    case 'arg': {
      const input = reads?.method?.fragment?.inputs[site.argIndex ?? -1]
      return input === undefined
        ? undefined
        : checkLiteral(value, input as utils.ParamType)
    }
  }
}

function checkCycles(ctx: RuleContext): void {
  const handlers = Object.fromEntries(
    Object.entries(ctx.draft.fields).map(([name, field]) => [
      name,
      field.handler,
    ]),
  )
  for (const cycle of findCycles(handlers)) {
    if (cycle.length === 2) {
      continue
    }
    ctx.findings.error(
      joinPath(fieldPath(cycle[0] as string), 'handler'),
      `fields ${cycle.join(' -> ')} reference each other in a cycle, so V1 cannot order them and fails the whole contract ("Impossible to resolve dependencies"); read one of them from the baseline or a literal`,
    )
  }
}

/**
 * Skipped single-`uint256` items become `ignoreMethods` entries (by name)
 * when the template is written, which also stops V1 from probing them.
 */
function namesDroppedBySkips(ctx: RuleContext): Map<string, string> {
  const skipped = new Set(ctx.draft.skips.map((skip) => skip.item))
  return new Map(
    ctx.worklist.items
      .filter((item) => item.probed && skipped.has(item.signature))
      .map((item) => [rewriteSolidityIdentifier(item.name), item.signature]),
  )
}

function isAddressValue(value: ContractValue): boolean {
  return typeof value === 'string' && isAddressLiteral(value)
}

function isNonNegativeInteger(value: ContractValue): boolean {
  return (
    (typeof value === 'number' && Number.isInteger(value) && value >= 0) ||
    (typeof value === 'string' && /^\d+$/.test(value))
  )
}

function isIntegerLike(value: ContractValue): boolean {
  return (
    (typeof value === 'number' && Number.isInteger(value)) ||
    (typeof value === 'string' && /^(0x[0-9a-fA-F]+|-?\d+)$/.test(value))
  )
}

function asError(message: string | undefined): Problem | undefined {
  return message === undefined ? undefined : { severity: 'error', message }
}

function hasOwn(record: object, key: string): boolean {
  return Object.hasOwn(record, key)
}
