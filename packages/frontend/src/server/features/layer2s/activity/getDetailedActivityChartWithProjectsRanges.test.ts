import type { ActivityRecord, Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getActivityChartData } from './getDetailedActivityChartWithProjectsRanges'

const DAY = UnixTime.DAY
// 2023-11-15T00:00:00Z, aligned to a full day
const T = UnixTime(1700006400)

const ARBITRUM = ProjectId('arbitrum')
const BASE = ProjectId('base')

describe(getActivityChartData.name, () => {
  it('returns one series per project with uops falling back to count', async () => {
    const repository = repositoryMock(
      [
        record(ARBITRUM, T, 100, 150),
        record(ARBITRUM, T + DAY, 200, null),
        record(BASE, T, 10, 15),
        record(BASE, T + DAY, 20, 25),
      ],
      { [ARBITRUM]: T, [BASE]: T },
    )

    const result = await getActivityChartData(
      repository,
      [ARBITRUM, BASE],
      [T, T + DAY],
    )

    expect(result).toEqual({
      chart: [
        [T, { [ARBITRUM]: [100, 150], [BASE]: [10, 15] }],
        [T + DAY, { [ARBITRUM]: [200, 200], [BASE]: [20, 25] }],
      ],
      projects: [
        { projectId: ARBITRUM, sinceTimestamp: T },
        { projectId: BASE, sinceTimestamp: T },
      ],
      syncedUntil: T + DAY,
    })
  })

  it('fills zeros for missing days after launch and nulls before launch', async () => {
    const repository = repositoryMock(
      [
        record(ARBITRUM, T, 100, 150),
        record(ARBITRUM, T + 2 * DAY, 300, 350),
        record(BASE, T + DAY, 10, 15),
        record(BASE, T + 2 * DAY, 20, 25),
      ],
      { [ARBITRUM]: T, [BASE]: T + DAY },
    )

    const result = await getActivityChartData(
      repository,
      [ARBITRUM, BASE],
      [T, T + 2 * DAY],
    )

    expect(result.chart).toEqual([
      [T, { [ARBITRUM]: [100, 150], [BASE]: null }],
      [T + DAY, { [ARBITRUM]: [0, 0], [BASE]: [10, 15] }],
      [T + 2 * DAY, { [ARBITRUM]: [300, 350], [BASE]: [20, 25] }],
    ])
  })

  it('returns a null series and no range entry for a project without data', async () => {
    const noActivity = ProjectId('no-activity')
    const repository = repositoryMock([record(ARBITRUM, T, 100, 150)], {
      [ARBITRUM]: T,
    })

    const result = await getActivityChartData(
      repository,
      [ARBITRUM, noActivity],
      [T, T],
    )

    expect(result.chart).toEqual([
      [T, { [ARBITRUM]: [100, 150], [noActivity]: null }],
    ])
    expect(result.projects).toEqual([
      { projectId: ARBITRUM, sinceTimestamp: T },
    ])
  })

  it('starts the max range at the first project data point', async () => {
    const repository = repositoryMock(
      [
        record(ARBITRUM, T + DAY, 100, 150),
        record(ARBITRUM, T + 2 * DAY, 200, 250),
      ],
      { [ARBITRUM]: T + DAY },
    )

    const result = await getActivityChartData(
      repository,
      [ARBITRUM],
      [null, T + 2 * DAY],
    )

    expect(result.chart).toEqual([
      [T + DAY, { [ARBITRUM]: [100, 150] }],
      [T + 2 * DAY, { [ARBITRUM]: [200, 250] }],
    ])
  })

  it('returns an empty chart when there are no records', async () => {
    const repository = repositoryMock([], {})

    const result = await getActivityChartData(
      repository,
      [ARBITRUM],
      [T, T + DAY],
    )

    expect(result).toEqual({
      chart: [],
      projects: [],
      syncedUntil: T + DAY,
    })
  })
})

function repositoryMock(
  records: ActivityRecord[],
  sinceTimestamps: Record<string, UnixTime>,
): Database['activity'] {
  return mockObject<Database['activity']>({
    getByProjectsAndTimeRange: async () => records,
    getActivityTotalsForProjects: async () =>
      Object.fromEntries(
        Object.entries(sinceTimestamps).map(([projectId, sinceTimestamp]) => [
          projectId,
          {
            count: 0,
            uopsCount: 0,
            sinceTimestamp,
            uopsSinceTimestamp: sinceTimestamp,
          },
        ]),
      ),
  })
}

function record(
  projectId: ProjectId,
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
): ActivityRecord {
  return { projectId, timestamp, count, uopsCount, start: 0, end: 0 }
}
