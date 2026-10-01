/**
 * What the draft rules R3–R9 read, built once per validation.
 *
 * The rules run only after the schema passed, so the draft is typed. Which
 * function and events each field reads is resolved once, up front, because
 * three rules need it (names, ABI checks, covers) and they must agree.
 */
import { AbiIndex } from '../abi/AbiIndex'
import type { ContractFacts } from '../facts'
import type { Worklist } from '../worklist'
import type { Draft } from './Draft'
import type { Findings } from './Finding'
import { type FieldReads, readsOf } from './fieldReads'

export interface ValidationContext {
  facts: ContractFacts
  /** May be reduced by the caller (freeze path); the draft is checked against what is given. */
  worklist: Worklist
  /** Fields of an older template kept verbatim: their names are reserved and referenceable. */
  lockedFieldNames?: string[]
}

export interface RuleContext {
  draft: Draft
  facts: ContractFacts
  worklist: Worklist
  abi: AbiIndex
  lockedFieldNames: ReadonlySet<string>
  reads: ReadonlyMap<string, FieldReads>
  findings: Findings
}

export function buildRuleContext(
  draft: Draft,
  ctx: ValidationContext,
  findings: Findings,
): RuleContext {
  const abi = abiIndexOf(ctx.facts.abi)
  const reads = new Map(
    Object.entries(draft.fields).map(([name, field]) => [
      name,
      readsOf(name, field.handler, ctx.facts.abi, abi),
    ]),
  )
  return {
    draft,
    facts: ctx.facts,
    worklist: ctx.worklist,
    abi,
    lockedFieldNames: new Set(ctx.lockedFieldNames ?? []),
    reads,
    findings,
  }
}

const indexes = new WeakMap<readonly string[], AbiIndex>()

/** One parsed index per ABI array: `naturalCovers` is called once per field by the freeze path. */
export function abiIndexOf(abi: readonly string[]): AbiIndex {
  let index = indexes.get(abi)
  if (index === undefined) {
    index = AbiIndex.from(abi)
    indexes.set(abi, index)
  }
  return index
}

export function isFieldPath(path: string, fieldPrefix: string): boolean {
  return (
    path === fieldPrefix ||
    path.startsWith(`${fieldPrefix}.`) ||
    path.startsWith(`${fieldPrefix}[`)
  )
}
