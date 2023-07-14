import { Logger } from '@l2beat/shared'
import { Hash256, UnixTime } from '@l2beat/shared-pure'

import { AggregatedReportRepository } from '../../peripherals/database/AggregatedReportRepository'
import { AggregatedReportStatusRepository } from '../../peripherals/database/AggregatedReportStatusRepository'
import { NMVUpdater } from '../assets/NMVUpdater'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { aggregateReports } from './aggregateReports'
import { CBVUpdater } from './CBVUpdater'
import { getReportConfigHash } from './getReportConfigHash'
import { ReportProject } from './ReportProject'

export class AggregatedReportUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>

  constructor(
    private readonly reportUpdater: CBVUpdater,
    private readonly nativeAssetUpdater: NMVUpdater,
    private readonly aggregatedReportRepository: AggregatedReportRepository,
    private readonly aggregatedReportStatusRepository: AggregatedReportStatusRepository,
    private readonly clock: Clock,
    private readonly projects: ReportProject[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.configHash = getReportConfigHash(projects)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: AggregatedReportUpdater.name,
      },
    )
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
      await Promise.all([
        this.reportUpdater.getReportsWhenReady(timestamp),
        this.nativeAssetUpdater.getReportsWhenReady(timestamp),
      ])
    ).flat()
    this.logger.debug('Reports ready')

    const aggregatedReports = aggregateReports(
      reports,
      this.projects,
      timestamp,
    )

    await this.aggregatedReportRepository.addOrUpdateMany(aggregatedReports)

    await this.aggregatedReportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
    })

    this.logger.info('Report updated', { timestamp: timestamp.toNumber() })
  }
}
