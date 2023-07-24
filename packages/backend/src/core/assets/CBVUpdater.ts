import { Logger } from '@l2beat/shared'
import {
  assert,
  ChainId,
  Hash256,
  ProjectId,
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
import { createReports } from '../reports/createReports'
import { ARB_TOKEN_ID } from '../reports/custom/arbitrum'
import { OP_TOKEN_ID } from '../reports/custom/optimism'
import { getReportConfigHash } from '../reports/getReportConfigHash'
import { ReportProject } from '../reports/ReportProject'
import { AssetUpdater } from './AssetUpdater'

export class CBVUpdater implements AssetUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly knownSet = new Set<number>()

  constructor(
    private readonly priceUpdater: PriceUpdater,
    private readonly balanceUpdater: BalanceUpdater,
    private readonly reportRepository: ReportRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly clock: Clock,
    private readonly projects: ReportProject[],
    private readonly logger: Logger,
    private readonly minTimestamp: UnixTime,
  ) {
    this.logger = this.logger.for(this)
    // TODO(radomski): This config hash should be generated from only CBV projects
    this.configHash = getReportConfigHash(projects)
    this.taskQueue = new TaskQueue(
      (timestamp) => this.update(timestamp),
      this.logger.for('taskQueue'),
      {
        metricsId: CBVUpdater.name,
      },
    )
  }
  getChainId() {
    return ChainId.ETHEREUM
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
      ValueType.CBV,
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
    const [prices, balances] = await Promise.all([
      this.priceUpdater.getPricesWhenReady(timestamp),
      this.balanceUpdater.getBalancesWhenReady(timestamp),
    ])
    this.logger.debug('Prices and balances ready')

    let reports = createReports(
      prices,
      balances,
      this.projects,
      this.getChainId(),
    )
    // TODO(radomski): This really needs to be refactored
    reports = filterOutNVMReports(reports)

    await this.reportRepository.addOrUpdateMany(reports)

    await this.reportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
      chainId: this.getChainId(),
      valueType: ValueType.CBV,
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
      ValueType.CBV,
    )
  }
}

function filterOutNVMReports(reports: ReportRecord[]): ReportRecord[] {
  return reports.filter((r) => {
    const isOpNative =
      r.asset === OP_TOKEN_ID && r.projectId === ProjectId.OPTIMISM
    const isArbNative =
      r.asset === ARB_TOKEN_ID && r.projectId === ProjectId.ARBITRUM
    return !isOpNative && !isArbNative
  })
}
