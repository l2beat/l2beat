import { clampRangeToDay, UnixTime } from '@l2beat/shared-pure'

import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import {
  AggregatedL2CostsRecord,
  AggregatedL2CostsRepository,
} from './repositories/AggregatedL2CostsRepository'
import {
  L2CostsRecord,
  L2CostsRecordWithProjectId,
  L2CostsRepository,
} from './repositories/L2CostsRepository'

// Amount of gas required for a basic tx
const OVERHEAD = 21_000

export interface L2CostsAggregatorIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  l2CostsRepository: L2CostsRepository
  aggregatedL2CostsRepository: AggregatedL2CostsRepository
}

export class L2CostsAggregatorIndexer extends ManagedChildIndexer {
  constructor(private readonly $: L2CostsAggregatorIndexerDeps) {
    super({ ...$, name: 'l2_costs_aggregator' })
  }

  override async update(from: number, to: number): Promise<number> {
    const { from: unixFrom, to: unixTo } = clampRangeToDay(from, to)

    const costs = await this.$.l2CostsRepository.getWithProjectIdByTimeRange([
      unixFrom,
      unixTo,
    ])

    const aggregated = this.aggregate(costs)
    await this.$.aggregatedL2CostsRepository.addMany(aggregated)
    this.logger.info('Aggregated L2 costs', {
      count: aggregated.length,
    })
    return unixTo.toNumber()
  }

  aggregate(records: L2CostsRecordWithProjectId[]): AggregatedL2CostsRecord[] {
    const set = new Map<string, AggregatedL2CostsRecord>()

    for (const record of records) {
      const key = `${record.projectId}:${record.timestamp
        .toStartOf('hour')
        .toString()}`
      const timestamp = record.timestamp.toStartOf('hour')
      const existing = set.get(key)
      const calculations = this.calculate(record)
      if (existing) {
        existing.totalGasUsed += calculations.totalGasUsed
        existing.calldataGasUsed += calculations.calldataGasUsed
        if (existing.blobsGasUsed === null) {
          existing.blobsGasUsed = calculations.blobsGasUsed
        } else if (calculations.blobsGasUsed !== null) {
          existing.blobsGasUsed += calculations.blobsGasUsed
        }
        existing.computeGasUsed += calculations.computeGasUsed
        existing.overheadGasUsed += calculations.overheadGasUsed
      } else {
        set.set(key, {
          timestamp,
          projectId: record.projectId,
          totalGasUsed: calculations.totalGasUsed,
          calldataGasUsed: calculations.calldataGasUsed,
          blobsGasUsed: calculations.blobsGasUsed,
          computeGasUsed: calculations.computeGasUsed,
          overheadGasUsed: calculations.overheadGasUsed,
        })
      }
    }

    return Array.from(set.values())
  }

  calculate(
    tx: L2CostsRecord,
  ): Omit<AggregatedL2CostsRecord, 'timestamp' | 'projectId'> {
    //TODO: Include multiplier
    const totalGasUsed = tx.data.gasUsed
    const calldataGasUsed = tx.data.calldataGasUsed
    const overheadGasUsed = OVERHEAD
    const computeGasUsed = totalGasUsed - calldataGasUsed - overheadGasUsed

    if (tx.data.type !== 3) {
      return {
        totalGasUsed,
        calldataGasUsed,
        blobsGasUsed: null,
        computeGasUsed,
        overheadGasUsed,
      }
    }

    const blobsGasUsed = tx.data.blobGasUsed
    return {
      totalGasUsed: totalGasUsed + blobsGasUsed,
      calldataGasUsed,
      blobsGasUsed,
      computeGasUsed,
      overheadGasUsed,
    }
  }

  override async invalidate(targetHeight: number): Promise<number> {
    //TODO: Check if targetHeight is inclusive
    const unixTargetHeight = new UnixTime(targetHeight)
    await this.$.aggregatedL2CostsRepository.deleteFrom(unixTargetHeight)

    return targetHeight
  }
}
