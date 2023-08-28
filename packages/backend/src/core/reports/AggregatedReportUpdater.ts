import { Logger } from '@l2beat/shared'
import { Hash256, UnixTime } from '@l2beat/shared-pure'

import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../peripherals/database/AggregatedReportStatusRepository'
import { AssetUpdater } from '../assets/'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { aggregateReports } from './aggregateReports'
import { getAggregatedConfigHash } from './getAggregatedConfigHash'
import { ReportProject } from './ReportProject'

export class AggregatedReportUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly assetUpdaters: AssetUpdater[],
    private readonly aggregatedReportRepository: AggregatedReportRepository,
    private readonly aggregatedReportStatusRepository: AggregatedReportStatusRepository,
    private readonly clock: Clock,
    private readonly projects: ReportProject[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getAggregatedConfigHash(this.assetUpdaters)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: AggregatedReportUpdater.name,
      },
    )
  }

  getConfigHash() {
    return this.configHash
  }

  async start() {
    const known = await this.aggregatedReportStatusRepository.getByConfigHash(
      this.configHash,
    )
    const knownSet = new Set(known.map((x) => x.toNumber()))

    this.logger.info('Started')
    return this.clock.onEveryHour((timestamp) => {
      if (!knownSet.has(timestamp.toNumber())) {
        // we add to front to sync from newest to oldest
        this.taskQueue.addToFront(timestamp)
      }
    })
  }

  async update(timestamp: UnixTime) {
    this.logger.debug('Update started', { timestamp: timestamp.toNumber() })

    const reports = (
      await Promise.all(
        this.assetUpdaters
          .filter((updater) => timestamp.gte(updater.getMinTimestamp()))
          .map((updater) => updater.getReportsWhenReady(timestamp)),
      )
    ).flat()

    this.logger.debug('Reports ready')

    const aggregatedReports = aggregateReports(
      reports,
      this.projects,
      timestamp,
    )

    const nonZeroReports = aggregatedReports.filter((x) => x.usdValue > 0n)

    await this.aggregatedReportRepository.addOrUpdateMany(nonZeroReports)

    await this.aggregatedReportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
    })

    this.logger.info('Report updated', { timestamp: timestamp.toNumber() })
  }
}
