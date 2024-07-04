import { Logger } from '@l2beat/backend-tools'
import { TrackedTxConfigEntry } from '@l2beat/shared'
import {
  L2CostsApiChart,
  L2CostsApiChartPoint,
  L2CostsApiResponse,
  L2CostsProjectApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'
import { Project } from '../../../../../model/Project'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { getSyncedUntil } from '../../utils/getSyncedUntil'
import {
  AggregatedL2CostsRecord,
  AggregatedL2CostsRepository,
} from '../repositories/AggregatedL2CostsRepository'

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
  indexerService: IndexerService
  aggregatedL2CostsRepository: AggregatedL2CostsRepository
  projects: Project[]
  logger?: Logger
}

export class L2CostsController {
  private readonly logger: Logger

  constructor(private readonly $: L2CostsControllerDeps) {
    this.logger = $.logger ? $.logger.for(this) : Logger.SILENT
  }

  async getL2Costs(): Promise<L2CostsApiResponse> {
    const projects: L2CostsApiResponse['projects'] = {}

    const combinedHourlyMap = new Map<number, L2CostsApiChartPoint>()
    const combinedDailyMap = new Map<number, L2CostsApiChartPoint>()

    const configurations =
      await this.$.indexerService.getSavedConfigurations<TrackedTxConfigEntry>(
        'tracked_txs_indexer',
      )

    const activeProjects = this.$.projects.filter((p) => !p.isArchived)
    for (const project of activeProjects) {
      if (!project.trackedTxsConfig) {
        continue
      }

      const projectRuntimeConfigIds = project.trackedTxsConfig
        .filter((c) => c.type === 'l2costs')
        .map((c) => c.id)
      const projectConfigs = configurations.filter((c) =>
        projectRuntimeConfigIds.includes(c.id),
      )

      if (projectConfigs.length === 0) {
        continue
      }

      const syncedUntil = getSyncedUntil(projectConfigs)
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
      if (rec.timestamp.gte(nowToFullHour.add(-7, 'days'))) {
        this.addToMap(hourlyMap, 'hour', rec)
        this.addToMap(combinedHourlyMap, 'hour', rec)
      }
      if (rec.timestamp.lt(nowToFullHour.toStartOf('day'))) {
        this.addToMap(dailyMap, 'day', rec)
        this.addToMap(combinedDailyMap, 'day', rec)
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

  private addToMap(
    map: Map<number, L2CostsApiChartPoint>,
    toStartOf: 'hour' | 'day',
    record: AggregatedL2CostsRecord,
  ) {
    const key = record.timestamp.toStartOf(toStartOf).toNumber()
    const currentRecord = map.get(key)

    if (currentRecord) {
      let currentBlobGas: number | null = currentRecord[13]
      let currentBlobGasEth: number | null = currentRecord[14]
      let currentBlobGasUsd: number | null = currentRecord[15]

      if (currentBlobGas === null) {
        currentBlobGas = record.blobsGas
      } else if (record.blobsGas) {
        currentBlobGas += record.blobsGas
      }

      if (currentBlobGasEth === null) {
        currentBlobGasEth = record.blobsGasEth
      } else if (record.blobsGasEth) {
        currentBlobGasEth += record.blobsGasEth
      }

      if (currentBlobGasUsd === null) {
        currentBlobGasUsd = record.blobsGasUsd
      } else if (record.blobsGasUsd) {
        currentBlobGasUsd += record.blobsGasUsd
      }

      map.set(key, [
        currentRecord[0],
        (currentRecord[1] += record.totalGas),
        (currentRecord[2] += record.totalGasEth),
        (currentRecord[3] += record.totalGasUsd),
        (currentRecord[4] += record.overheadGas),
        (currentRecord[5] += record.overheadGasEth),
        (currentRecord[6] += record.overheadGasUsd),
        (currentRecord[7] += record.calldataGas),
        (currentRecord[8] += record.calldataGasEth),
        (currentRecord[9] += record.calldataGasUsd),
        (currentRecord[10] += record.computeGas),
        (currentRecord[11] += record.computeGasEth),
        (currentRecord[12] += record.computeGasUsd),
        currentBlobGas,
        currentBlobGasEth,
        currentBlobGasUsd,
      ])
    } else {
      map.set(key, [
        new UnixTime(key),
        record.totalGas,
        record.totalGasEth,
        record.totalGasUsd,
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
  }
}
