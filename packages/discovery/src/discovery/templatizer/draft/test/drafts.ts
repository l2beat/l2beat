/**
 * Drafts and contexts the draft-rule tests share.
 *
 * The ScrollChain draft is the committed V1 template
 * (`_templates/scroll/ScrollChain/template.jsonc`: sequencers, provers,
 * revertedBatches) with a verdict for every other worklist token. It is the
 * proof that the rules accept real V1 idioms, and each rule test breaks it
 * or a small draft in one place.
 */

import { type FixtureName, loadFixture } from '../../test/fixtures'
import { buildWorklist } from '../../worklist'
import type { Draft, DraftField, DraftHandler, DraftSkip } from '../Draft'
import { type Finding, Findings } from '../Finding'
import {
  buildRuleContext,
  type RuleContext,
  type ValidationContext,
} from '../ruleContext'

export function contextFor(
  name: FixtureName,
  overrides: Partial<ValidationContext> = {},
): ValidationContext {
  const facts = loadFixture(name)
  return { facts, worklist: buildWorklist(facts.abi), ...overrides }
}

/** Runs one rule over a draft that already passed the schema. */
export function runRule(
  rule: (ctx: RuleContext) => void,
  draft: Draft,
  ctx: ValidationContext,
): Finding[] {
  const findings = new Findings()
  rule(buildRuleContext(draft, ctx, findings))
  return findings.list
}

export function field(
  handler: DraftHandler,
  covers: string[] = [],
  extra: Partial<DraftField> = {},
): DraftField {
  return { handler, covers, reason: 'written only by the owner', ...extra }
}

export function draftOf(
  fields: Record<string, DraftField>,
  skips: DraftSkip[] = [],
): Draft {
  return { fields, skips }
}

export function scrollChainDraft(): Draft {
  return {
    fields: {
      sequencers: field(
        {
          type: 'event',
          select: 'account',
          add: { event: 'UpdateSequencer', where: ['=', '#status', true] },
          remove: { event: 'UpdateSequencer', where: ['!=', '#status', true] },
        },
        ['isSequencer(address)', 'UpdateSequencer'],
        {
          reason:
            'isSequencer is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer',
        },
      ),
      provers: field(
        {
          type: 'event',
          select: 'account',
          add: { event: 'UpdateProver', where: ['=', '#status', true] },
          remove: { event: 'UpdateProver', where: ['!=', '#status', true] },
        },
        ['isProver(address)', 'UpdateProver'],
        {
          reason:
            'isProver is written only by addProver/removeProver (onlyOwner), which emit UpdateProver',
        },
      ),
      revertedBatches: field(
        { type: 'event', select: 'batchIndex', add: { event: 'RevertBatch' } },
        ['RevertBatch'],
        { reason: 'revertBatch (onlyOwner) emits RevertBatch' },
      ),
    },
    skips: [
      { item: 'committedBatches(uint256)', reason: 'unbounded' },
      { item: 'finalizedStateRoots(uint256)', reason: 'unbounded' },
      { item: 'isBatchFinalized(uint256)', reason: 'computation' },
      { item: 'withdrawRoots(uint256)', reason: 'unbounded' },
      { item: 'AdminChanged', reason: 'covered' },
      { item: 'BeaconUpgraded', reason: 'not-state' },
      { item: 'CommitBatch', reason: 'unbounded' },
      { item: 'FinalizeBatch', reason: 'unbounded' },
      { item: 'Initialized', reason: 'not-state' },
      { item: 'OwnershipTransferred', reason: 'covered' },
      { item: 'Paused', reason: 'covered' },
      { item: 'Unpaused', reason: 'covered' },
      { item: 'UpdateEnforcedBatchMode', reason: 'covered' },
      { item: 'Upgraded', reason: 'covered' },
    ],
  }
}
