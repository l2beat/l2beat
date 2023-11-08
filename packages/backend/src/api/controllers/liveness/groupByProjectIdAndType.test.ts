import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
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
              blockNumber: 1,
              timestamp: NOW.add(-1, 'hours'),
              txHash: '0x1234567890abcdef',
              type: LivenessType('DA'),
            },
            {
              blockNumber: 1,
              timestamp: NOW.add(-2, 'hours'),
              txHash: '0x1234567890abcdef',
              type: LivenessType('DA'),
            },
            {
              blockNumber: 1,
              timestamp: NOW.add(-3, 'hours'),
              txHash: '0x1234567890abcdef',
              type: LivenessType('DA'),
            },
          ],
        },
        stateUpdates: {
          records: [
            {
              blockNumber: 1,
              timestamp: NOW.add(-1, 'hours'),
              txHash: '0x1234567890abcdef',
              type: LivenessType('STATE'),
            },
          ],
        },
      },
      project2: {
        batchSubmissions: {
          records: [
            {
              blockNumber: 1,
              timestamp: NOW.add(-3, 'hours'),
              txHash: '0x1234567890abcdef',
              type: LivenessType('DA'),
            },
          ],
        },
        stateUpdates: {
          records: [
            {
              blockNumber: 1,
              timestamp: NOW.add(-4, 'hours'),
              txHash: '0x1234567890abcdef',
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

const MOCK_DATA: LivenessRecord[] = [
  {
    projectId: ProjectId('project1'),
    blockNumber: 1,
    timestamp: NOW.add(-3, 'hours'),
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    blockNumber: 1,
    timestamp: NOW.add(-2, 'hours'),
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    blockNumber: 1,
    timestamp: NOW.add(-1, 'hours'),
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project1'),
    blockNumber: 1,
    timestamp: NOW.add(-1, 'hours'),
    txHash: '0x1234567890abcdef',
    type: LivenessType('STATE'),
  },
  {
    projectId: ProjectId('project2'),
    blockNumber: 1,
    timestamp: NOW.add(-3, 'hours'),
    txHash: '0x1234567890abcdef',
    type: LivenessType('DA'),
  },
  {
    projectId: ProjectId('project2'),
    blockNumber: 1,
    timestamp: NOW.add(-4, 'hours'),
    txHash: '0x1234567890abcdef',
    type: LivenessType('STATE'),
  },
]
