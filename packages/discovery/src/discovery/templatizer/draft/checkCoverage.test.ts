import { expect } from 'earl'
import { checkCoverage } from './checkCoverage'
import type { Finding } from './Finding'
import { contextFor, runRule, scrollChainDraft } from './test/drafts'

describe(checkCoverage.name, () => {
  const ctx = contextFor('ScrollChain')
  const error = (path: string, message: string): Finding => ({
    severity: 'error',
    path,
    message,
  })

  it('accepts one verdict per worklist token', () => {
    expect(runRule(checkCoverage, scrollChainDraft(), ctx)).toEqual([])
  })

  it('reports each token with no verdict', () => {
    const draft = scrollChainDraft()
    draft.skips = draft.skips.filter(
      (skip) =>
        skip.item !== 'CommitBatch' &&
        skip.item !== 'isBatchFinalized(uint256)',
    )
    expect(runRule(checkCoverage, draft, ctx)).toEqual([
      error(
        'draft',
        'function isBatchFinalized(uint256) has no verdict; add it to the covers of the field that reads it, or to skips with one of user-activity, computation, unbounded, covered, not-state',
      ),
      error(
        'draft',
        'event CommitBatch has no verdict; add it to the covers of the field that reads it, or to skips with one of user-activity, computation, unbounded, covered, not-state',
      ),
    ])
  })

  it('reports a second verdict where it appears, naming the first', () => {
    const draft = scrollChainDraft()
    draft.skips.push({ item: 'UpdateSequencer', reason: 'user-activity' })
    expect(runRule(checkCoverage, draft, ctx)).toEqual([
      error(
        'skips[14].item',
        '"UpdateSequencer" already has a verdict at fields.sequencers.covers[1]; give each worklist item exactly one verdict, in one field\'s covers or in one skip',
      ),
    ])
  })

  it('explains tokens that are not on the worklist', () => {
    const draft = scrollChainDraft()
    draft.fields.revertedBatches!.covers = ['RevertBatch(uint256,bytes32)']
    draft.skips.push(
      { item: 'RevertBatch', reason: 'covered' },
      { item: 'isSequencer', reason: 'covered' },
      { item: 'owner()', reason: 'covered' },
      { item: 'addSequencer(address)', reason: 'not-state' },
      { item: 'isSequencr(address)', reason: 'covered' },
    )
    const messages = runRule(checkCoverage, draft, ctx).map(
      (finding) => `${finding.path}: ${finding.message}`,
    )
    expect(messages).toEqual([
      'fields.revertedBatches.covers[0]: "RevertBatch(uint256,bytes32)" is not on the worklist; events are named without parameters: "RevertBatch"',
      'skips[15].item: "isSequencer" is not on the worklist; functions are written as signatures: "isSequencer(address)"',
      'skips[16].item: "owner()" is not on the worklist; it is a 0-argument getter the baseline already reads; it needs no verdict',
      'skips[17].item: "addSequencer(address)" is not on the worklist; it changes state, and V1 never reads such functions; only view functions with arguments and events need a verdict',
      'skips[18].item: "isSequencr(address)" is not on the worklist; closest: isSequencer(address), isProver(address), UpdateSequencer',
    ])
  })

  it('validates against a worklist the freeze path reduced', () => {
    const full = contextFor('ScrollChain')
    const reduced = {
      ...full,
      worklist: {
        ...full.worklist,
        items: full.worklist.items.filter(
          (item) => item.signature !== 'isSequencer(address)',
        ),
      },
    }
    expect(runRule(checkCoverage, scrollChainDraft(), reduced)).toEqual([
      error(
        'fields.sequencers.covers[0]',
        '"isSequencer(address)" is not on the worklist; the existing template already decides it (a kept field answers it, or its ignoreMethods leaves it out); drop this verdict',
      ),
    ])
  })
})
