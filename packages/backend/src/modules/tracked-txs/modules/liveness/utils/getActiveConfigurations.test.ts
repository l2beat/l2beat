import {
  type TrackedTxConfigEntry,
  type TrackedTxLivenessConfig,
  createTrackedTxId,
} from '@l2beat/shared'
import {
  ProjectId,
  type SavedConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getActiveConfigurations } from './getActiveConfigurations'
import type { TrackedTxProject } from '../../../../../config/Config'

describe(getActiveConfigurations.name, () => {
  it('should get active configurations', () => {
    const mockConfigurationId = createTrackedTxId.random()

    const mockedProject: TrackedTxProject = {
      id: ProjectId('foo'),
      isArchived: false,
      configurations: [
        mockObject<TrackedTxConfigEntry>({
          id: mockConfigurationId,
          type: 'liveness',
          subtype: 'batchSubmissions',
          untilTimestamp: UnixTime.now(),
        }),
      ],
    }

    const mockConfigurations = [
      mockObject<Omit<SavedConfiguration<TrackedTxConfigEntry>, 'properties'>>({
        id: mockConfigurationId,
        maxHeight: null,
        currentHeight: 1,
      }),
    ]

    const result = getActiveConfigurations(mockedProject, mockConfigurations)
    expect(result).toEqual(
      mockedProject.configurations as TrackedTxLivenessConfig[],
    )
  })
})
