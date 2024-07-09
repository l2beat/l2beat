import { BackendProject } from '@l2beat/config'
import { TrackedTxConfigEntry, createTrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import { getProjectsToSync } from './getProjectsToSync'

describe(getProjectsToSync.name, () => {
  it('should filter projects', () => {
    const mockConfigurationId = createTrackedTxId.random()

    const mockedProjects = [
      mockObject<BackendProject>({
        isArchived: true,
      }),
      mockObject<BackendProject>({
        isArchived: false,
        trackedTxsConfig: undefined,
      }),
      mockObject<BackendProject>({
        isArchived: false,
        trackedTxsConfig: [
          mockObject<TrackedTxConfigEntry>({
            id: mockConfigurationId,
            type: 'liveness',
            subtype: 'batchSubmissions',
            untilTimestamp: UnixTime.now(),
          }),
        ],
      }),
    ]

    const mockConfigurations = [
      mockObject<Omit<SavedConfiguration<TrackedTxConfigEntry>, 'properties'>>({
        id: mockConfigurationId,
        maxHeight: null,
        currentHeight: 1,
      }),
    ]

    const result = getProjectsToSync(mockedProjects, mockConfigurations)

    expect(result).toEqual([mockedProjects[2]])
  })
})
