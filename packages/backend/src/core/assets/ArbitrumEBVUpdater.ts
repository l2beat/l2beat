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
import { BalanceUpdater } from '../balances/BalanceUpdater'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { TaskQueue } from '../queue/TaskQueue'
import { createEBVReports } from '../reports/createEBVReports'
import { getEBVConfigHash } from '../reports/getEBVConfigHash'
import { ReportProject } from '../reports/ReportProject'
import { TotalSupplyUpdater } from '../totalSupply/TotalSupplyUpdater'
import { AssetUpdater } from './AssetUpdater'
import { EBVToken } from './EBVToken'

export class ArbitrumEBVUpdater implements AssetUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly knownSet = new Set<number>()

  constructor(
    private readonly priceUpdater: PriceUpdater,
    private readonly balanceUpdater: BalanceUpdater,
    private readonly totalSupplyUpdater: TotalSupplyUpdater,
    private readonly reportRepository: ReportRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly clock: Clock,
    private readonly arbitrumProject: ReportProject[],
    private readonly tokens: EBVToken[],
    private readonly logger: Logger,
    private readonly minTimestamp: UnixTime,
  ) {
    this.logger = this.logger.for(this)
    assert(
      arbitrumProject.length === 1,
      'Expected there to be a single project when filtered',
    )
    this.configHash = getEBVConfigHash(this.arbitrumProject[0], this.tokens)

    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: ArbitrumEBVUpdater.name,
      },
    )
  }

  getChainId() {
    return ChainId.ARBITRUM
  }

  getConfigHash() {
    return this.configHash
  }

  getMinTimestamp() {
    return this.minTimestamp
  }

  getValueType() {
    return ValueType.EBV
  }

  async start() {
    const known = await this.reportStatusRepository.getByConfigHash(
      this.getConfigHash(),
      this.getChainId(),
      this.getValueType(),
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
    const [prices, balances, totalSupplies] = await Promise.all([
      this.priceUpdater.getPricesWhenReady(timestamp),
      this.balanceUpdater.getBalancesWhenReady(timestamp),
      this.totalSupplyUpdater.getTotalSuppliesWhenReady(timestamp),
    ])
    this.logger.debug('Prices, balances and supplies ready')

    const reports = createEBVReports(
      prices,
      balances,
      totalSupplies,
      this.tokens,
      this.arbitrumProject[0],
      this.getChainId(),
    )
    await this.reportRepository.addOrUpdateMany(reports)

    await this.reportStatusRepository.add({
      configHash: this.getConfigHash(),
      timestamp,
      chainId: this.getChainId(),
      valueType: this.getValueType(),
    })

    this.knownSet.add(timestamp.toNumber())
    this.logger.info('Report updated', { timestamp: timestamp.toNumber() })
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
      this.getValueType(),
    )
  }
}
