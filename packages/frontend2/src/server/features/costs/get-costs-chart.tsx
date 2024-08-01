import { layer2s } from '@l2beat/config'
import { type AggregatedL2CostRecord } from '@l2beat/database'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { db } from '~/server/database'

import {
  type CostsTimeRange,
  rangeToDays,
  rangeToResolution,
} from './utils/range'
import { toTrackedTxConfig } from './utils/to-tracked-tx-config'

export interface CostsChartResponse {
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
  ]
  data: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number | null,
    number | null,
    number | null,
  ][]
}

export const SHARP_SUBMISSION_ADDRESS = EthereumAddress(
  '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
)
export const SHARP_SUBMISSION_SELECTOR = '0x9b3b76cc'

export async function getCostsChart(
  timeRange: CostsTimeRange,
): Promise<CostsChartResponse> {
  const resolution = rangeToResolution(timeRange)
  const configurations = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )
  const activeProjects = layer2s.filter((p) => !p.isArchived)
  const data: AggregatedL2CostRecord[] = []
  for (const project of activeProjects) {
    const trackedTxConfig = toTrackedTxConfig(
      project.id,
      project.config.trackedTxs,
    )
    if (trackedTxConfig === undefined) continue

    const projectRuntimeConfigIds = trackedTxConfig
      .filter((c) => c.type === 'l2costs')
      .map((c) => c.id)

    const projectConfigs = configurations.filter((c) =>
      projectRuntimeConfigIds.includes(c.id),
    )

    if (projectConfigs.length === 0) continue

    // TODO: Add later
    // const syncedUntil = getSyncedUntil(projectConfigs)
    // if (!syncedUntil) {
    //   continue
    // }
    const days = rangeToDays(timeRange)

    const nowToFullHour = UnixTime.now().toStartOf(
      resolution === 'daily' ? 'day' : 'hour',
    )

    const start = nowToFullHour.add(-days, 'days')
    const end = nowToFullHour

    const records = await db.aggregatedL2Cost.getByProjectAndTimeRange(
      project.id,
      [start, end],
    )

    data.push(...records)
  }
  const summed = sumByTimestamp(data, resolution)

  return withTypes(summed)
}

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
    Omit<
      AggregatedL2CostRecord,
      'projectId' | 'timestamp' | 'totalGas' | 'totalGasEth' | 'totalGasUsd'
    >
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
        blobsGas:
          existing.blobsGas && record.blobsGas
            ? existing.blobsGas + record.blobsGas
            : existing.blobsGas,
        blobsGasEth:
          existing.blobsGasEth && record.blobsGasEth
            ? existing.blobsGasEth + record.blobsGasEth
            : existing.blobsGasEth,
        blobsGasUsd:
          existing.blobsGasUsd && record.blobsGasUsd
            ? existing.blobsGasUsd + record.blobsGasUsd
            : existing.blobsGasUsd,
      })
      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      blobsGas: record.blobsGas,
      blobsGasEth: record.blobsGasEth,
      blobsGasUsd: record.blobsGasUsd,
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
