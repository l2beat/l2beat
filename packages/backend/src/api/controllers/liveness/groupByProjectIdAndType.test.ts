import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessRecordWithProjectIdAndType } from '../../../peripherals/database/LivenessRepository'
import { groupByProjectIdAndType } from './groupByProjectIdAndType'

describe(groupByProjectIdAndType.name, () => {
  it('should group data correctly and sort records', () => {
    const result = groupByProjectIdAndType(MOCK_DATA)
    const expected = {
      project1: {
        batchSubmissions: {
          records: [
            // should be sorted by timestamp descending
            {
              timestamp: NOW.add(-1, 'hours'),
              type: LivenessType('DA'),
            },
            {
              timestamp: NOW.add(-2, 'hours'),
              type: LivenessType('DA'),
            },
            {
              timestamp: NOW.add(-3, 'hours'),
              type: LivenessType('DA'),
            },
          ],
        },
        stateUpdates: {
          records: [
            {
              timestamp: NOW.add(-1, 'hours'),
              type: LivenessType('STATE'),
            },
          ],
        },
      },
      project2: {
        batchSubmissions: {
          records: [
            {
              timestamp: NOW.add(-3, 'hours'),
              type: LivenessType('DA'),
            },
          ],
        },
        stateUpdates: {
          records: [
            {
              timestamp: NOW.add(-4, 'hours'),
              type: LivenessType('STATE'),
            },
          ],
        },
      },
    }

    expect(result).toEqual(expected)
  })
})

const NOW = UnixTime.now()

const MOCK_DATA: LivenessRecordWithProjectIdAndType[] = [
  {
    projectId: ProjectId('project1'),
    timestamp: NOW.add(-3, 'hours'),
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    timestamp: NOW.add(-2, 'hours'),
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    timestamp: NOW.add(-1, 'hours'),
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    timestamp: NOW.add(-1, 'hours'),
    type: LivenessType('STATE'),
  },
  {
    projectId: ProjectId('project2'),
    timestamp: NOW.add(-3, 'hours'),
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project2'),
    timestamp: NOW.add(-4, 'hours'),
    type: LivenessType('STATE'),
  },
]
