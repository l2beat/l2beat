import type { AggregatedL2CostRecord, Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getCostsChartData } from './getDetailedCostsChartWithProjectsRanges'

const DAY = UnixTime.DAY
const HOUR = UnixTime.HOUR
// 2023-11-15T00:00:00Z, aligned to a full day
const T = UnixTime(1700006400)

const ARBITRUM = ProjectId('arbitrum')
const BASE = ProjectId('base')

describe(getCostsChartData.name, () => {
  it('returns one gas/eth/usd series per project', async () => {
    const repository = repositoryMock([
      record(ARBITRUM, T, 100, 1, 1000),
      record(ARBITRUM, T + DAY, 200, 2, 2000),
      record(BASE, T, 10, 0.1, 100),
      record(BASE, T + DAY, 20, 0.2, 200),
    ])

    const result = await getCostsChartData(
      repository,
      [
        { projectId: ARBITRUM, sinceTimestamp: T },
        { projectId: BASE, sinceTimestamp: T },
      ],
      [T, T + DAY],
    )

    expect(result).toEqual({
      chart: [
        [T, { [ARBITRUM]: [100, 1, 1000], [BASE]: [10, 0.1, 100] }],
        [T + DAY, { [ARBITRUM]: [200, 2, 2000], [BASE]: [20, 0.2, 200] }],
      ],
      projects: [
        { projectId: ARBITRUM, sinceTimestamp: T },
        { projectId: BASE, sinceTimestamp: T },
      ],
      syncedUntil: T + DAY,
    })
  })

  it('sums sub-resolution records into one bucket', async () => {
    const repository = repositoryMock([
      record(ARBITRUM, T + HOUR, 100, 1, 1000),
      record(ARBITRUM, T + 2 * HOUR, 50, 0.5, 500),
    ])

    const result = await getCostsChartData(
      repository,
      [{ projectId: ARBITRUM, sinceTimestamp: T }],
      [T, T + DAY],
    )

    expect(result.chart).toEqual([[T, { [ARBITRUM]: [150, 1.5, 1500] }]])
  })

  it('fills zeros after tracking start and nulls before', async () => {
    const repository = repositoryMock([
      record(ARBITRUM, T, 100, 1, 1000),
      record(ARBITRUM, T + 2 * DAY, 300, 3, 3000),
      record(BASE, T + 2 * DAY, 20, 0.2, 200),
    ])

    const result = await getCostsChartData(
      repository,
      [
        { projectId: ARBITRUM, sinceTimestamp: T },
        { projectId: BASE, sinceTimestamp: T + DAY },
      ],
      [T, T + 2 * DAY],
    )

    expect(result.chart).toEqual([
      [T, { [ARBITRUM]: [100, 1, 1000], [BASE]: null }],
      [T + DAY, { [ARBITRUM]: [0, 0, 0], [BASE]: [0, 0, 0] }],
      [T + 2 * DAY, { [ARBITRUM]: [300, 3, 3000], [BASE]: [20, 0.2, 200] }],
    ])
  })

  it('rounds sinceTimestamp to the resolution for the gate and the returned ranges', async () => {
    const repository = repositoryMock([record(ARBITRUM, T + DAY, 100, 1, 1000)])

    const result = await getCostsChartData(
      repository,
      [{ projectId: ARBITRUM, sinceTimestamp: T + 3 * HOUR }],
      [T, T + DAY],
    )

    expect(result.projects).toEqual([
      { projectId: ARBITRUM, sinceTimestamp: T },
    ])
    expect(result.chart).toEqual([
      [T, { [ARBITRUM]: [0, 0, 0] }],
      [T + DAY, { [ARBITRUM]: [100, 1, 1000] }],
    ])
  })

  it('nulls the unsynced tail past the last record', async () => {
    const repository = repositoryMock([record(ARBITRUM, T, 100, 1, 1000)])

    const result = await getCostsChartData(
      repository,
      [{ projectId: ARBITRUM, sinceTimestamp: T }],
      [T, T + 2 * DAY],
    )

    expect(result.chart).toEqual([
      [T, { [ARBITRUM]: [100, 1, 1000] }],
      [T + DAY, { [ARBITRUM]: null }],
    ])
    expect(result.syncedUntil).toEqual(T)
  })

  it('returns an empty chart when there are no records', async () => {
    const repository = repositoryMock([])

    const result = await getCostsChartData(
      repository,
      [{ projectId: ARBITRUM, sinceTimestamp: T }],
      [T, T + DAY],
    )

    expect(result).toEqual({
      chart: [],
      projects: [{ projectId: ARBITRUM, sinceTimestamp: T }],
      syncedUntil: 0,
    })
  })
})

function repositoryMock(
  records: AggregatedL2CostRecord[],
): Database['aggregatedL2Cost'] {
  return mockObject<Database['aggregatedL2Cost']>({
    getByProjectsAndTimeRange: async () => records,
  })
}

function record(
  projectId: ProjectId,
  timestamp: UnixTime,
  gas: number,
  eth: number,
  usd: number,
): AggregatedL2CostRecord {
  return {
    projectId,
    timestamp,
    totalGas: gas,
    totalGasEth: eth,
    totalGasUsd: usd,
    overheadGas: gas,
    overheadGasEth: eth,
    overheadGasUsd: usd,
    calldataGas: 0,
    calldataGasEth: 0,
    calldataGasUsd: 0,
    computeGas: 0,
    computeGasEth: 0,
    computeGasUsd: 0,
    blobsGas: null,
    blobsGasEth: null,
    blobsGasUsd: null,
  }
}
