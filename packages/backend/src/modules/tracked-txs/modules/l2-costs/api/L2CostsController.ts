import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  AssetId,
  L2CostsApiResponse,
  L2CostsDetails,
  notUndefined,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../../../../../model/Project'
import { IndexerStateRepository } from '../../../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../../../tools/Clock'
import { PriceRepository } from '../../../../tvl/repositories/PriceRepository'
import { TrackedTxsConfigsRepository } from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxsConfig } from '../../../types/TrackedTxsConfig'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import {
  L2CostsRecord,
  L2CostsRepository,
} from '../repositories/L2CostsRepository'

type L2CostsResult =
  | {
      type: 'success'
      data: L2CostsApiResponse
    }
  | { type: 'error'; error: 'DATA_NOT_SYNCED' }

type L2CostsTrackedTxsConfig = {
  entries: L2CostsTrackedTxsConfigEntry[]
}

type L2CostsTrackedTxsConfigEntry = {
  subtype: TrackedTxsConfigSubtype
  untilTimestamp: UnixTime | undefined
}

const NOW = UnixTime.now()

interface DetailedTransactionBase {
  timestamp: UnixTime
  calldataGasUsed: number
  computeGasUsed: number
  overheadGasUsed: 21000
  totalGas: number
  gasCost: number
  calldataGasCost: number
  computeGasCost: number
  totalGasCost: number
  totalOverheadGasCost: number
  gasCostUsd: number
  calldataGasCostUsd: number
  computeGasCostUsd: number
  totalGasCostUsd: number
  totalOverheadGasCostUsd: number
}

export type DetailedTransaction =
  | (DetailedTransactionBase & {
      type: 2
    })
  | (DetailedTransactionBase & {
      type: 3
      blobGasCost: number
      blobGasUsed: number
      blobGasCostUsd: number
    })

export class L2CostsController {
  constructor(
    private readonly l2CostsRepository: L2CostsRepository,
    private readonly trackedTxsConfigsRepository: TrackedTxsConfigsRepository,
    private readonly priceRepository: PriceRepository,
    private readonly indexerStateRepository: IndexerStateRepository,
    private readonly projects: Project[],
    private readonly clock: Clock,
    private readonly logger = Logger.SILENT,
  ) {
    this.logger = this.logger.for(this)
  }

  async getL2Costs(): Promise<L2CostsResult> {
    const requiredTimestamp = this.clock.getLastHour().add(-1, 'hours')
    const indexerState = await this.indexerStateRepository.findIndexerState(
      'tracked_txs_indexer',
    )

    if (
      indexerState === undefined ||
      new UnixTime(indexerState.safeHeight).lt(requiredTimestamp)
    ) {
      return { type: 'error', error: 'DATA_NOT_SYNCED' }
    }

    const projects: L2CostsApiResponse['projects'] = {}

    const activeProjects = this.projects.filter((p) => !p.isArchived)
    for (const project of activeProjects) {
      if (!project.trackedTxsConfig) {
        continue
      }

      const l2CostsConfig = this.getL2CostsTrackedTxsConfig(
        project.trackedTxsConfig,
      )

      if (l2CostsConfig.entries?.length === 0) {
        continue
      }

      const configurations =
        await this.trackedTxsConfigsRepository.getByProjectIdAndType(
          project.projectId,
          'l2costs',
        )

      const syncedUntil = getSyncedUntil(configurations)
      if (!syncedUntil) {
        continue
      }

      const records = await this.l2CostsRepository.getByProjectSinceTimestamp(
        project.projectId,
        NOW.add(-90, 'days').toStartOf('hour'),
        NOW.toStartOf('hour'),
      )

      const last90d = await this.makeTransactionCalculations(records)
      const last30d: DetailedTransaction[] = []
      const last7d: DetailedTransaction[] = []
      const last24h: DetailedTransaction[] = []

      for (const record of last90d) {
        if (record.timestamp.gt(NOW.add(-30, 'days'))) {
          last30d.push(record)
        }
        if (record.timestamp.gt(NOW.add(-7, 'days'))) {
          last7d.push(record)
        }
        if (record.timestamp.gt(NOW.add(-1, 'days'))) {
          last24h.push(record)
        }
      }

      projects[project.projectId.toString()] = {
        syncedUntil,
        last24h: this.sumDetails(last24h),
        last7d: this.sumDetails(last7d),
        last30d: this.sumDetails(last30d),
        last90d: this.sumDetails(last90d),
      }
    }

    return { type: 'success', data: { projects } }
  }

  sumDetails(transactions: DetailedTransaction[]): L2CostsDetails {
    return transactions.reduce<L2CostsDetails>(
      (acc, tx) => {
        acc.totalCost += tx.totalGasCost
        acc.totalGas += tx.totalGas
        acc.totalCostUsd += tx.totalGasCostUsd
        acc.totalCalldataGas += tx.calldataGasUsed
        acc.totalComputeGas += tx.computeGasUsed
        acc.totalCalldataCost += tx.calldataGasCost
        acc.totalComputeCost += tx.computeGasCost
        acc.totalCalldataCostUsd += tx.calldataGasCostUsd
        acc.totalComputeCostUsd += tx.computeGasCostUsd
        acc.totalOverheadGas += tx.overheadGasUsed
        acc.totalOverheadCost += tx.totalOverheadGasCost
        acc.totalOverheadCostUsd += tx.totalOverheadGasCostUsd

        if (tx.type === 3) {
          if (!acc.totalBlobGas) acc.totalBlobGas = 0
          if (!acc.totalBlobCost) acc.totalBlobCost = 0
          if (!acc.totalBlobCostUsd) acc.totalBlobCostUsd = 0

          acc.totalBlobGas += tx.blobGasUsed
          acc.totalBlobCost += tx.blobGasCost
          acc.totalBlobCostUsd += tx.blobGasCostUsd
        }
        return acc
      },
      {
        totalCost: 0,
        totalGas: 0,
        totalCostUsd: 0,
        totalCalldataGas: 0,
        totalComputeGas: 0,
        totalCalldataCost: 0,
        totalComputeCost: 0,
        totalCalldataCostUsd: 0,
        totalComputeCostUsd: 0,
        totalOverheadGas: 0,
        totalOverheadCost: 0,
        totalOverheadCostUsd: 0,
      },
    )
  }

  async makeTransactionCalculations(
    transactions: L2CostsRecord[],
  ): Promise<DetailedTransaction[]> {
    const ethPricesMap = await this.priceRepository.findByTimestampRange(
      AssetId.ETH,
      NOW.add(-90, 'days').toStartOf('hour'),
      NOW.toStartOf('hour'),
    )

    return transactions.map((tx) => {
      const ethUsdPrice = ethPricesMap.get(
        tx.timestamp.toStartOf('hour').toNumber(),
      )
      assert(
        ethUsdPrice,
        `[L2Costs]: ETH price not found: ${tx.timestamp
          .toStartOf('hour')
          .toDate()
          .toISOString()}`,
      )

      const gasPriceGwei = parseFloat((tx.data.gasPrice * 1e-9).toFixed(9))
      const gasPriceETH = parseFloat((gasPriceGwei * 1e-9).toFixed(18))

      const calldataGasUsed = tx.data.calldataGasUsed
      const computeGasUsed = tx.data.gasUsed - tx.data.calldataGasUsed - 21_000
      const overheadGasUsed = 21_000
      const totalGas = tx.data.gasUsed
      const gasCost = tx.data.gasUsed * gasPriceETH
      const calldataGasCost = calldataGasUsed * gasPriceETH
      const computeGasCost = computeGasUsed * gasPriceETH
      const totalGasCost = gasCost
      const totalOverheadGasCost = overheadGasUsed * gasPriceETH
      const gasCostUsd = gasCost * ethUsdPrice
      const totalGasCostUsd = totalGasCost * ethUsdPrice
      const calldataGasCostUsd = calldataGasCost * ethUsdPrice
      const computeGasCostUsd = computeGasCost * ethUsdPrice
      const totalOverheadGasCostUsd = totalOverheadGasCost * ethUsdPrice

      const detailedTransaction: DetailedTransactionBase = {
        timestamp: tx.timestamp,
        calldataGasUsed,
        computeGasUsed,
        overheadGasUsed,
        totalGas,
        gasCost,
        calldataGasCost,
        computeGasCost,
        totalGasCost,
        totalOverheadGasCost,
        gasCostUsd,
        totalGasCostUsd,
        calldataGasCostUsd,
        computeGasCostUsd,
        totalOverheadGasCostUsd,
      }
      if (tx.data.type === 3) {
        const blobGasPriceGwei = parseFloat(
          (tx.data.blobGasPrice * 1e-9).toFixed(9),
        )
        const blobGasPriceETH = parseFloat(
          (blobGasPriceGwei * 1e-9).toFixed(18),
        )
        const blobGasCost = tx.data.blobGasUsed * blobGasPriceETH
        const blobGasCostUsd = blobGasCost * ethUsdPrice

        return {
          ...detailedTransaction,
          type: 3,
          blobGasCost,
          blobGasUsed: tx.data.blobGasUsed,
          blobGasCostUsd,
          totalGas: totalGas + tx.data.blobGasUsed,
          totalGasCost: totalGasCost + blobGasCost,
          totalGasCostUsd: (totalGasCost + blobGasCost) * ethUsdPrice,
        } as const
      }
      return {
        ...detailedTransaction,
        type: 2,
      } as const
    })
  }

  getL2CostsTrackedTxsConfig(
    trackedTxsConfig: TrackedTxsConfig,
  ): L2CostsTrackedTxsConfig {
    return {
      entries: trackedTxsConfig.entries
        .flatMap((entry) => {
          return entry.uses.flatMap((use) => {
            if (use.type !== 'l2costs') {
              return
            }

            return {
              subtype: use.subtype,
              untilTimestamp: entry.untilTimestampExclusive,
            }
          })
        })
        .filter(notUndefined),
    }
  }
}
