import { Logger } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ChainId,
  EthereumAddress,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { setTimeout } from 'timers/promises'

import { CoingeckoQueryService } from '../../peripherals/coingecko/CoingeckoQueryService'
import {
  CirculatingSupplyRecord,
  CirculatingSupplyRepository,
  DataBoundary,
} from '../../peripherals/database/CirculatingSupplyRepository'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'

export class CirculatingSupplyUpdater {
  private readonly knownSet = new Set<number>()
  private readonly taskQueue: TaskQueue<void>

  constructor(
    private readonly coingeckoQueryService: CoingeckoQueryService,
    private readonly circulatingSupplyRepository: CirculatingSupplyRepository,
    private readonly clock: Clock,
    private readonly tokens: Token[],
    private readonly chainId: ChainId,
    private readonly logger: Logger,
    private readonly minTimestamp: UnixTime,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      () => this.update(),
      this.logger.for('taskQueue'),
      {
        metricsId: CirculatingSupplyUpdater.name,
      },
    )
    assert(
      tokens.every(
        (token) =>
          token.chainId === this.chainId &&
          token.formula === 'circulatingSupply',
      ),
      'Programmer error: all tokens must be using circulatingSupply formula and have the same chainId',
    )
  }

  async getCirculatingSuppliesWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ) {
    while (!this.knownSet.has(timestamp.toNumber())) {
      await setTimeout(refreshIntervalMs)
    }
    return this.circulatingSupplyRepository.getByTimestamp(
      this.chainId,
      timestamp,
    )
  }

  start() {
    this.taskQueue.addToFront()
    this.logger.info('Started')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  async update() {
    const from = this.clock.getFirstHour().gt(this.minTimestamp)
      ? this.clock.getFirstHour()
      : this.minTimestamp
    const to = this.clock.getLastHour()

    this.logger.info('Update started', { timestamp: to.toNumber() })

    const boundaries =
      await this.circulatingSupplyRepository.findDataBoundaries()

    const results = await Promise.allSettled(
      this.tokens.map(({ id: assetId, address, sinceTimestamp }) => {
        const boundary = boundaries.get(assetId)
        const adjustedFrom = sinceTimestamp.gt(from) ? sinceTimestamp : from
        return this.updateToken(assetId, boundary, adjustedFrom, to, address)
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
      this.logger.debug('Updated circulating supplies', {
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
    const circulatingSupplies =
      await this.coingeckoQueryService.getCirculatingSupplies(
        coingeckoId,
        // Make sure that we have enough old data to fill holes
        from.add(-7, 'days'),
        to,
        'hourly',
        address,
      )
    const records: CirculatingSupplyRecord[] = circulatingSupplies
      .filter((x) => x.timestamp.gte(from))
      .map((circulatingSupply) => ({
        assetId,
        timestamp: circulatingSupply.timestamp,
        circulatingSupply: circulatingSupply.value,
        chainId: this.chainId,
      }))

    await this.circulatingSupplyRepository.addOrUpdateMany(records)
  }
}
