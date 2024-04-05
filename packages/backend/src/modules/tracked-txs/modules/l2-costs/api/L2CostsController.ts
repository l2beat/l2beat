import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  AssetId,
  cacheAsyncFunction,
  L2CostsApiChart,
  L2CostsApiChartPoint,
  L2CostsApiResponse,
  L2CostsProjectApiCharts,
  notUndefined,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'

import { Project } from '../../../../../model/Project'
import { TaskQueue } from '../../../../../tools/queue/TaskQueue'
import { PriceRepository } from '../../../../tvl/repositories/PriceRepository'
import { TrackedTxsConfigsRepository } from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxsConfig } from '../../../types/TrackedTxsConfig'
import { addToMap } from '../../utils/addToMap'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import {
  L2CostsRecord,
  L2CostsRepository,
} from '../repositories/L2CostsRepository'
import {
  DetailedTransaction,
  DetailedTransactionBase,
} from '../types/DetailedTransaction'

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

const NOW_TO_FULL_HOUR = UnixTime.now().toStartOf('hour')
const MAX_DAYS = 180
const MAX_RECORDS = 50000

// Amount of gas required for a basic tx
const OVERHEAD = 21_000

export const CHART_TYPES: L2CostsApiChart['types'] = [
  'timestamp',
  'totalGas',
  'totalEth',
  'totalUsd',
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
] as const

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

    const combinedHourlyMap = new Map<number, L2CostsApiChartPoint>()
    const combinedDailyMap = new Map<number, L2CostsApiChartPoint>()

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

      const timeRanges: [UnixTime, UnixTime] = [
        NOW_TO_FULL_HOUR.add(-MAX_DAYS, 'days'),
        NOW_TO_FULL_HOUR,
      ]

      const { count } =
        await this.l2CostsRepository.findCountByProjectAndTimeRange(
          project.projectId,
          timeRanges,
        )
      for (
        let rangeIndex = 0;
        rangeIndex < Math.ceil(count / MAX_RECORDS);
        rangeIndex++
      ) {
        const records =
          await this.l2CostsRepository.getByProjectAndTimeRangePaginated(
            project.projectId,
            timeRanges,
            rangeIndex * MAX_RECORDS,
            MAX_RECORDS,
          )
        const recordsWithDetails = await this.makeTransactionCalculations(
          records,
          timeRanges,
        )

        const { hourly, daily } = this.aggregateL2Costs(
          recordsWithDetails,
          combinedHourlyMap,
          combinedDailyMap,
        )

        const projectData = projects[project.projectId.toString()]
        if (projectData) {
          hourly.data = [...projectData.hourly.data, ...hourly.data]
          daily.data = [...projectData.daily.data, ...daily.data]
        }
        projects[project.projectId.toString()] = {
          syncedUntil,
          hourly,
          daily,
        }
      }
    }

    return {
      type: 'success',
      data: {
        projects,
        combined: this.getCombinedL2Costs(combinedHourlyMap, combinedDailyMap),
      },
    }
  }

  aggregateL2Costs(
    transactions: DetailedTransaction[],
    combinedHourlyMap: Map<number, L2CostsApiChartPoint>,
    combinedDailyMap: Map<number, L2CostsApiChartPoint>,
  ): Omit<L2CostsProjectApiCharts, 'syncedUntil'> {
    const hourlyMap = new Map<number, L2CostsApiChartPoint>()
    const dailyMap = new Map<number, L2CostsApiChartPoint>()

    for (const tx of transactions) {
      if (tx.timestamp.gt(NOW_TO_FULL_HOUR.add(-7, 'days'))) {
        addToMap(hourlyMap, 'hour', tx)
        addToMap(combinedHourlyMap, 'hour', tx)
      }
      addToMap(dailyMap, 'day', tx)
      addToMap(combinedDailyMap, 'day', tx)
    }
    const hourly: L2CostsProjectApiCharts['hourly'] = {
      types: CHART_TYPES,
      data: Array.from(hourlyMap.values()),
    }
    const daily: L2CostsProjectApiCharts['daily'] = {
      types: CHART_TYPES,
      data: Array.from(dailyMap.values()),
    }
    return {
      hourly,
      daily,
    }
  }

  async makeTransactionCalculations(
    transactions: L2CostsRecord[],
    ranges: [UnixTime, UnixTime],
  ): Promise<DetailedTransaction[]> {
    const ethPricesMap = await this.priceRepository.findByTimestampRange(
      AssetId.ETH,
      ranges[0],
      ranges[1],
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

  private getCombinedL2Costs(
    combinedHourlyMap: Map<number, L2CostsApiChartPoint>,
    combinedDailyMap: Map<number, L2CostsApiChartPoint>,
  ) {
    return {
      hourly: {
        types: CHART_TYPES,
        data: Array.from(combinedHourlyMap.values()).sort(
          (a, b) => a[0].toNumber() - b[0].toNumber(),
        ),
      },
      daily: {
        types: CHART_TYPES,
        data: Array.from(combinedDailyMap.values()).sort(
          (a, b) => a[0].toNumber() - b[0].toNumber(),
        ),
      },
    }
  }
}
