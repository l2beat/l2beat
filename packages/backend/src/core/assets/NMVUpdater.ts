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
import { addArbTokenReport } from '../reports/custom/arbitrum'
import { addOpTokenReport } from '../reports/custom/optimism'

// Shas256 of "L2Beat Native Asset [Arbitrum, Optimism]"
export const NATIVE_ASSET_CONFIG_HASH = Hash256(
  '0xcb0de0a36a0369fe1e0c107bb217c4fd8e7142b5db33ffd01f29859ea323f52e',
)

export class NMVUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly knownSet = new Set<number>()

  constructor(
    private readonly priceUpdater: PriceUpdater,
    private readonly reportRepository: ReportRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)

    // Shas256 of "L2Beat Native Asset [Arbitrum, Optimism]"
    this.configHash = NATIVE_ASSET_CONFIG_HASH

    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: NMVUpdater.name,
      },
    )
  }

  async start() {
    const known = await this.reportStatusRepository.getByConfigHash(
      this.configHash,
      ChainId.NMV,
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
      chainId: ChainId.NMV,
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
    return this.reportRepository.getByTimestampAndPreciseAsset(
      timestamp,
      ChainId.NMV,
      ValueType.NMV,
    )
  }
}
