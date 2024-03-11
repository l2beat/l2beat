import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessRecordWithProjectIdAndSubtype } from '../repositories/LivenessRepository'
import { groupByType } from './groupByType'

describe(groupByType.name, () => {
  it('group by type', () => {
    const result = groupByType(MOCK_DATA)

    expect(result.batchSubmissions.records).toEqual([
      MOCK_DATA[0],
      MOCK_DATA[2],
      MOCK_DATA[3],
      MOCK_DATA[4],
    ])
    expect(result.stateUpdates.records).toEqual([MOCK_DATA[1], MOCK_DATA[6]])
    expect(result.proofSubmissions.records).toEqual([
      MOCK_DATA[5],
      MOCK_DATA[7],
    ])
  })
})

const NOW = UnixTime.now()
const MOCK_DATA: LivenessRecordWithProjectIdAndSubtype[] = [
  {
    projectId: ProjectId('project1'),
    timestamp: NOW.add(-1, 'hours'),
    subtype: 'batchSubmissions',
  },
  {
    projectId: ProjectId('project1'),
    timestamp: NOW.add(-1, 'hours'),
    subtype: 'stateUpdates',
  },
  {
    projectId: ProjectId('project1'),
    timestamp: NOW.add(-2, 'hours'),
    subtype: 'batchSubmissions',
  },
  {
    projectId: ProjectId('project2'),
    timestamp: NOW.add(-3, 'hours'),
    subtype: 'batchSubmissions',
  },
  {
    projectId: ProjectId('project1'),
    timestamp: NOW.add(-3, 'hours'),
    subtype: 'batchSubmissions',
  },
  {
    projectId: ProjectId('project2'),
    timestamp: NOW.add(-3, 'hours'),
    subtype: 'proofSubmissions',
  },
  {
    projectId: ProjectId('project2'),
    timestamp: NOW.add(-4, 'hours'),
    subtype: 'stateUpdates',
  },
  {
    projectId: ProjectId('project2'),
    timestamp: NOW.add(-4, 'hours'),
    subtype: 'proofSubmissions',
  },
]
