import type {
  AggregatedL2CostRecord,
  Database,
  L2CostPriceRecord,
  L2CostRecord,
} from '@l2beat/database'
import type { TrackedTxCostsConfig, TrackedTxId } from '@l2beat/shared'
import {
  assert,
  clampRangeToDay,
  type ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import type { TrackedTxProject } from '../../../../../config/Config'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'

// Amount of gas required for a basic tx
const OVERHEAD = 21_000

export interface ProjectL2Cost extends L2CostRecord {
  projectId: ProjectId
}

export interface L2CostsAggregatorIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  projects: TrackedTxProject[]
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

    if (shiftedFrom === shiftedTo) {
      // there's nothing to sync
      return to
    }

    const costs = await this.getL2CostRecordsWithProjectId([
      shiftedFrom,
      shiftedTo,
    ])

    const ethPrices = await this.$.db.l2CostPrice.getByTimestampRange(
      shiftedFrom,
      shiftedTo,
    )

    const aggregated = this.aggregate(costs, ethPrices)

    await this.$.db.aggregatedL2Cost.upsertMany(aggregated)
    this.logger.info('Aggregated L2 costs', {
      count: aggregated.length,
    })

    return shiftedTo + 1
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // no need to remove data
    // safeHeight will be updated to this value
    return await Promise.resolve(targetHeight)
  }

  shift(from: number, to: number): [UnixTime, UnixTime] {
    // limit time range to one day if greater
    const { from: unixFrom, to: unixTo } = clampRangeToDay(from, to)

    // start from a beginning of an hour
    // 13:00:01 => 13:00:00
    const shiftedUnixFrom = UnixTime.toStartOf(unixFrom, 'hour')

    // end on last full hour
    // 13:45:51 => 13:00:00
    let shiftedUnixTo = UnixTime.toStartOf(unixTo, 'hour')

    if (shiftedUnixFrom === shiftedUnixTo) {
      return [shiftedUnixFrom, shiftedUnixTo]
    }

    // do not include ending hour
    // 13:00:00 => 12:59:59
    shiftedUnixTo = shiftedUnixTo - 1

    this.logger.info('Time range shifted', {
      shiftedFrom: shiftedUnixFrom,
      shiftedTo: shiftedUnixTo,
    })

    return [shiftedUnixFrom, shiftedUnixTo]
  }

  async getL2CostRecordsWithProjectId(
    timeRange: [UnixTime, UnixTime],
  ): Promise<ProjectL2Cost[]> {
    const [shiftedFrom, shiftedTo] = timeRange
    const costs = await this.$.db.l2Cost.getByTimeRange([
      shiftedFrom,
      shiftedTo,
    ])

    const configurations =
      await this.$.db.indexerConfiguration.getByConfigurationIds(
        uniq(costs.map((c) => c.configurationId)),
      )

    return costs.map((l2costsRow) => {
      const config = configurations.find(
        (configRow) => configRow.id === l2costsRow.configurationId,
      )
      assert(
        config?.id,
        `Indexer config with id: ${config?.id} could not be found`,
      )
      return {
        ...l2costsRow,
        projectId: JSON.parse(config.properties).projectId as ProjectId,
      }
    })
  }

  aggregate(
    records: ProjectL2Cost[],
    ethPrices: L2CostPriceRecord[],
  ): AggregatedL2CostRecord[] {
    const multipliers = this.findTxConfigsWithMultiplier()
    const map = new Map<string, AggregatedL2CostRecord>()

    for (const record of records) {
      const timestamp = UnixTime.toStartOf(record.timestamp, 'hour')
      const key = `${record.projectId}:${timestamp.toString()}`

      const ethUsdPrice = ethPrices.find((p) => p.timestamp === timestamp)
      assert(
        ethUsdPrice,
        `[${L2CostsAggregatorIndexer.name}]: ETH price not found: ${timestamp}`,
      )

      const multiplier = multipliers.find(
        (c) => c.id === record.configurationId,
      )
      assert(multiplier, `Multiplier not found for ${record.configurationId}`)

      const calculations = this.calculate(
        record,
        ethUsdPrice.priceUsd,
        multiplier.factor,
      )

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

        existing.overheadGas += calculations.overheadGas
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
    tx: L2CostRecord,
    ethUsdPrice: number,
    factor: number,
  ): Omit<AggregatedL2CostRecord, 'timestamp' | 'projectId'> {
    const gasPriceETH = this.weiToEth(tx.gasPrice)
    const totalGas = Math.round(tx.gasUsed * factor)
    const calldataGas = Math.round(tx.calldataGasUsed * factor)
    const overheadGas = Math.round(OVERHEAD * factor)
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
      overheadGas,
      overheadGasEth,
      overheadGasUsd,
    }

    if (!tx.blobGasUsed || !tx.blobGasPrice) {
      return base
    }

    const blobsGasPriceETH = this.weiToEth(tx.blobGasPrice)
    const blobsGas = Math.round(tx.blobGasUsed * factor)
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

  findTxConfigsWithMultiplier(): TrackedTxMultiplier[] {
    const multipliers: TrackedTxMultiplier[] = []

    for (const project of this.$.projects) {
      const projectMultipliers = project.configurations
        .filter((u): u is TrackedTxCostsConfig => u.type === 'l2costs')
        .map((e) => {
          return {
            id: e.id,
            factor: e.costMultiplier ?? 1,
          }
        })

      multipliers.push(...projectMultipliers)
    }

    return multipliers
  }

  private weiToEth(wei: bigint): number {
    // Biggest wei we can get from DB is 2^63-1 which divided by 1e9 is safe to parse to Number
    const integerPartGwei = Number(wei / 1_000_000_000n)
    const fractionPartGwei = Number(wei % 1_000_000_000n)
    const gwei = integerPartGwei + fractionPartGwei / 1_000_000_000

    return gwei / 1_000_000_000
  }
}
