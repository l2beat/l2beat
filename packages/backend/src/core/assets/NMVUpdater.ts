import { Logger } from '@l2beat/shared'
import {
  assert,
  ChainId,
  Hash256,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import {
  ReportRecord,
  ReportRepository,
} from '../../peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { TaskQueue } from '../queue/TaskQueue'
import { genArbTokenReport } from '../reports/custom/arbitrum'
import { genOpTokenReport } from '../reports/custom/optimism'
import { AssetUpdater } from './AssetUpdater'

// Shas256 of "L2Beat Native Asset [Arbitrum, Optimism]"
export const NATIVE_ASSET_CONFIG_HASH = Hash256(
  '0xcb0de0a36a0369fe1e0c107bb217c4fd8e7142b5db33ffd01f29859ea323f52e',
)

export class NMVUpdater implements AssetUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly knownSet = new Set<number>()

  constructor(
    private readonly priceUpdater: PriceUpdater,
    private readonly reportRepository: ReportRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly minTimestamp: UnixTime,
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

  getChainId() {
    return ChainId.NMV
  }

  getConfigHash() {
    return this.configHash
  }

  getMinTimestamp() {
    return this.minTimestamp
  }

  async start() {
    const known = await this.reportStatusRepository.getByConfigHash(
      this.configHash,
      this.getChainId(),
      ValueType.NMV,
    )

    for (const timestamp of known) {
      this.knownSet.add(timestamp.toNumber())
    }

    this.logger.info('Started')
    return this.clock.onEveryHour((timestamp) => {
      if (!this.knownSet.has(timestamp.toNumber())) {
        if (timestamp.gte(this.minTimestamp)) {
          // we add to front to sync from newest to oldest
          this.taskQueue.addToFront(timestamp)
        }
      }
    })
  }

  async update(timestamp: UnixTime) {
    assert(
      timestamp.gte(this.minTimestamp),
      'Timestamp cannot be smaller than minTimestamp',
    )

    this.logger.debug('Update started', { timestamp: timestamp.toNumber() })
    const prices = await this.priceUpdater.getPricesWhenReady(timestamp)
    this.logger.debug('Prices ready')

    const reports: ReportRecord[] = []
    reports.push(...genOpTokenReport(prices, timestamp))
    reports.push(...genArbTokenReport(prices, timestamp))

    await this.reportRepository.addOrUpdateMany(reports)

    // TODO(radomski): chainId should correctly represent OP/ARB
    await this.reportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
      chainId: this.getChainId(),
      valueType: ValueType.NMV,
    })

    this.knownSet.add(timestamp.toNumber())
    this.logger.info('Asset updated', { timestamp: timestamp.toNumber() })
  }

  async getReportsWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ): Promise<ReportRecord[]> {
    assert(
      timestamp.gte(this.minTimestamp),
      'Programmer error: requested timestamp does not exist',
    )

    while (!this.knownSet.has(timestamp.toNumber())) {
      this.logger.debug('Something is waiting for getReportsWhenReady', {
        timestamp: timestamp.toString(),
      })
      await setTimeout(refreshIntervalMs)
    }
    return this.reportRepository.getByTimestampAndPreciseAsset(
      timestamp,
      this.getChainId(),
      ValueType.NMV,
    )
  }
}
