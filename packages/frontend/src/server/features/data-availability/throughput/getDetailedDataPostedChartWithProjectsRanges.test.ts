import type { DataAvailabilityRecord, Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getDataPostedChartData } from './getDetailedDataPostedChartWithProjectsRanges'

const DAY = UnixTime.DAY
const HOUR = UnixTime.HOUR
// 2023-11-15T00:00:00Z, aligned to a full day
const T = UnixTime(1700006400)

const ARBITRUM = ProjectId('arbitrum')
const BASE = ProjectId('base')

describe(getDataPostedChartData.name, () => {
  it('sums hourly records across DA layers into one daily series per project', async () => {
    const repository = repositoryMock(
      [
        record(ARBITRUM, 'ethereum', T, 100n),
        record(ARBITRUM, 'ethereum', T + 2 * HOUR, 50n),
        record(ARBITRUM, 'eigenda', T + 3 * HOUR, 25n),
        record(ARBITRUM, 'ethereum', T + DAY, 200n),
        record(BASE, 'celestia', T, 10n),
        record(BASE, 'celestia', T + DAY, 20n),
      ],
      { [ARBITRUM]: T, [BASE]: T },
    )

    const result = await getDataPostedChartData(
      repository,
      [ARBITRUM, BASE],
      [T, T + 2 * DAY],
    )

    expect(result).toEqual({
      chart: [
        [T, { [ARBITRUM]: 175, [BASE]: 10 }],
        [T + DAY, { [ARBITRUM]: 200, [BASE]: 20 }],
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
        record(ARBITRUM, 'ethereum', T, 100n),
        record(ARBITRUM, 'ethereum', T + 2 * DAY, 300n),
        record(BASE, 'celestia', T + DAY, 10n),
        record(BASE, 'celestia', T + 2 * DAY, 20n),
      ],
      { [ARBITRUM]: T, [BASE]: T + DAY },
    )

    const result = await getDataPostedChartData(
      repository,
      [ARBITRUM, BASE],
      [T, T + 3 * DAY],
    )

    expect(result.chart).toEqual([
      [T, { [ARBITRUM]: 100, [BASE]: null }],
      [T + DAY, { [ARBITRUM]: 0, [BASE]: 10 }],
      [T + 2 * DAY, { [ARBITRUM]: 300, [BASE]: 20 }],
    ])
  })

  it('returns a null series and no range entry for a project without data', async () => {
    const noDaTracking = ProjectId('no-da-tracking')
    const repository = repositoryMock([record(ARBITRUM, 'ethereum', T, 100n)], {
      [ARBITRUM]: T,
    })

    const result = await getDataPostedChartData(
      repository,
      [ARBITRUM, noDaTracking],
      [T, T + DAY],
    )

    expect(result.chart).toEqual([
      [T, { [ARBITRUM]: 100, [noDaTracking]: null }],
    ])
    expect(result.projects).toEqual([
      { projectId: ARBITRUM, sinceTimestamp: T },
    ])
  })

  it('cuts a series to null after its last non-zero day', async () => {
    const repository = repositoryMock(
      [
        record(ARBITRUM, 'ethereum', T, 100n),
        record(ARBITRUM, 'ethereum', T + DAY, 200n),
        record(BASE, 'celestia', T, 10n),
        record(BASE, 'celestia', T + 2 * DAY, 20n),
      ],
      { [ARBITRUM]: T, [BASE]: T },
    )

    const result = await getDataPostedChartData(
      repository,
      [ARBITRUM, BASE],
      [T, T + 3 * DAY],
    )

    expect(result.chart).toEqual([
      [T, { [ARBITRUM]: 100, [BASE]: 10 }],
      [T + DAY, { [ARBITRUM]: 200, [BASE]: 0 }],
      [T + 2 * DAY, { [ARBITRUM]: null, [BASE]: 20 }],
    ])
  })

  it('starts the max range at the first project data point', async () => {
    const repository = repositoryMock(
      [
        record(ARBITRUM, 'ethereum', T + DAY, 100n),
        record(ARBITRUM, 'ethereum', T + 2 * DAY, 200n),
      ],
      { [ARBITRUM]: T + DAY },
    )

    const result = await getDataPostedChartData(
      repository,
      [ARBITRUM],
      [null, T + 3 * DAY],
    )

    expect(result.chart).toEqual([
      [T + DAY, { [ARBITRUM]: 100 }],
      [T + 2 * DAY, { [ARBITRUM]: 200 }],
    ])
  })

  it('returns an empty chart when there are no records', async () => {
    const repository = repositoryMock([], {})

    const result = await getDataPostedChartData(
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
  records: DataAvailabilityRecord[],
  firstTimestamps: Record<string, UnixTime>,
): Database['dataAvailability'] {
  return mockObject<Database['dataAvailability']>({
    getByProjectIdsAndTimeRange: async () => records,
    getFirstTimestampsByProjectIds: async () => firstTimestamps,
  })
}

function record(
  projectId: ProjectId,
  daLayer: string,
  timestamp: UnixTime,
  totalSize: bigint,
): DataAvailabilityRecord {
  return {
    projectId,
    daLayer,
    configurationId: `${projectId}-${daLayer}`,
    timestamp,
    totalSize,
  }
}
