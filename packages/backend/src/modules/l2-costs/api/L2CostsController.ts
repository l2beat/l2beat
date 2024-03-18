import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  AssetId,
  L2CostsApiResponse,
  notUndefined,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../../../model/Project'
import { IndexerStateRepository } from '../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../tools/Clock'
import { TrackedTxsConfig } from '../../tracked-txs/types/TrackedTxsConfig'
import { PriceRepository } from '../../tvl/repositories/PriceRepository'
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

interface SumedTransactions {
  totalCost: number
  totalGas: number
  totalCostUsd: number
  totalCalldataGas: number
  totalComputeGas: number
  totalBlobGas?: number
  totalCalldataCost: number
  totalComputeCost: number
  totalBlobCost?: number
  totalCalldataCostUsd: number
  totalComputeCostUsd: number
  totalBlobCostUsd?: number
}

interface DetailedTransactionBase {
  timestamp: UnixTime
  calldataGasUsed: number
  computeGasUsed: number
  totalGas: number
  gasCost: number
  calldataGasCost: number
  computeGasCost: number
  calldataGasCostUsd: number
  computeGasCostUsd: number
  totalGasCost: number
  gasCostUsd: number
  totalGasCostUsd: number
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

      const isSynced = l2CostsConfig.entries.some(
        (e) => !e.untilTimestamp || e.untilTimestamp.gt(NOW),
      )

      const records = await this.l2CostsRepository.getByProjectSinceTimestamp(
        project.projectId,
        NOW.add(-90, 'days'),
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
        isSynced,
        '24h': this.sumDetails(last24h),
        '7d': this.sumDetails(last7d),
        '30d': this.sumDetails(last30d),
        '90d': this.sumDetails(last90d),
      }
    }

    return { type: 'success', data: { projects } }
  }

  sumDetails(transactions: DetailedTransaction[]): SumedTransactions {
    return transactions.reduce<SumedTransactions>(
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
      },
    )
  }

  async makeTransactionCalculations(
    transactions: L2CostsRecord<2 | 3>[],
  ): Promise<DetailedTransaction[]> {
    const ethPricesMap = await this.priceRepository.findByTimestampRange(
      AssetId.ETH,
      UnixTime.now().add(-90, 'days'),
      UnixTime.now(),
    )
    return transactions.map((tx) => {
      const ethUsdPrice = ethPricesMap.get(
        tx.timestamp.toStartOf('hour').toNumber(),
      )
      assert(ethUsdPrice, 'ETH price not found')

      const calldataGasUsed = tx.data.calldataGasUsed
      const computeGasUsed = tx.data.gasUsed - tx.data.calldataGasUsed - 21_000
      const totalGas = tx.data.gasUsed
      const gasCost = tx.data.gasUsed * tx.data.gasPrice
      const calldataGasCost = calldataGasUsed * tx.data.gasPrice
      const computeGasCost = computeGasUsed * tx.data.gasPrice
      const totalGasCost = gasCost
      const gasCostUsd = gasCost * ethUsdPrice
      const totalGasCostUsd = totalGasCost * ethUsdPrice
      const calldataGasCostUsd = calldataGasCost * ethUsdPrice
      const computeGasCostUsd = computeGasCost * ethUsdPrice

      const detailedTransaction: DetailedTransactionBase = {
        timestamp: tx.timestamp,
        calldataGasUsed,
        computeGasUsed,
        totalGas,
        gasCost,
        calldataGasCost,
        computeGasCost,
        totalGasCost,
        gasCostUsd,
        totalGasCostUsd,
        calldataGasCostUsd,
        computeGasCostUsd,
      }
      if (tx.data.type === 3) {
        const blobGasCost = tx.data.blobGasUsed * tx.data.blobGasPrice
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
            if (use.type !== 'fees') {
              return
            }

            return {
              subtype: use.subtype,
              untilTimestamp: entry.untilTimestamp,
            }
          })
        })
        .filter(notUndefined),
    }
  }
}
