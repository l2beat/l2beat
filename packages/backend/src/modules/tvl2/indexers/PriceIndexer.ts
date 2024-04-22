import { assert, Logger } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { PriceRecord, PriceRepository } from '../repositories/PriceRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export class PriceIndexer extends ChildIndexer {
  indexerId: string

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly coingeckoQueryService: CoingeckoQueryService,
    private readonly stateRepository: IndexerStateRepository,
    private readonly priceRepository: PriceRepository,
    private readonly token: PriceConfigEntry,
    private readonly syncOptimizer: SyncOptimizer,
  ) {
    super(logger, [parentIndexer])
    this.indexerId = `price_indexer_${token.chain}_${token.address.toString()}`
  }

  override async start(): Promise<void> {
    this.logger.debug('Starting...')
    await super.start()
    this.logger.debug('Started')
  }

  override async update(_from: number, _to: number): Promise<number> {
    _from -= 1 // TODO: refactor logic after uif update
    this.logger.debug('Updating...')

    const from = this.getAdjustedFrom(_from)
    const to = this.getAdjustedTo(from, _to)

    const prices = await this.fetchAndOptimizePrices(from, to)

    await this.priceRepository.addMany(prices)

    this.logger.debug('Updated')
    return to.toNumber()
  }

  private getAdjustedFrom(_from: number): UnixTime {
    return this.token.sinceTimestamp.gt(new UnixTime(_from))
      ? // first sync of indexer
        this.token.sinceTimestamp.toEndOf('hour')
      : // "from" is treated as inclusive, we already have data for it
        new UnixTime(_from).toNext('hour')
  }

  private getAdjustedTo(from: UnixTime, _to: number): UnixTime {
    const to = new UnixTime(_to).toStartOf('hour')
    assert(from.lte(to), 'Programmer error: from > to')

    const maxDaysForOneCall = CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL

    return to.gt(from.add(maxDaysForOneCall, 'days'))
      ? from.add(maxDaysForOneCall, 'days')
      : to
  }

  private async fetchAndOptimizePrices(
    from: UnixTime,
    to: UnixTime,
  ): Promise<PriceRecord[]> {
    const prices = await this.coingeckoQueryService.getUsdPriceHistoryHourly(
      this.token.coingeckoId,
      from,
      to,
      undefined,
    )

    return prices
      .filter((p) => this.syncOptimizer.shouldTimestampBeSynced(p.timestamp))
      .map((price) => ({
        chain: this.token.chain,
        address: this.token.address,
        timestamp: price.timestamp,
        priceUsd: price.value,
      }))
  }

  override async initialize(): Promise<number> {
    await this.doInitialize()
    return await this.getSafeHeight()
  }

  async getSafeHeight(): Promise<number> {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )
    assert(indexerState, 'Indexer state should be initialized')

    return indexerState?.safeHeight
  }

  override async setSafeHeight(
    safeHeight: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.stateRepository.setSafeHeight(this.indexerId, safeHeight, trx)
  }

  async doInitialize() {
    this.logger.debug('Initializing...')

    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    if (indexerState === undefined) {
      await this.stateRepository.add({
        indexerId: this.indexerId,
        safeHeight: 0,
        minTimestamp: this.token.sinceTimestamp,
      })
      return
    }

    this.logger.debug('Initialized')
  }

  override async invalidate(targetHeight: number): Promise<number> {
    this.logger.debug('Invalidating...')

    await this.priceRepository.deleteAfterExclusive(
      this.token.chain,
      this.token.address,
      new UnixTime(targetHeight),
    )

    this.logger.debug('Invalidated')

    return Promise.resolve(targetHeight)
  }
}
