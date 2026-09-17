import {
  createTrackedTxId,
  type TrackedTxConfigEntry,
  type TrackedTxLivenessConfig,
} from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import type { TrackedTxProject } from '../../../../../config/Config'
import type { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import { getActiveConfigurations } from './getActiveConfigurations'

describe(getActiveConfigurations.name, () => {
  it('should get active configurations', () => {
    const mockConfigurationId = createTrackedTxId.random()

    const mockedProject: TrackedTxProject = {
      id: ProjectId('foo'),
      isArchived: false,
      configurations: [
        {
          id: mockConfigurationId,
          type: 'liveness',
          subtype: 'batchSubmissions',
          untilTimestamp: UnixTime.now(),
        } as unknown as TrackedTxConfigEntry,
      ],
    }

    const mockConfigurations = [
      {
        id: mockConfigurationId,
        maxHeight: null,
        currentHeight: 1,
      } as unknown as Omit<
        SavedConfiguration<TrackedTxConfigEntry>,
        'properties'
      >,
    ]

    const result = getActiveConfigurations(mockedProject, mockConfigurations)
    expect(result).toStrictEqual(
      mockedProject.configurations as TrackedTxLivenessConfig[],
    )
  })
})
