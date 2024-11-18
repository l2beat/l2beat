import { type Database } from '@l2beat/database'
import { type ActivityRepository } from '@l2beat/database/dist/activity/repository'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { getActivityChart } from './get-activity-chart'

describe.only(getActivityChart.name, () => {
  it('returns data for all projects', async () => {
    const startOfDay = UnixTime.now().toStartOf('day')
    const db = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo([
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay.add(-2, 'days'),
            count: 15,
          },
          {
            projectId: ProjectId('b'),
            timestamp: startOfDay.add(-2, 'days'),
            count: 20,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-2, 'days'),
            count: 100,
          },
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay.add(-1, 'days'),
            count: 20,
          },
          {
            projectId: ProjectId('b'),
            timestamp: startOfDay.add(-1, 'days'),
            count: 30,
          },
          {
            projectId: ProjectId('c'),
            timestamp: startOfDay.add(-1, 'days'),
            count: 50,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-1, 'days'),
            count: 1000,
          },
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay,
            count: 10,
          },
        ]),
      }),
    })
    const data = await getActivityChart(db, { type: 'all' }, '30d')
    expect(data.data).toEqual([
      [startOfDay.add(-2, 'days').toNumber(), 35, 100],
      [startOfDay.add(-1, 'days').toNumber(), 100, 1000],
    ])
  })

  it('starts aggregation from first non-ethereum project', async () => {
    const startOfDay = UnixTime.now().toStartOf('day')
    const db = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo([
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-4, 'days'),
            count: 100,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-3, 'days'),
            count: 100,
          },
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay.add(-2, 'days'),
            count: 15,
          },
          {
            projectId: ProjectId('b'),
            timestamp: startOfDay.add(-2, 'days'),
            count: 20,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-2, 'days'),
            count: 100,
          },
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay.add(-1, 'days'),
            count: 20,
          },
          {
            projectId: ProjectId('b'),
            timestamp: startOfDay.add(-1, 'days'),
            count: 30,
          },
          {
            projectId: ProjectId('c'),
            timestamp: startOfDay.add(-1, 'days'),
            count: 50,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-1, 'days'),
            count: 1000,
          },
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay,
            count: 10,
          },
        ]),
      }),
    })
    const data = await getActivityChart(db, { type: 'all' }, '30d')
    expect(data.data).toEqual([
      [startOfDay.add(-2, 'days').toNumber(), 35, 100],
      [startOfDay.add(-1, 'days').toNumber(), 100, 1000],
    ])
  })

  it('returns empty data when no non-ethereum projects exist', async () => {
    const startOfDay = UnixTime.now().toStartOf('day')
    const db = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo([
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-2, 'days'),
            count: 100,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-1, 'days'),
            count: 200,
          },
        ]),
      }),
    })
    const data = await getActivityChart(db, { type: 'all' }, '30d')
    expect(data.data).toEqual([])
  })

  it('handles single project filter correctly', async () => {
    const startOfDay = UnixTime.now().toStartOf('day')
    const db = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo([
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay.add(-2, 'days'),
            count: 15,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-2, 'days'),
            count: 100,
          },
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay.add(-1, 'days'),
            count: 20,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-1, 'days'),
            count: 200,
          },
        ]),
      }),
    })
    const data = await getActivityChart(
      db,
      { type: 'projects', projectIds: [ProjectId('a')] },
      '30d',
    )
    expect(data.data).toEqual([
      [startOfDay.add(-2, 'days').toNumber(), 15, 100],
      [startOfDay.add(-1, 'days').toNumber(), 20, 200],
    ])
  })

  it('handles gaps in data correctly', async () => {
    const startOfDay = UnixTime.now().toStartOf('day')
    const db = mockObject<Database>({
      activity: mockObject<ActivityRepository>({
        getByProjectsAndTimeRange: mockFn().resolvesTo([
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay.add(-3, 'days'),
            count: 10,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-3, 'days'),
            count: 100,
          },
          {
            projectId: ProjectId('a'),
            timestamp: startOfDay.add(-1, 'days'),
            count: 20,
          },
          {
            projectId: ProjectId.ETHEREUM,
            timestamp: startOfDay.add(-1, 'days'),
            count: 200,
          },
        ]),
      }),
    })
    const data = await getActivityChart(db, { type: 'all' }, '30d')
    expect(data.data).toEqual([
      [startOfDay.add(-3, 'days').toNumber(), 10, 100],
      [startOfDay.add(-2, 'days').toNumber(), 0, 0],
      [startOfDay.add(-1, 'days').toNumber(), 20, 200],
    ])
  })
})
