import { expect } from 'earl'
import type { Draft, DraftField } from '../draft/Draft'
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

describe(deriveIgnoreMethods.name, () => {
  const scrollChain = loadFixture('ScrollChain')
  const worklist = buildWorklist(scrollChain.abi)

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

    expect(deriveIgnoreMethods(worklist, draft, scrollChain.abi)).toEqual([
      'committedBatches',
      'finalizedStateRoots',
      'isBatchFinalized',
      'withdrawRoots',
    ])
  })

  it('leaves out a probe a field of its own name replaces, and unruled probes', () => {
    const draft: Draft = {
      fields: {
        withdrawRoots: callField('withdrawRoots', ['withdrawRoots(uint256)']),
      },
      skips: [{ item: 'committedBatches(uint256)', reason: 'unbounded' }],
    }

    expect(deriveIgnoreMethods(worklist, draft, scrollChain.abi)).toEqual([
      'committedBatches',
    ])
  })

  it('leaves out a name that a 0-argument getter shares', () => {
    const abi = [
      'function fee() view returns (uint256)',
      'function fee(uint256 tier) view returns (uint256)',
      'function items(uint256 index) view returns (uint256)',
    ]
    const draft: Draft = {
      fields: {},
      skips: [
        { item: 'fee(uint256)', reason: 'computation' },
        { item: 'items(uint256)', reason: 'unbounded' },
      ],
    }

    expect(deriveIgnoreMethods(buildWorklist(abi), draft, abi)).toEqual([
      'items',
    ])
  })
})
