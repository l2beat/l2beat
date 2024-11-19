import { type ActivityRecord, type Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { type ActivityRepository } from '@l2beat/database/dist/activity/repository'
import { getActivityChart } from './get-activity-chart'

describe.only(getActivityChart.name, () => {
  const START_OF_TODAY = UnixTime.now().toStartOf('day')

  const record = (
    timestamp: UnixTime,
    projectId: ProjectId,
    count: number,
  ): ActivityRecord => ({
    timestamp,
    projectId,
    count,
    uopsCount: 0,
    start: 0,
    end: 0,
  })

  it('returns empty data when no records exist', async () => {
    const mockDb = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo([]),
      }),
    })
    const result = await getActivityChart(mockDb, { type: 'all' }, '30d')

    expect(result.data).toEqual([])
  })

  it('aggregates data correctly for multiple projects', async () => {
    const mockRecords = [
      record(START_OF_TODAY.add(-2, 'days'), ProjectId('arbitrum'), 200),
      record(START_OF_TODAY.add(-2, 'days'), ProjectId.ETHEREUM, 2000),
      record(START_OF_TODAY.add(-1, 'days'), ProjectId('arbitrum'), 100),
      record(START_OF_TODAY.add(-1, 'days'), ProjectId('optimism'), 50),
      record(START_OF_TODAY.add(-1, 'days'), ProjectId.ETHEREUM, 1000),
    ]

    const mockDb = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo(mockRecords),
      }),
    })

    const result = await getActivityChart(mockDb, { type: 'all' }, '30d')

    expect(result.syncStatus.isSynced).toEqual(true)
    expect(result.syncStatus.syncedUntil).toEqual(
      START_OF_TODAY.add(-1, 'seconds').toNumber(),
    )
    expect(result.data).toHaveLength(2)
    expect(result.data).toEqual([
      [+START_OF_TODAY.add(-2, 'days'), 200, 2000],
      [+START_OF_TODAY.add(-1, 'days'), 150, 1000],
    ])
  })

  it('handles single project filter correctly', async () => {
    const mockRecords = [
      record(START_OF_TODAY.add(-5, 'days'), ProjectId('arbitrum'), 200),
      record(START_OF_TODAY.add(-5, 'days'), ProjectId.ETHEREUM, 2000),
      record(START_OF_TODAY.add(-4, 'days'), ProjectId('arbitrum'), 100),
      record(START_OF_TODAY.add(-4, 'days'), ProjectId.ETHEREUM, 1000),
    ]

    const mockDb = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo(mockRecords),
      }),
    })

    const result = await getActivityChart(
      mockDb,
      { type: 'projects', projectIds: [ProjectId('arbitrum')] },
      '30d',
    )

    expect(result.data).toHaveLength(2)
    expect(result.data).toEqual([
      [+START_OF_TODAY.add(-5, 'days'), 200, 2000],
      [+START_OF_TODAY.add(-4, 'days'), 100, 1000],
    ])
    expect(result.syncStatus.isSynced).toEqual(false)
    expect(result.syncStatus.syncedUntil).toEqual(
      START_OF_TODAY.add(-4, 'days').toNumber(),
    )
  })

  it('fills missing data points with zeros', async () => {
    const mockRecords = [
      record(START_OF_TODAY.add(-3, 'days'), ProjectId('arbitrum'), 200),
      record(START_OF_TODAY.add(-3, 'days'), ProjectId.ETHEREUM, 2000),
      // Gap in data
      record(START_OF_TODAY.add(-1, 'days'), ProjectId('arbitrum'), 100),
      record(START_OF_TODAY.add(-1, 'days'), ProjectId.ETHEREUM, 1000),
    ]

    const mockDb = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo(mockRecords),
      }),
    })

    const result = await getActivityChart(mockDb, { type: 'all' }, '30d')

    expect(result.data).toHaveLength(3)
    expect(result.data).toEqual([
      [+START_OF_TODAY.add(-3, 'days'), 200, 2000],
      [+START_OF_TODAY.add(-2, 'days'), 0, 0],
      [+START_OF_TODAY.add(-1, 'days'), 100, 1000],
    ])
  })
})
