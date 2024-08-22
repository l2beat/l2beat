import { BackendProject } from '@l2beat/config'
import { SavedConfiguration, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import {
  TrackedTxConfigEntry,
  TrackedTxLivenessConfig,
  createTrackedTxId,
} from '@l2beat/shared'
import { getActiveConfigurations } from './getActiveConfigurations'

describe(getActiveConfigurations.name, () => {
  it('should get active configurations', () => {
    const mockConfigurationId = createTrackedTxId.random()

    const mockedProject = mockObject<BackendProject>({
      isArchived: false,
      trackedTxsConfig: [
        mockObject<TrackedTxConfigEntry>({
          id: mockConfigurationId,
          type: 'liveness',
          subtype: 'batchSubmissions',
          untilTimestamp: UnixTime.now(),
        }),
      ],
    })

    const mockConfigurations = [
      mockObject<Omit<SavedConfiguration<TrackedTxConfigEntry>, 'properties'>>({
        id: mockConfigurationId,
        maxHeight: null,
        currentHeight: 1,
      }),
    ]

    const result = getActiveConfigurations(mockedProject, mockConfigurations)

    expect(result).toEqual(
      mockedProject.trackedTxsConfig as TrackedTxLivenessConfig[],
    )
  })
})
