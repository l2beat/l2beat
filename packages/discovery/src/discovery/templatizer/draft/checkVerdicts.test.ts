import { expect } from 'earl'
import { checkVerdicts } from './checkVerdicts'
import type { Finding } from './Finding'
import {
  contextFor,
  draftOf,
  field,
  runRule,
  scrollChainDraft,
} from './test/drafts'

describe(checkVerdicts.name, () => {
  const ctx = contextFor('ScrollChain')
  const error = (path: string, message: string): Finding => ({
    path,
    message,
  })

  it('accepts one verdict per worklist token', () => {
    expect(runRule(checkVerdicts, scrollChainDraft(), ctx)).toEqual([])
  })

  it('reports each token with no verdict', () => {
    const draft = scrollChainDraft()
    draft.skips = draft.skips.filter(
      (skip) =>
        skip.item !== 'CommitBatch' &&
        skip.item !== 'isBatchFinalized(uint256)',
    )
    expect(runRule(checkVerdicts, draft, ctx)).toEqual([
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

  it('asks for the constructor’s verdict and corrects its spelling', () => {
    const factory = contextFor('DisputeGameFactory')
    const draft = draftOf({}, [
      { item: 'constructor(address _admin)', reason: 'covered' },
    ])
    const messages = runRule(checkVerdicts, draft, factory).map(
      (finding) => `${finding.path}: ${finding.message}`,
    )
    expect(messages[0]).toEqual(
      'skips[0].item: "constructor(address _admin)" is not on the worklist; the constructor is written as its signature: "constructor(address)"',
    )
    expect(messages).toInclude(
      'draft: constructor(address) has no verdict; cover it with a constructorArgs field, or add it to skips with one of user-activity, computation, unbounded, covered, not-state',
    )
  })

  it('tells a revisit that the existing template already decides the constructor', () => {
    const full = contextFor('DisputeGameFactory')
    const { constructorItem: _decided, ...worklist } = full.worklist
    const draft = draftOf({}, [
      { item: 'constructor(address)', reason: 'covered' },
    ])
    const messages = runRule(checkVerdicts, draft, {
      ...full,
      worklist,
    }).map((finding) => `${finding.path}: ${finding.message}`)
    expect(messages[0]).toEqual(
      'skips[0].item: "constructor(address)" is not on the worklist; the existing template already decides it (its constructorArgs field reads it); drop this verdict',
    )
  })

  it('reports a second verdict where it appears, naming the first', () => {
    const draft = scrollChainDraft()
    draft.skips.push({ item: 'UpdateSequencer', reason: 'user-activity' })
    expect(runRule(checkVerdicts, draft, ctx)).toEqual([
      error(
        'skips[15].item',
        '"UpdateSequencer" already has a verdict at fields.sequencers.covers[1]; cover an item with fields or skip it once, never both',
      ),
    ])
  })

  it('lets several call fields that read one function with different literal args each cover it, and nothing else', () => {
    const verifier = contextFor('NitroEnclaveVerifier')
    const perLiteral = {
      zkConfigRiscZero: field(
        { type: 'call', method: 'getZkConfig', args: [1] },
        ['getZkConfig(uint8)'],
      ),
      zkConfigSuccinct: field(
        { type: 'call', method: 'getZkConfig', args: [2] },
        ['getZkConfig(uint8)'],
      ),
    }
    const doubles = (draft: Parameters<typeof runRule>[1]) =>
      runRule(checkVerdicts, draft, verifier)
        .filter((finding) => finding.message.includes('already has a verdict'))
        .map((finding) => `${finding.path}: ${finding.message}`)

    expect(doubles(draftOf(perLiteral))).toEqual([])
    expect(
      doubles(
        draftOf(perLiteral, [
          { item: 'getZkConfig(uint8)', reason: 'covered' },
        ]),
      ),
    ).toEqual([
      'skips[0].item: "getZkConfig(uint8)" already has a verdict at fields.zkConfigRiscZero.covers[0]; cover an item with fields or skip it once, never both',
    ])
  })

  it('allows separate fields to select different state from the same event', () => {
    const draft = scrollChainDraft()
    draft.fields.sequencerUpdates = field(
      { type: 'event', select: 'status', add: { event: 'UpdateSequencer' } },
      ['UpdateSequencer'],
    )
    expect(runRule(checkVerdicts, draft, ctx)).toEqual([])
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
    const messages = runRule(checkVerdicts, draft, ctx).map(
      (finding) => `${finding.path}: ${finding.message}`,
    )
    expect(messages).toEqual([
      'fields.revertedBatches.covers[0]: "RevertBatch(uint256,bytes32)" is not on the worklist; events are named without parameters: "RevertBatch"',
      'skips[16].item: "isSequencer" is not on the worklist; functions are written as signatures: "isSequencer(address)"',
      'skips[17].item: "owner()" is not on the worklist; it is a 0-argument getter the baseline already reads; it needs no verdict',
      'skips[18].item: "addSequencer(address)" is not on the worklist; it changes state, and V1 never reads such functions; only view functions with arguments and events need a verdict',
      'skips[19].item: "isSequencr(address)" is not on the worklist; closest: isSequencer(address), isProver(address), UpdateSequencer',
    ])
  })

  it('validates against a worklist an existing template reduced', () => {
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
    expect(runRule(checkVerdicts, scrollChainDraft(), reduced)).toEqual([
      error(
        'fields.sequencers.covers[0]',
        '"isSequencer(address)" is not on the worklist; the existing template already decides it (a kept field answers it, or its ignoreMethods leaves it out); drop this verdict',
      ),
    ])
  })
})
