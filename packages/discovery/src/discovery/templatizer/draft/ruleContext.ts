/**
 * What the draft rules read, built once per validation.
 *
 * The rules run only after the schema passed, so the draft is typed. What
 * each field names (its function, its events) is read once, up front,
 * because two rules need it and they must agree.
 */
import { AbiIndex } from '../abi/AbiIndex'
import type { ContractFacts } from '../facts'
import type { Worklist } from '../worklist'
import type { Draft } from './Draft'
import type { Findings } from './Finding'
import { type FieldReads, readsOf } from './fieldReads'

export interface ValidationContext {
  facts: ContractFacts
  /** Reduced by what an existing template already decides; the draft is checked against what is given. */
  worklist: Worklist
  /** Fields of the existing template: their names are taken and referenceable. */
  existingFieldNames?: string[]
}

export interface RuleContext {
  draft: Draft
  facts: ContractFacts
  worklist: Worklist
  /** For the hints of the coverage check: which function a stray token names. */
  abi: AbiIndex
  existingFieldNames: ReadonlySet<string>
  reads: ReadonlyMap<string, FieldReads>
  findings: Findings
}

export function buildRuleContext(
  draft: Draft,
  ctx: ValidationContext,
  findings: Findings,
): RuleContext {
  return {
    draft,
    facts: ctx.facts,
    worklist: ctx.worklist,
    abi: abiIndexOf(ctx.facts.abi),
    existingFieldNames: new Set(ctx.existingFieldNames ?? []),
    reads: new Map(
      Object.entries(draft.fields).map(([name, field]) => [
        name,
        readsOf(name, field.handler),
      ]),
    ),
    findings,
  }
}

const indexes = new WeakMap<readonly string[], AbiIndex>()

/** One parsed index per ABI array, since every round validates against the same one. */
export function abiIndexOf(abi: readonly string[]): AbiIndex {
  let index = indexes.get(abi)
  if (index === undefined) {
    index = AbiIndex.from(abi)
    indexes.set(abi, index)
  }
  return index
}
