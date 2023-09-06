import { Logger } from '@l2beat/shared'
import {
  assert,
  ChainId,
  Hash256,
  hashJson,
  UnixTime,
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

// Last updated because: updated OP token balance
const LOGIC_VERSION = 1
export const NATIVE_ASSET_CONFIG_HASH = hashJson(LOGIC_VERSION)

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
      'NMV',
    )
  }
}
