import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createTrackedTxId } from './createTrackedTxConfigId'
import type { TrackedTxConfigEntryWithoutId } from './TrackedTxsConfig'

describe(createTrackedTxId.name, () => {
  const fields = [
    {
      key: 'projectId',
      newValue: ProjectId('new-project-id'),
      shouldUpdateHash: true,
    },
    {
      key: 'sinceTimestamp',
      newValue: UnixTime(1),
      shouldUpdateHash: true,
    },
    {
      key: 'untilTimestamp',
      newValue: UnixTime(1),
      shouldUpdateHash: false,
    },
    {
      key: 'type',
      newValue: 'liveness',
      shouldUpdateHash: true,
    },
    {
      key: 'subtype',
      newValue: 'batchSubmission',
      shouldUpdateHash: true,
    },
    {
      key: 'params',
      newValue: {
        formula: 'transfer',
        from: EthereumAddress.random(),
        to: EthereumAddress.random(),
      },
      shouldUpdateHash: true,
    },
  ]

  for (const f of fields) {
    it(f.key, () => {
      const pre = createTrackedTxId(mock())

      const post = createTrackedTxId(mock({ [f.key]: f.newValue }))

      if (f.shouldUpdateHash) {
        expect(pre).not.toEqual(post)
      } else {
        expect(pre).toEqual(post)
      }
    })
  }

  it('includes liveness grouping in the hash', () => {
    const base = {
      projectId: ProjectId('project-id'),
      sinceTimestamp: 0,
      subtype: 'stateUpdates' as const,
      type: 'liveness' as const,
      params: {
        formula: 'functionCall' as const,
        address: EthereumAddress.ZERO,
        selector: 'selector',
        signature: 'function foo((uint256,uint256))' as const,
      },
    }

    const perTransaction = createTrackedTxId(base)
    const grouped = createTrackedTxId({
      ...base,
      groupBy: { type: 'functionCallParameter', path: [0, 0] },
    })
    const groupedByAnotherParameter = createTrackedTxId({
      ...base,
      groupBy: { type: 'functionCallParameter', path: [0, 1] },
    })

    expect(grouped).not.toEqual(perTransaction)
    expect(groupedByAnotherParameter).not.toEqual(grouped)
  })
})

function mock(
  v?: Partial<Record<keyof TrackedTxConfigEntryWithoutId, unknown>>,
): TrackedTxConfigEntryWithoutId {
  return {
    projectId: ProjectId('project-id'),
    sinceTimestamp: 0,
    untilTimestamp: 0,
    subtype: 'stateUpdates',
    type: 'l2costs',
    params: {
      formula: 'functionCall',
      address: EthereumAddress.ZERO,
      selector: 'selector',
      signature: 'function foo()',
    },
    ...v,
  } as TrackedTxConfigEntryWithoutId
}
