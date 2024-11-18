import { type ActivityRecord, type Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { type ActivityRepository } from '@l2beat/database/dist/activity/repository'
import { getActivityChart } from './get-activity-chart'

describe(getActivityChart.name, () => {
  const NOW = UnixTime.now()

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
    expect(result.syncStatus.isSynced).toEqual(true)
  })

  it('aggregates data correctly for multiple projects', async () => {
    const mockRecords = [
      record(NOW, ProjectId('arbitrum'), 100),
      record(NOW, ProjectId('optimism'), 50),
      record(NOW, ProjectId.ETHEREUM, 1000),
      record(NOW.add(1, 'days'), ProjectId('arbitrum'), 200),
      record(NOW.add(1, 'days'), ProjectId.ETHEREUM, 2000),
    ]

    const mockDb = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo(mockRecords),
      }),
    })

    const result = await getActivityChart(mockDb, { type: 'all' }, '30d')

    expect(result.data).toHaveLength(2)
    expect(result.data[0]).toEqual([+NOW, 150, 1000]) // Combined L2 count, ETH count
    expect(result.data[1]).toEqual([+NOW.add(1, 'days'), 200, 2000])
  })

  it('handles single project filter correctly', async () => {
    const mockRecords = [
      record(NOW, ProjectId('arbitrum'), 100),
      record(NOW, ProjectId.ETHEREUM, 1000),
      record(NOW.add(1, 'days'), ProjectId('arbitrum'), 200),
      record(NOW.add(1, 'days'), ProjectId.ETHEREUM, 2000),
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
    expect(result.data[0]).toEqual([+NOW, 100, 1000])
    expect(result.data[1]).toEqual([+NOW.add(1, 'days'), 200, 2000])
  })

  it('fills missing data points with zeros', async () => {
    const mockRecords = [
      record(NOW, ProjectId('arbitrum'), 100),
      record(NOW, ProjectId.ETHEREUM, 1000),
      // Gap in data
      record(NOW.add(2, 'days'), ProjectId('arbitrum'), 200),
      record(NOW.add(2, 'days'), ProjectId.ETHEREUM, 2000),
    ]

    const mockDb = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo(mockRecords),
      }),
    })

    const result = await getActivityChart(mockDb, { type: 'all' }, '30d')

    expect(result.data).toHaveLength(3)
    expect(result.data[0]).toEqual([+NOW, 100, 1000])
    expect(result.data[1]).toEqual([+NOW.add(1, 'days'), 0, 0])
    expect(result.data[2]).toEqual([+NOW.add(2, 'days'), 200, 2000])
  })
})
