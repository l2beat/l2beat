import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createTrackedTxId } from './createTrackedTxConfigId'
import type {
  TrackedTxConfigEntryWithoutId,
  TrackedTxCostsConfig,
  TrackedTxFunctionCallParameterEventIdentity,
} from './TrackedTxsConfig'

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

  it('includes liveness event identity in the ID', () => {
    const before = createTrackedTxId(mock({ type: 'liveness' }))
    const after = createTrackedTxId(
      mock({
        type: 'liveness',
        eventIdentity: {
          type: 'functionCallParameter',
          path: [0, 0],
        },
      }),
    )

    expect(before).not.toEqual(after)
  })
})

function mock(
  v: Partial<Omit<TrackedTxCostsConfig, 'id' | 'type'>> & {
    type?: 'liveness' | 'l2costs'
    eventIdentity?: TrackedTxFunctionCallParameterEventIdentity
  } = {},
): TrackedTxConfigEntryWithoutId {
  const base = {
    projectId: ProjectId('project-id'),
    sinceTimestamp: 0,
    untilTimestamp: 0,
    subtype: 'stateUpdates' as const,
    params: {
      formula: 'functionCall' as const,
      address: EthereumAddress.ZERO,
      selector: 'selector',
      signature: 'function foo()' as const,
    },
  }

  if (v.type !== 'liveness') {
    return { ...base, ...v, type: 'l2costs' }
  }

  const params = v.params ?? base.params
  if (v.eventIdentity) {
    if (params.formula !== 'functionCall') {
      throw new Error('Custom event identity requires a function call')
    }
    return {
      ...base,
      ...v,
      params,
      type: 'liveness',
      eventIdentity: v.eventIdentity,
    }
  }

  return {
    ...base,
    ...v,
    params,
    type: 'liveness',
    eventIdentity: { type: 'transactionHash' },
  }
}
