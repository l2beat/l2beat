import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createTrackedTxId } from './createTrackedTxConfigId'
import type { TrackedTxConfigEntry } from './TrackedTxsConfig'

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
})

function mock(
  v?: Partial<TrackedTxConfigEntry>,
): Omit<TrackedTxConfigEntry, 'id'> {
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
  }
}
