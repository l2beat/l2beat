import { Logger } from '@l2beat/backend-tools'
import {
  L2CostsApiChart,
  L2CostsApiChartPoint,
  L2CostsApiResponse,
  L2CostsProjectApiCharts,
  TrackedTxsConfigSubtype,
  UnixTime,
  cacheAsyncFunction,
  notUndefined,
} from '@l2beat/shared-pure'

import { Project } from '../../../../../model/Project'
import { TaskQueue } from '../../../../../tools/queue/TaskQueue'
import { TrackedTxsConfigsRepository } from '../../../repositories/TrackedTxsConfigsRepository'
import { TrackedTxsConfig } from '../../../types/TrackedTxsConfig'
import { addToMap } from '../../utils/addToMap'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import {
  AggregatedL2CostsRecord,
  AggregatedL2CostsRepository,
} from '../repositories/AggregatedL2CostsRepository'

export type L2CostsTrackedTxsConfig = {
  entries: L2CostsTrackedTxsConfigEntry[]
}

type L2CostsTrackedTxsConfigEntry = {
  subtype: TrackedTxsConfigSubtype
  untilTimestamp: UnixTime | undefined
}

const MAX_DAYS = 180

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

export interface L2CostsControllerDeps {
  trackedTxsConfigsRepository: TrackedTxsConfigsRepository
  aggregatedL2CostsRepository: AggregatedL2CostsRepository
  projects: Project[]
  logger?: Logger
}

export class L2CostsController {
  private readonly taskQueue: TaskQueue<void>
  private readonly logger: Logger
  getCachedL2CostsApiResponse: () => Promise<L2CostsApiResponse>

  constructor(private readonly $: L2CostsControllerDeps) {
    this.logger = $.logger ? $.logger.for(this) : Logger.SILENT

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

    const thirtyMinutes = 30 * 60 * 1000
    setInterval(() => {
      this.taskQueue.addIfEmpty()
      this.logger.info('Caching: refetch scheduled')
    }, thirtyMinutes)
  }

  async getL2Costs(): Promise<L2CostsApiResponse> {
    const projects: L2CostsApiResponse['projects'] = {}

    const combinedHourlyMap = new Map<number, L2CostsApiChartPoint>()
    const combinedDailyMap = new Map<number, L2CostsApiChartPoint>()

    const activeProjects = this.$.projects.filter((p) => !p.isArchived)
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
        await this.$.trackedTxsConfigsRepository.getByProjectIdAndType(
          project.projectId,
          'l2costs',
        )

      const syncedUntil = getSyncedUntil(configurations)
      if (!syncedUntil) {
        continue
      }

      const nowToFullHour = UnixTime.now().toStartOf('hour')

      const timeRange: [UnixTime, UnixTime] = [
        nowToFullHour.add(-MAX_DAYS, 'days'),
        nowToFullHour,
      ]

      const records =
        await this.$.aggregatedL2CostsRepository.getByProjectAndTimeRange(
          project.projectId,
          timeRange,
        )

      const { hourly, daily } = this.aggregateL2Costs(
        records,
        combinedHourlyMap,
        combinedDailyMap,
        nowToFullHour,
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

    return {
      projects,
      combined: this.getCombinedL2Costs(combinedHourlyMap, combinedDailyMap),
    }
  }

  aggregateL2Costs(
    records: AggregatedL2CostsRecord[],
    combinedHourlyMap: Map<number, L2CostsApiChartPoint>,
    combinedDailyMap: Map<number, L2CostsApiChartPoint>,
    nowToFullHour: UnixTime,
  ): Omit<L2CostsProjectApiCharts, 'syncedUntil'> {
    const hourlyMap = new Map<number, L2CostsApiChartPoint>()
    const dailyMap = new Map<number, L2CostsApiChartPoint>()

    for (const rec of records) {
      if (rec.timestamp.gt(nowToFullHour.add(-7, 'days'))) {
        addToMap(hourlyMap, 'hour', rec)
        addToMap(combinedHourlyMap, 'hour', rec)
      }
      if (rec.timestamp.lt(nowToFullHour.toStartOf('day'))) {
        addToMap(dailyMap, 'day', rec)
        addToMap(combinedDailyMap, 'day', rec)
      }
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
