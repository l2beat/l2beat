import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { filterOutDelayedProjects } from './filterOutDelayedProjects'
import { DailyTransactionCountProjectsMap } from './types'

const NOW = UnixTime.now()
const projectsMap: DailyTransactionCountProjectsMap = new Map()

describe(filterOutDelayedProjects.name, () => {
  projectsMap.set(ProjectId('project-1'), [
    {
      count: 2,
      timestamp: NOW,
    },
    {
      count: 2,
      timestamp: NOW.add(-1, 'hours'),
    },
  ])
  projectsMap.set(ProjectId('project-2'), [
    {
      count: 2,
      timestamp: NOW.add(-3, 'days'),
    },
  ])

  it('filters out delayed projects', () => {
    const expectedMap: DailyTransactionCountProjectsMap = new Map()
    expectedMap.set(ProjectId('project-1'), [
      {
        count: 2,
        timestamp: NOW,
      },
      {
        count: 2,
        timestamp: NOW.add(-1, 'hours'),
      },
    ])
    const result = filterOutDelayedProjects(projectsMap)
    expect(result).toEqual(expectedMap)
  })
})
