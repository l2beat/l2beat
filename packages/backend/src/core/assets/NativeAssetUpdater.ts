import { Logger } from '@l2beat/shared'
import {
  assert,
  ChainId,
  Hash256,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { Clock } from '../Clock'
import { PriceUpdater } from '../PriceUpdater'
import { TaskQueue } from '../queue/TaskQueue'
import {
  addArbTokenAsset,
  ARBITRUM_PROJECT_ID,
} from '../reports/custom/arbitrum'
import {
  addOpTokenAsset,
  OPTIMISM_PROJECT_ID,
} from '../reports/custom/optimism'
import { getReportConfigHash } from '../reports/getReportConfigHash'
import { ReportProject } from '../reports/ReportProject'
import { Asset } from './Asset'

export class NativeAssetUpdater {
  private readonly configHash: Hash256
  private readonly taskQueue: TaskQueue<UnixTime>
  private readonly knownSet = new Set<number>()
  private readonly assetMap: Record<number, Asset[]> = {}

  constructor(
    private readonly priceUpdater: PriceUpdater,
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

    const assets: Asset[] = []
    assets.concat(addOpTokenAsset(prices, timestamp))
    assets.concat(addArbTokenAsset(prices, timestamp))

    this.assetMap[timestamp.toNumber()] = assets

    await this.reportStatusRepository.add({
      configHash: this.configHash,
      timestamp,
      chainId: ChainId.ETHEREUM,
      valueType: ValueType.NMV,
    })

    this.knownSet.add(timestamp.toNumber())
    this.logger.info('Asset updated', { timestamp: timestamp.toNumber() })
  }

  async getAssetsWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ): Promise<Asset[]> {
    while (!this.knownSet.has(timestamp.toNumber())) {
      await setTimeout(refreshIntervalMs)
    }

    assert(
      // NOTE(radomski): Eslint thinks that this can't be undefined
      // eslint-disable-next-line
      this.assetMap[timestamp.toNumber()] !== undefined,
      'Expected assets to be present',
    )
    return this.assetMap[timestamp.toNumber()]
  }
}
