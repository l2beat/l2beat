import { Logger } from '@l2beat/shared'
import { assert, AssetId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import { Token } from '../model'
import { CoingeckoQueryService } from '../peripherals/coingecko/CoingeckoQueryService'
import {
  DataBoundary,
  PriceRecord,
  PriceRepository,
} from '../peripherals/database/PriceRepository'
import { Clock } from './Clock'
import { TaskQueue } from './queue/TaskQueue'

export class PriceUpdater {
  private readonly knownSet = new Set<number>()
  private readonly taskQueue: TaskQueue<void>

  constructor(
    private readonly coingeckoQueryService: CoingeckoQueryService,
    private readonly priceRepository: PriceRepository,
    private readonly clock: Clock,
    private readonly tokens: Token[],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      () => this.update(),
      this.logger.for('taskQueue'),
      {
        metricsId: PriceUpdater.name,
      },
    )
  }

  async getPricesWhenReady(timestamp: UnixTime, refreshIntervalMs = 1000) {
    while (!this.knownSet.has(timestamp.toNumber())) {
      await setTimeout(refreshIntervalMs)
    }
    return this.priceRepository.getByTimestamp(timestamp)
  }

  start() {
    this.taskQueue.addToFront()
    this.logger.info('Started')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  async update() {
    const from = this.clock.getFirstHour()
    const to = this.clock.getLastHour()

    this.logger.info('Update started', { timestamp: to.toNumber() })

    const boundaries = await this.priceRepository.findDataBoundaries()

    const results = await Promise.allSettled(
      this.tokens.map(({ id: assetId, address }) => {
        const boundary = boundaries.get(assetId)
        return this.updateToken(assetId, boundary, from, to, address)
      }),
    )
    const error = results.find((x) => x.status === 'rejected')
    if (error && error.status === 'rejected') {
      throw error.reason
    }

    for (let t = from; t.lte(to); t = t.add(1, 'hours')) {
      this.knownSet.add(t.toNumber())
    }
    this.logger.info('Update completed', { timestamp: to.toNumber() })
  }

  async updateToken(
    assetId: AssetId,
    boundary: DataBoundary | undefined,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ) {
    let hours = 0
    const hourDiff = (from: UnixTime, to: UnixTime) =>
      Math.floor((to.toNumber() - from.toNumber()) / 3_600) + 1
    if (boundary === undefined) {
      await this.fetchAndSave(assetId, from, to, address)
      hours += hourDiff(from, to)
    } else {
      if (from.lt(boundary.earliest)) {
        const lastUnknown = boundary.earliest.add(-1, 'hours')
        await this.fetchAndSave(assetId, from, lastUnknown, address)
        hours += hourDiff(from, lastUnknown)
      }
      if (to.gt(boundary.latest)) {
        const firstUnknown = boundary.latest.add(1, 'hours')
        await this.fetchAndSave(assetId, firstUnknown, to, address)
        hours += hourDiff(firstUnknown, to)
      }
    }
    if (hours > 0) {
      this.logger.debug('Updated prices', {
        coingeckoId: assetId.toString(),
        hours,
      })
    }
  }
  private getCoingeckoId(assetId: AssetId) {
    const coingeckoId = this.tokens.find(
      (token) => token.id === assetId,
    )?.coingeckoId
    assert(coingeckoId, 'Incorrect asset ID')

    return coingeckoId
  }

  async fetchAndSave(
    assetId: AssetId,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ) {
    const coingeckoId = this.getCoingeckoId(assetId)
    const prices = await this.coingeckoQueryService.getUsdPriceHistory(
      coingeckoId,
      // Make sure that we have enough old data to fill holes
      from.add(-7, 'days'),
      to,
      'hourly',
      address,
    )
    const priceRecords: PriceRecord[] = prices
      .filter((x) => x.timestamp.gte(from))
      .map((price) => ({
        assetId,
        timestamp: price.timestamp,
        priceUsd: price.value,
      }))

    await this.priceRepository.addMany(priceRecords)
  }
}
