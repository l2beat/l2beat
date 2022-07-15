import {
  ApiMain,
  AssetId,
  Chart,
  ChartPoint,
  Logger,
  Project,
  ProjectId,
  TaskQueue,
  UnixTime,
} from '@l2beat/common'

import { Token } from '../../../model'
import { ProjectInfo } from '../../../model/ProjectInfo'
import {
  AggregateReportRecord,
  AggregateReportRepository,
} from '../../../peripherals/database/AggregateReportRepository'
import { CachedDataRepository } from '../../../peripherals/database/CachedDataRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
import { addOptimismToken, addOptimismTokenV2 } from './addOptimismToken'
import {
  aggregateReportsDaily,
  aggregateReportsDailyV2,
} from './aggregateReportsDaily'
import { asNumber } from './asNumber'
import { filterReportsByProjects } from './filter/filterReportsByProjects'
import { getSufficientlySynced } from './filter/getSufficientlySynced'
import { generateApiMain, generateReportOutput } from './generateReportOutput'

function getDailyTimestamps(min: UnixTime, max: UnixTime) {
  const timestamps: UnixTime[] = []
  for (let t = min; !t.gt(max); t = t.add(1, 'days')) {
    timestamps.push(t)
  }
  return timestamps
}

function insertAt<T>(arr: T[], i: number, el: T): T[] {
  return [...arr.slice(0, i), el, ...arr.slice(i + 1)]
}

function addMissingTimestamps(points: ChartPoint[]): ChartPoint[] {
  const [min] = points[0]
  const [max] = points[points.length - 1]
  const daily = getDailyTimestamps(min, max)

  return daily.reduce((acc, timestamp, i) => {
    const [currTimestamp] = acc[i]
    if (currTimestamp.equals(timestamp)) {
      return acc
    }
    const [, prev1, prev2] = acc[i - 1]
    return insertAt(acc, i, [timestamp, prev1, prev2])
  }, points)
}

function getProjectDailyChartData(
  reports: AggregateReportRecord[],
  projectId: ProjectId,
): ChartPoint[] {
  const existing: ChartPoint[] = reports
    .filter((r) => r.projectId === projectId)
    .map((r) => [r.timestamp, asNumber(r.tvlUsd, 2), asNumber(r.tvlEth, 6)])
  return addMissingTimestamps(existing)
}

export class ReportController {
  private taskQueue: TaskQueue<void>

  constructor(
    private reportStatusRepository: ReportStatusRepository,
    private aggregateReportRepository: AggregateReportRepository,
    private reportRepository: ReportRepository,
    private cacheRepository: CachedDataRepository,
    private priceRepository: PriceRepository,
    private projects: ProjectInfo[],
    private tokens: Token[],
    private logger: Logger,
    private interval: number = 5 * 60 * 1000,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      async () => this.generateAndCache(),
      this.logger,
    )
  }

  start() {
    this.taskQueue.addIfEmpty()
    setInterval(() => this.taskQueue.addIfEmpty(), this.interval)
  }

  async getDaily() {
    return this.cacheRepository.getData()
  }

  async getMain(): Promise<ApiMain | undefined> {
    const latestTimestamp =
      await this.reportStatusRepository.findLatestTimestamp()
    if (!latestTimestamp) {
      return undefined
    }
    const [aggregateReports, tokenBreakdown] = await Promise.all([
      this.aggregateReportRepository.getDaily(),
      this.reportRepository.getByTimestamp(latestTimestamp),
    ])

    const apiMain: ApiMain = {
      charts: {
        daily: {
          types: ['timestamp', 'usd', 'eth'],
          data: getProjectDailyChartData(aggregateReports, ProjectId.ALL),
        },
      },
      projects: {},
    }

    for (const p of this.projects) {
      const project: Project = {
        charts: {
          daily: {
            types: ['timestamp', 'usd', 'eth'],
            data: getProjectDailyChartData(aggregateReports, p.projectId),
          },
        },
        tokens: tokenBreakdown
          .filter((r) => r.projectId === p.projectId)
          .map((r) => ({ assetId: r.asset, tvl: asNumber(r.balanceUsd, 2) })),
      }
      apiMain.projects[p.name] = project
    }

    return apiMain
  }

  async generateAndCache() {
    this.logger.info('Daily report started')
    const reports = await this.getReports()
    await this.cacheRepository.saveData(await this.generateDaily(reports))
    await this.cacheRepository.saveMain(await this.generateMain(reports))
    this.logger.info('Daily report saved')
  }

  async getReports() {
    let reports = await this.reportRepository.getDaily()
    reports = filterReportsByProjects(reports, this.projects)
    reports = getSufficientlySynced(reports)
    return reports
  }

  async generateDaily(reports: ReportRecord[]) {
    const dailyEntries = aggregateReportsDaily(reports, this.projects)
    await addOptimismToken(dailyEntries, this.priceRepository)
    return generateReportOutput(dailyEntries, this.projects)
  }

  async generateMain(reports: ReportRecord[]): Promise<ApiMain> {
    const dailyEntries = aggregateReportsDailyV2(reports, this.projects)
    await addOptimismTokenV2(dailyEntries, this.priceRepository)
    return generateApiMain(dailyEntries, this.projects)
  }

  async getProjectAssetChart(
    projectId: ProjectId,
    assetId: AssetId,
  ): Promise<Chart | undefined> {
    const project = this.projects.find((p) => p.projectId === projectId)
    const asset = this.tokens.find((t) => t.id === assetId)
    if (!project || !asset) {
      return undefined
    }
    const reports = await this.reportRepository.getDailyByProjectAndAsset(
      projectId,
      assetId,
    )
    return {
      types: ['timestamp', asset.symbol.toLowerCase(), 'usd'],
      data: reports.map((r) => [
        r.timestamp,
        +asNumber(r.balance, asset.decimals).toFixed(6),
        asNumber(r.balanceUsd, 2),
      ]),
    }
  }
}
