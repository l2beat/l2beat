import { expect } from 'earl'
import type { Draft, DraftField } from '../draft/Draft'
import type { Baseline } from '../facts'
import { loadFixture } from '../test/fixtures'
import { buildWorklist } from '../worklist'
import { deriveIgnoreMethods } from './ignoreMethods'

function callField(method: string, covers: string[]): DraftField {
  return {
    handler: { type: 'call', method, args: [] },
    covers,
    reason: 'test',
  }
}

/** The baseline of a run that probed every single-uint256 getter of ScrollChain. */
const PROBED_ALL: Baseline = {
  fields: Object.fromEntries(
    [
      'committedBatches',
      'finalizedStateRoots',
      'isBatchFinalized',
      'withdrawRoots',
    ].map((name) => [name, { kind: 'probe', value: [] }]),
  ),
}

describe(deriveIgnoreMethods.name, () => {
  const scrollChain = loadFixture('ScrollChain')
  const worklist = buildWorklist(scrollChain.abi, PROBED_ALL)

  it('reproduces the committed ScrollChain ignoreMethods', () => {
    const draft: Draft = {
      fields: {
        lastBatchFinalized: callField('isBatchFinalized', [
          'isBatchFinalized(uint256)',
        ]),
      },
      skips: [
        { item: 'committedBatches(uint256)', reason: 'unbounded' },
        { item: 'finalizedStateRoots(uint256)', reason: 'unbounded' },
        { item: 'withdrawRoots(uint256)', reason: 'unbounded' },
        { item: 'isSequencer(address)', reason: 'covered' },
      ],
    }

    expect(deriveIgnoreMethods(worklist, draft)).toEqual([
      'committedBatches',
      'finalizedStateRoots',
      'isBatchFinalized',
      'withdrawRoots',
    ])
  })

  it('keeps the probe of a getter skipped as covered, since that is a claim and the probe may be the only copy', () => {
    const draft: Draft = {
      fields: {},
      skips: [
        { item: 'committedBatches(uint256)', reason: 'covered' },
        { item: 'withdrawRoots(uint256)', reason: 'unbounded' },
      ],
    }

    expect(deriveIgnoreMethods(worklist, draft)).toEqual(['withdrawRoots'])
  })

  it('leaves out a probe a field of its own name replaces, and unruled probes', () => {
    const draft: Draft = {
      fields: {
        withdrawRoots: callField('withdrawRoots', ['withdrawRoots(uint256)']),
      },
      skips: [{ item: 'committedBatches(uint256)', reason: 'unbounded' }],
    }

    expect(deriveIgnoreMethods(worklist, draft)).toEqual(['committedBatches'])
  })

  it('writes nothing for an item V1 did not probe for this address', () => {
    const abi = [
      'function fee() view returns (uint256)',
      'function fee(uint256 tier) view returns (uint256)',
      'function items(uint256 index) view returns (uint256)',
    ]
    // V1 kept the `fee()` getter and dropped the probe of the same name,
    // and `items` is ignored by the override: neither is probed.
    const baseline: Baseline = { fields: { fee: { kind: 'getter', value: 1 } } }
    const draft: Draft = {
      fields: {},
      skips: [
        { item: 'fee(uint256)', reason: 'computation' },
        { item: 'items(uint256)', reason: 'unbounded' },
      ],
    }

    expect(deriveIgnoreMethods(buildWorklist(abi, baseline), draft)).toEqual([])
  })
})
