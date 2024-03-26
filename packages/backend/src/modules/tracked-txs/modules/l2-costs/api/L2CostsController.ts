import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  AssetId,
  cacheAsyncFunction,
  L2CostsApiProject,
  L2CostsApiResponse,
  notUndefined,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../../../../../model/Project'
import { TaskQueue } from '../../../../../tools/queue/TaskQueue'
import { PriceRepository } from '../../../../tvl/repositories/PriceRepository'
import { TrackedTxsConfigsRepository } from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxsConfig } from '../../../types/TrackedTxsConfig'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import {
  L2CostsRecord,
  L2CostsRepository,
} from '../repositories/L2CostsRepository'

type L2CostsResult = {
  type: 'success'
  data: L2CostsApiResponse
}

export type L2CostsTrackedTxsConfig = {
  entries: L2CostsTrackedTxsConfigEntry[]
}

type L2CostsTrackedTxsConfigEntry = {
  subtype: TrackedTxsConfigSubtype
  untilTimestamp: UnixTime | undefined
}

export type SummedL2Costs = Omit<L2CostsApiProject, 'syncedUntil'>

const NOW = UnixTime.now()

// Amount of gas required for a basic tx
const OVERHEAD = 21_000

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

interface DetailedType2Transaction extends DetailedTransactionBase {
  type: 2
}
interface DetailedType3Transaction extends DetailedTransactionBase {
  type: 3
  blobGasCost: number
  blobGasUsed: number
  blobGasCostUsd: number
}
export type DetailedTransaction =
  | DetailedType2Transaction
  | DetailedType3Transaction

export class L2CostsController {
  private readonly taskQueue: TaskQueue<void>
  getCachedL2CostsApiResponse: () => Promise<L2CostsResult>

  constructor(
    private readonly l2CostsRepository: L2CostsRepository,
    private readonly trackedTxsConfigsRepository: TrackedTxsConfigsRepository,
    private readonly priceRepository: PriceRepository,
    private readonly projects: Project[],
    private readonly logger = Logger.SILENT,
  ) {
    this.logger = this.logger.for(this)

    const cached = cacheAsyncFunction(() => this.getL2Costs())
    this.getCachedL2CostsApiResponse = cached.call
    this.taskQueue = new TaskQueue(
      cached.refetch,
      this.logger.for('taskQueue'),
      { metricsId: L2CostsController.name },
    )
  }

  start() {
    this.taskQueue.addToFront()
    this.logger.info('Caching: initial caching scheduled')

    const tenMinutes = 10 * 60 * 1000
    setInterval(() => {
      this.taskQueue.addIfEmpty()
      this.logger.info('Caching: refetch scheduled')
    }, tenMinutes)
  }

  async getL2Costs(): Promise<L2CostsResult> {
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

      const records = await this.l2CostsRepository.getByProjectAndTimeRange(
        project.projectId,
        [NOW.add(-90, 'days').toStartOf('hour'), NOW.toStartOf('hour')],
      )

      const recordsWithDetails = await this.makeTransactionCalculations(records)
      const sums = this.sumDetails(recordsWithDetails)

      projects[project.projectId.toString()] = {
        syncedUntil,
        last24h: sums.last24h,
        last7d: sums.last7d,
        last30d: sums.last30d,
        last90d: sums.last90d,
      }
    }

    return { type: 'success', data: { projects } }
  }

  sumDetails(transactions: DetailedTransaction[]): SummedL2Costs {
    return transactions.reduce<SummedL2Costs>(
      (acc, tx) => {
        if (tx.timestamp.gt(NOW.add(-1, 'days'))) {
          addToAcc(acc, tx, 'last24h')
        }
        if (tx.timestamp.gt(NOW.add(-7, 'days'))) {
          addToAcc(acc, tx, 'last7d')
        }
        if (tx.timestamp.gt(NOW.add(-30, 'days'))) {
          addToAcc(acc, tx, 'last30d')
        }
        if (tx.timestamp.gt(NOW.add(-90, 'days'))) {
          addToAcc(acc, tx, 'last90d')
        }
        return acc
      },
      {
        last24h: structuredClone(L2COSTS_DETAILS),
        last7d: structuredClone(L2COSTS_DETAILS),
        last30d: structuredClone(L2COSTS_DETAILS),
        last90d: structuredClone(L2COSTS_DETAILS),
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
      const computeGasUsed =
        tx.data.gasUsed - tx.data.calldataGasUsed - OVERHEAD
      const overheadGasUsed = OVERHEAD
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

function addToAcc(
  acc: SummedL2Costs,
  tx: DetailedTransaction,
  key: keyof SummedL2Costs,
) {
  acc[key].total.gas += tx.totalGas
  acc[key].total.ethCost += tx.totalGasCost
  acc[key].total.usdCost += tx.totalGasCostUsd

  acc[key].calldata.gas += tx.calldataGasUsed
  acc[key].calldata.ethCost += tx.calldataGasCost
  acc[key].calldata.usdCost += tx.calldataGasCostUsd

  acc[key].compute.gas += tx.computeGasUsed
  acc[key].compute.ethCost += tx.computeGasCost
  acc[key].compute.usdCost += tx.computeGasCostUsd

  acc[key].overhead.gas += tx.overheadGasUsed
  acc[key].overhead.ethCost += tx.totalOverheadGasCost
  acc[key].overhead.usdCost += tx.totalOverheadGasCostUsd

  if (tx.type === 3) {
    acc[key].blobs.gas += tx.blobGasUsed
    acc[key].blobs.ethCost += tx.blobGasCost
    acc[key].blobs.usdCost += tx.blobGasCostUsd
  }
}

const L2COSTS_DETAILS = {
  total: {
    gas: 0,
    ethCost: 0,
    usdCost: 0,
  },
  overhead: {
    gas: 0,
    ethCost: 0,
    usdCost: 0,
  },
  calldata: {
    gas: 0,
    ethCost: 0,
    usdCost: 0,
  },
  compute: {
    gas: 0,
    ethCost: 0,
    usdCost: 0,
  },
  blobs: {
    gas: 0,
    ethCost: 0,
    usdCost: 0,
  },
}
