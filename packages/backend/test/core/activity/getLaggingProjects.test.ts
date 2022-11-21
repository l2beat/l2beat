import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getLaggingProjects } from '../../../src/core/activity/getLaggingProjects'
import { DailyTransactionCount } from '../../../src/core/transaction-count/TransactionCounter'

describe(getLaggingProjects.name, () => {
  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')
  const TODAY = UnixTime.now().toStartOf('day')
  const YESTERDAY = TODAY.add(-1, 'hours')

  it('checks if sync correct', async () => {
    const counts = new Map<ProjectId, DailyTransactionCount[]>()
    counts.set(PROJECT_A, [
      {
        timestamp: YESTERDAY,
        count: 69,
      },
    ])
    counts.set(PROJECT_B, [
      {
        timestamp: YESTERDAY,
        count: 420,
      },
    ])

    expect(getLaggingProjects(counts, YESTERDAY)).toEqual([])
  })

  it('fails if sync incorrect', async () => {
    const counts = new Map<ProjectId, DailyTransactionCount[]>()
    counts.set(PROJECT_A, [
      {
        timestamp: YESTERDAY,
        count: 69,
      },
    ])
    counts.set(PROJECT_B, [
      {
        timestamp: YESTERDAY.add(-1, 'days'),
        count: 420,
      },
    ])

    expect(getLaggingProjects(counts, YESTERDAY)).toEqual([
      { projectId: PROJECT_B, tip: YESTERDAY.add(-1, 'days') },
    ])
  })
})
