import { assert, AssetId, clampRangeToDay, UnixTime } from '@l2beat/shared-pure'

import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'
import type { PriceRepository } from '../../../tvl/repositories/PriceRepository'
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
}

export class L2CostsAggregatorIndexer extends ManagedChildIndexer {
  constructor(private readonly $: L2CostsAggregatorIndexerDeps) {
    super({ ...$, name: 'l2_costs_aggregator' })
  }

  override async update(from: number, to: number): Promise<number> {
    from -= 1 // TODO: refactor logic after uif update
    const { from: unixFrom, to: unixTo } = clampRangeToDay(from, to)

    const costs = await this.$.l2CostsRepository.getWithProjectIdByTimeRange([
      unixFrom,
      unixTo.add(-1, 'seconds'),
    ])

    const ethPrices = await this.$.priceRepository.findByTimestampRange(
      AssetId.ETH,
      unixFrom,
      unixTo.add(-1, 'seconds'),
    )

    if (
      !ethPrices.get(unixFrom.toNumber()) ||
      !ethPrices.get(unixTo.toNumber())
    ) {
      this.logger.warn('ETH price not found for the range', {
        from: unixFrom.toNumber(),
        to: unixTo.toNumber(),
      })
      return unixFrom.toNumber()
    }

    const aggregated = this.aggregate(costs, ethPrices)
    await this.$.aggregatedL2CostsRepository.addMany(aggregated)
    this.logger.info('Aggregated L2 costs', {
      count: aggregated.length,
    })

    return unixTo.toNumber()
  }

  aggregate(
    records: L2CostsRecordWithProjectId[],
    ethPrices: Map<number, number>,
  ): AggregatedL2CostsRecord[] {
    const map = new Map<string, AggregatedL2CostsRecord>()

    for (const record of records) {
      const timestamp = record.timestamp.toStartOf('hour')
      const key = `${record.projectId}:${timestamp.toString()}`

      const ethUsdPrice = ethPrices.get(timestamp.toNumber())
      assert(
        ethUsdPrice,
        `[L2Costs]: ETH price not found: ${timestamp.toNumber()}`,
      )
      const calculations = this.calculate(record, ethUsdPrice)
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
      }

      map.set(key, {
        timestamp,
        projectId: record.projectId,
        ...calculations,
      })
    }

    return Array.from(map.values())
  }

  calculate(
    tx: L2CostsRecord,
    ethUsdPrice: number,
  ): Omit<AggregatedL2CostsRecord, 'timestamp' | 'projectId'> {
    // TODO: Multipliers in Controller
    const gasPriceGwei = Number.parseFloat((tx.data.gasPrice * 1e-9).toFixed(9))
    const gasPriceETH = Number.parseFloat((gasPriceGwei * 1e-9).toFixed(18))
    const totalGas = tx.data.gasUsed
    const calldataGas = tx.data.calldataGasUsed
    const overheadGas = OVERHEAD
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
    const blobsGas = tx.data.blobGasUsed
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

  override async invalidate(targetHeight: number): Promise<number> {
    //TODO: Check if targetHeight is inclusive
    const unixTargetHeight = new UnixTime(targetHeight)
    await this.$.aggregatedL2CostsRepository.deleteFrom(unixTargetHeight)

    return targetHeight
  }
}
