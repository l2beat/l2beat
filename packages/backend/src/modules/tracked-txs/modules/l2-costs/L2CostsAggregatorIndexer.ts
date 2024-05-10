import { assert, AssetId, UnixTime, clampRangeToDay } from '@l2beat/shared-pure'

import { Project } from '../../../../model/Project'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import type { PriceRepository } from '../../../tvl/repositories/PriceRepository'
import { TrackedTxId } from '../../types/TrackedTxId'
import type {
  AggregatedL2CostsRecord,
  AggregatedL2CostsRepository,
} from './repositories/AggregatedL2CostsRepository'
import type {
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
  priceRepository: PriceRepository
  projects: Project[]
}

export interface TrackedTxMultiplier {
  id: TrackedTxId
  factor: number
}

export class L2CostsAggregatorIndexer extends ManagedChildIndexer {
  constructor(private readonly $: L2CostsAggregatorIndexerDeps) {
    super({ ...$, name: 'l2_costs_aggregator' })
  }

  override async update(from: number, to: number): Promise<number> {
    const [shiftedFrom, shiftedTo] = this.shift(from, to)

    if (shiftedFrom.equals(shiftedTo)) {
      // there's nothing to sync
      return to
    }

    const costs = await this.$.l2CostsRepository.getWithProjectIdByTimeRange([
      shiftedFrom,
      shiftedTo,
    ])

    const ethPrices = await this.$.priceRepository.findByTimestampRange(
      AssetId.ETH,
      shiftedFrom,
      shiftedTo,
    )

    const aggregated = this.aggregate(costs, ethPrices)
    await this.$.aggregatedL2CostsRepository.addMany(aggregated)
    this.logger.info('Aggregated L2 costs', {
      count: aggregated.length,
    })

    return shiftedTo.add(1, 'seconds').toNumber()
  }

  override async invalidate(targetHeight: number): Promise<number> {
    const unixTargetHeight = new UnixTime(targetHeight)
    await this.$.aggregatedL2CostsRepository.deleteAfter(unixTargetHeight)

    return targetHeight
  }

  shift(from: number, to: number): [UnixTime, UnixTime] {
    // limit time range to one day if greater
    const { from: unixFrom, to: unixTo } = clampRangeToDay(from, to)

    // start from a begining of an hour
    // 13:00:01 => 13:00:00
    const shiftedUnixFrom = unixFrom.toStartOf('hour')

    // end on last full hour
    // 13:45:51 => 13:00:00
    let shiftedUnixTo = unixTo.toStartOf('hour')

    if (shiftedUnixFrom.equals(shiftedUnixTo)) {
      return [shiftedUnixFrom, shiftedUnixTo]
    }

    // do not include ending hour
    // 13:00:00 => 12:59:59
    shiftedUnixTo = shiftedUnixTo.add(-1, 'seconds')

    this.logger.info('Time range shifted', {
      shiftedFrom: shiftedUnixFrom,
      shiftedTo: shiftedUnixTo,
    })

    return [shiftedUnixFrom, shiftedUnixTo]
  }

  aggregate(
    records: L2CostsRecordWithProjectId[],
    ethPrices: Map<number, number>,
  ): AggregatedL2CostsRecord[] {
    const multipliers = this.findTxsWithMultiplier()
    const map = new Map<string, AggregatedL2CostsRecord>()

    for (const record of records) {
      const timestamp = record.timestamp.toStartOf('hour')
      const key = `${record.projectId}:${timestamp.toString()}`

      const ethUsdPrice = ethPrices.get(timestamp.toNumber())
      assert(
        ethUsdPrice,
        `[${
          L2CostsAggregatorIndexer.name
        }]: ETH price not found: ${timestamp.toNumber()}`,
      )
      const calculations = this.calculate(record, ethUsdPrice, multipliers)
      const existing = map.get(key)
      if (existing) {
        existing.totalGas += calculations.totalGas
        existing.totalGasEth += calculations.totalGasEth
        existing.totalGasUsd += calculations.totalGasUsd

        existing.calldataGas += calculations.calldataGas
        existing.calldataGasEth += calculations.calldataGasEth
        existing.calldataGasUsd += calculations.calldataGasUsd

        existing.computeGas += calculations.computeGas
        existing.computeGasEth += calculations.computeGasEth
        existing.computeGasUsd += calculations.computeGasUsd

        existing.overheadGasEth += calculations.overheadGasEth
        existing.overheadGasUsd += calculations.overheadGasUsd

        if (
          calculations.blobsGas === null ||
          calculations.blobsGasEth === null ||
          calculations.blobsGasUsd === null
        ) {
          continue
        }

        if (existing.blobsGas === null) {
          existing.blobsGas = calculations.blobsGas
        } else {
          existing.blobsGas += calculations.blobsGas
        }

        if (existing.blobsGasEth === null) {
          existing.blobsGasEth = calculations.blobsGasEth
        } else {
          existing.blobsGasEth += calculations.blobsGasEth
        }

        if (existing.blobsGasUsd === null) {
          existing.blobsGasUsd = calculations.blobsGasUsd
        } else {
          existing.blobsGasUsd += calculations.blobsGasUsd
        }
      } else {
        map.set(key, {
          timestamp,
          projectId: record.projectId,
          ...calculations,
        })
      }
    }

    return Array.from(map.values())
  }

  calculate(
    tx: L2CostsRecord,
    ethUsdPrice: number,
    multipliers: TrackedTxMultiplier[],
  ): Omit<AggregatedL2CostsRecord, 'timestamp' | 'projectId'> {
    let multiplicationFactor = 1

    const multiplier = multipliers.find((c) => c.id === tx.trackedTxId)

    if (multiplier) {
      multiplicationFactor = multiplier.factor
    }

    const gasPriceGwei = Number.parseFloat((tx.data.gasPrice * 1e-9).toFixed(9))
    const gasPriceETH = Number.parseFloat((gasPriceGwei * 1e-9).toFixed(18))

    const totalGas = Math.round(tx.data.gasUsed * multiplicationFactor)
    const calldataGas = Math.floor(
      tx.data.calldataGasUsed * multiplicationFactor,
    )
    const overheadGas = Math.round(OVERHEAD * multiplicationFactor)
    const computeGas = totalGas - calldataGas - overheadGas
    const totalGasEth = totalGas * gasPriceETH
    const calldataGasEth = calldataGas * gasPriceETH
    const computeGasEth = computeGas * gasPriceETH
    const overheadGasEth = overheadGas * gasPriceETH
    const totalGasUsd = totalGasEth * ethUsdPrice
    const calldataGasUsd = calldataGasEth * ethUsdPrice
    const computeGasUsd = computeGasEth * ethUsdPrice
    const overheadGasUsd = overheadGasEth * ethUsdPrice

    const base = {
      totalGas,
      totalGasUsd,
      totalGasEth,
      calldataGas,
      calldataGasUsd,
      calldataGasEth,
      blobsGas: null,
      blobsGasUsd: null,
      blobsGasEth: null,
      computeGas,
      computeGasUsd,
      computeGasEth,
      overheadGasEth,
      overheadGasUsd,
    }

    if (tx.data.type !== 3) {
      return base
    }

    const blobsGasPriceGwei = Number.parseFloat(
      (tx.data.blobGasPrice * 1e-9).toFixed(9),
    )
    const blobsGasPriceETH = Number.parseFloat(
      (blobsGasPriceGwei * 1e-9).toFixed(18),
    )
    const blobsGas = Math.round(tx.data.blobGasUsed * multiplicationFactor)
    const blobsGasEth = blobsGas * blobsGasPriceETH
    const blobsGasUsd = blobsGasEth * ethUsdPrice

    return {
      ...base,
      totalGas: totalGas + blobsGas,
      totalGasUsd: totalGasUsd + blobsGasUsd,
      totalGasEth: totalGasEth + blobsGasEth,
      blobsGas,
      blobsGasUsd,
      blobsGasEth,
    }
  }

  findTxsWithMultiplier(): TrackedTxMultiplier[] {
    const multipliers: TrackedTxMultiplier[] = []

    const activeProjects = this.$.projects.filter((p) => !p.isArchived)
    for (const project of activeProjects) {
      if (!project.trackedTxsConfig) {
        continue
      }

      const projectMultipliers = project.trackedTxsConfig.entries
        .filter((e) => e.costMultiplier)
        .flatMap((e) => {
          return e.uses
            .filter((u) => u.type === 'l2costs')
            .map((use) => ({
              id: use.id,
              factor: e.costMultiplier ?? 1,
            }))
        })

      multipliers.push(...projectMultipliers)
    }

    return multipliers
  }
}
