import {
  TrackedTxConfigEntry,
  TrackedTxUseWithId,
  TrackedTxsConfig,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getLivenessTrackedTxsConfig } from './getLivenessTrackedTxsConfig'

describe(getLivenessTrackedTxsConfig.name, () => {
  it('should map configs', () => {
    const NOW = UnixTime.now()
    const trackedTxsConfigMock = mockObject<TrackedTxsConfig>({
      entries: [
        mockObject<TrackedTxConfigEntry>({
          uses: [
            mockObject<TrackedTxUseWithId>({
              type: 'liveness',
              subtype: 'batchSubmissions',
            }),
          ],
          untilTimestampExclusive: NOW,
        }),
      ],
    })

    const result = getLivenessTrackedTxsConfig(trackedTxsConfigMock)

    expect(result).toEqual({
      entries: [
        {
          subtype: 'batchSubmissions',
          untilTimestamp: NOW,
        },
      ],
    })
  })
})
