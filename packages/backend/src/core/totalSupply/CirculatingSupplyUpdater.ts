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

import { UpdaterStatus } from '../../api/controllers/status/view/TvlStatusPage'
import { CoingeckoQueryService } from '../../peripherals/coingecko/CoingeckoQueryService'
import {
  CirculatingSupplyRecord,
  CirculatingSupplyRepository,
  DataBoundary,
} from '../../peripherals/database/CirculatingSupplyRepository'
import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { getStatus } from '../reports/getStatus'

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
  ) {
    this.logger = this.logger.for(
      `${this.constructor.name}.${ChainId.getName(chainId)}`,
    )
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

  getStatus(): UpdaterStatus {
    return getStatus(
      this.constructor.name,
      this.clock.getFirstHour(),
      this.clock.getLastHour(),
      this.knownSet,
    )
  }

  async getCirculatingSuppliesWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs = 1000,
  ) {
    while (!this.knownSet.has(timestamp.toNumber())) {
      this.logger.debug(
        'Something is waiting for getCirculatingSuppliesWhenReady',
        {
          timestamp: timestamp.toString(),
        },
      )
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
    const from = this.clock.getFirstHour()
    const to = this.clock.getLastHour()

    this.logger.info('Update started', { timestamp: to.toNumber() })

    // this data will be needed to determine from which timestamp to sync
    // if the boundary is undefined, we sync all the possible data from Coingecko
    const boundaries =
      await this.circulatingSupplyRepository.findDataBoundaries()

    const results = await Promise.allSettled(
      this.tokens.map(({ id: assetId, address }) => {
        const boundary = boundaries.get(assetId)
        return this.updateToken(assetId, boundary, to, address)
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
    to: UnixTime,
    address?: EthereumAddress,
  ) {
    if (boundary === undefined) {
      // pass undefined which means "sync as much as possible"
      await this.fetchAndSave(assetId, undefined, to, address)
    } else {
      if (to.gt(boundary.latest)) {
        const firstUnknown = boundary.latest.add(1, 'hours')
        await this.fetchAndSave(assetId, firstUnknown, to, address)
      }
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
    from: UnixTime | undefined,
    to: UnixTime,
    address?: EthereumAddress,
  ) {
    const coingeckoId = this.getCoingeckoId(assetId)

    const circulatingSupplies =
      await this.coingeckoQueryService.getCirculatingSupplies(
        coingeckoId,
        { from, to },
        address,
      )

    assert(
      circulatingSupplies.length > 0,
      this.getAssertMessage(assetId, from, to),
    )

    const records: CirculatingSupplyRecord[] = circulatingSupplies.map(
      (circulatingSupply) => ({
        assetId,
        timestamp: circulatingSupply.timestamp,
        circulatingSupply: circulatingSupply.value,
        chainId: this.chainId,
      }),
    )

    await this.circulatingSupplyRepository.addMany(records)

    this.logger.info('Fetched & Saved', {
      asset: assetId.toString(),
      records: circulatingSupplies.length,
    })
  }

  private getAssertMessage(
    assetId: AssetId,
    from: UnixTime | undefined,
    to: UnixTime,
  ): string | undefined {
    return `Programmer error: Circulating supplies should not be empty there. 
    Asset: ${assetId.toString()}, chain: ${this.chainId.toString()}, 
    ${from ? ` from: ${from.toNumber()},` : ''} to: ${to.toNumber()}`
  }
}
