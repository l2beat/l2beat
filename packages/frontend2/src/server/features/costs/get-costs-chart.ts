import { type AggregatedL2CostRecord } from '@l2beat/database'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'
import { getRange } from '~/utils/range/range'
import { type CostsChartResponse } from './types'
import { addIfDefined } from './utils/add-if-defined'
import { getCostsProjects } from './utils/get-costs-projects'
import { type CostsTimeRange, rangeToResolution } from './utils/range'

export function getCostsChart(
  ...parameters: Parameters<typeof getCachedCostsChart>
) {
  noStore()
  return getCachedCostsChart(...parameters)
}

const getCachedCostsChart = cache(
  async (timeRange: CostsTimeRange): Promise<CostsChartResponse> => {
    const projects = getCostsProjects()
    const resolution = rangeToResolution(timeRange)

    const range = getRange(timeRange, resolution)

    console.time('[getCostsChart] getByProjectsAndTimeRange')
    const data = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
      projects.map((p) => p.id),
      range,
    )
    console.timeEnd('[getCostsChart] getByProjectsAndTimeRange')

    console.time('[getCostsChart] sumByTimestamp')
    const summed = sumByTimestamp(data, resolution)
    console.timeEnd('[getCostsChart] sumByTimestamp')

    return withTypes(summed)
  },
  ['costsChart'],
  { revalidate: 60 * 10 },
)

function withTypes(data: CostsChartResponse['data']): CostsChartResponse {
  return {
    types: [
      'timestamp',
      'overheadGas',
      'overheadEth',
      'overheadUsd',
      'calldataGas',
      'calldataEth',
      'calldataUsd',
      'computeGas',
      'computeEth',
      'computeUsd',
      'blobsGas',
      'blobsEth',
      'blobsUsd',
    ],
    data,
  }
}

function sumByTimestamp(
  records: AggregatedL2CostRecord[],
  resolution: 'daily' | 'hourly',
): CostsChartResponse['data'] {
  const result = new Map<
    number,
    {
      blobsGas: number | undefined
      blobsGasEth: number | undefined
      blobsGasUsd: number | undefined
      calldataGas: number
      calldataGasEth: number
      calldataGasUsd: number
      computeGas: number
      computeGasEth: number
      computeGasUsd: number
      overheadGas: number
      overheadGasEth: number
      overheadGasUsd: number
    }
  >()

  for (const record of records) {
    const timestamp = record.timestamp
      .toStartOf(resolution === 'daily' ? 'day' : 'hour')
      .toNumber()
    const existing = result.get(timestamp)
    if (existing) {
      result.set(timestamp, {
        overheadGas: existing.overheadGas + record.overheadGas,
        overheadGasEth: existing.overheadGasEth + record.overheadGasEth,
        overheadGasUsd: existing.overheadGasUsd + record.overheadGasUsd,
        calldataGas: existing.calldataGas + record.calldataGas,
        calldataGasEth: existing.calldataGasEth + record.calldataGasEth,
        calldataGasUsd: existing.calldataGasUsd + record.calldataGasUsd,
        computeGas: existing.computeGas + record.computeGas,
        computeGasEth: existing.computeGasEth + record.computeGasEth,
        computeGasUsd: existing.computeGasUsd + record.computeGasUsd,
        blobsGas: addIfDefined(existing.blobsGas, record.blobsGas),
        blobsGasEth: addIfDefined(existing.blobsGasEth, record.blobsGasEth),
        blobsGasUsd: addIfDefined(existing.blobsGasUsd, record.blobsGasUsd),
      })
      continue
    }

    result.set(timestamp, {
      overheadGas: record.overheadGas,
      overheadGasEth: record.overheadGasEth,
      overheadGasUsd: record.overheadGasUsd,
      calldataGas: record.calldataGas,
      calldataGasEth: record.calldataGasEth,
      calldataGasUsd: record.calldataGasUsd,
      computeGas: record.computeGas,
      computeGasEth: record.computeGasEth,
      computeGasUsd: record.computeGasUsd,
      blobsGas: record.blobsGas ?? undefined,
      blobsGasEth: record.blobsGasEth ?? undefined,
      blobsGasUsd: record.blobsGasUsd ?? undefined,
    })
  }

  return Array.from(result.entries()).map(([timestamp, record]) => [
    timestamp,
    record.overheadGas,
    record.overheadGasEth,
    record.overheadGasUsd,
    record.calldataGas,
    record.calldataGasEth,
    record.calldataGasUsd,
    record.computeGas,
    record.computeGasEth,
    record.computeGasUsd,
    record.blobsGas,
    record.blobsGasEth,
    record.blobsGasUsd,
  ])
}
