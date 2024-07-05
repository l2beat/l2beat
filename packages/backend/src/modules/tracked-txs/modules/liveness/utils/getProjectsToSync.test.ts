import { TrackedTxConfigEntry, createTrackedTxId } from '@l2beat/shared'
import { expect, mockObject } from 'earl'
import { Project } from '../../../../../model/Project'
import { getProjectsToSync } from './getProjectsToSync'
import { UnixTime } from '@l2beat/shared-pure'
import { SavedConfiguration } from '../../../../../tools/uif/multi/types'

describe(getProjectsToSync.name, () => {
  it('should filter projects', () => {
    const mockConfigurationId = createTrackedTxId.random()

    const mockedProjects = [
      mockObject<Project>({
        isArchived: true,
      }),
      mockObject<Project>({
        isArchived: false,
        trackedTxsConfig: undefined,
      }),
      mockObject<Project>({
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
