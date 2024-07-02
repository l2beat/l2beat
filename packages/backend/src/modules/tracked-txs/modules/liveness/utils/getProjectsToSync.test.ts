import {
  TrackedTxConfigEntry,
  TrackedTxUseWithId,
  TrackedTxsConfig,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Project } from '../../../../../model/Project'
import { getProjectsToSync } from './getProjectsToSync'

describe(getProjectsToSync.name, () => {
  it('should filter projects', () => {
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
        trackedTxsConfig: mockObject<TrackedTxsConfig>({
          entries: [
            mockObject<TrackedTxConfigEntry>({
              uses: [
                mockObject<TrackedTxUseWithId>({
                  type: 'liveness',
                  subtype: 'batchSubmissions',
                }),
              ],
              untilTimestampExclusive: UnixTime.now(),
            }),
          ],
        }),
      }),
    ]

    const result = getProjectsToSync(mockedProjects)

    expect(result).toEqual([mockedProjects[2]])
  })
})
