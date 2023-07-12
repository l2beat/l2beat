import { Logger } from '@l2beat/shared'
import { ChainId, Hash256, UnixTime, ValueType } from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import {
  ReportRecord,
  ReportRepository,
} from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { TaskQueue } from '../queue/TaskQueue'
import {
  addArbTokenReport,
  ARBITRUM_PROJECT_ID,
} from '../reports/custom/arbitrum'
import {
  addOpTokenReport,
  OPTIMISM_PROJECT_ID,
} from '../reports/custom/optimism'
import { getReportConfigHash } from '../reports/getReportConfigHash'
import { ReportProject } from '../reports/ReportProject'

export class NativeAssetUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly knownSet = new Set<number>()

  constructor(
    private readonly priceUpdater: PriceUpdater,
    private readonly reportRepository: ReportRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly clock: Clock,
    private readonly projects: ReportProject[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.projects = this.projects.filter(
      (p) =>
        p.projectId === OPTIMISM_PROJECT_ID ||
        p.projectId === ARBITRUM_PROJECT_ID,
    )
    this.configHash = getReportConfigHash(this.projects)

    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: NativeAssetUpdater.name,
      },
    )
  }

  async start() {
    const known = await this.reportStatusRepository.getByConfigHash(
      this.configHash,
      ChainId.ETHEREUM,
      ValueType.NMV,
    )

    for (const timestamp of known) {
      this.knownSet.add(timestamp.toNumber())
    }

    this.logger.info('Started')
    return this.clock.onEveryHour((timestamp) => {
      if (!this.knownSet.has(timestamp.toNumber())) {
        // we add to front to sync from newest to oldest
        this.taskQueue.addToFront(timestamp)
      }
    })
  }

  async update(timestamp: UnixTime) {
    this.logger.debug('Update started', { timestamp: timestamp.toNumber() })
    const prices = await this.priceUpdater.getPricesWhenReady(timestamp)
    this.logger.debug('Prices ready')

    const reports: ReportRecord[] = []
    reports.push(...addOpTokenReport(prices, timestamp))
    reports.push(...addArbTokenReport(prices, timestamp))

    await this.reportRepository.addOrUpdateMany(reports)

    // TODO(radomski): chainId should correctly represent OP/ARB
    await this.reportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
      chainId: ChainId.ETHEREUM,
      valueType: ValueType.NMV,
    })

    this.knownSet.add(timestamp.toNumber())
    this.logger.info('Asset updated', { timestamp: timestamp.toNumber() })
  }

  async getReportsWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ): Promise<ReportRecord[]> {
    while (!this.knownSet.has(timestamp.toNumber())) {
      await setTimeout(refreshIntervalMs)
    }
    return this.reportRepository.getByTimestampAndAssetType(
      timestamp,
      ValueType.NMV,
    )
  }
}
