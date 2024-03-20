import { assert, Logger } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from '../tracked-txs/HourlyIndexer'
import { PriceRecord, PriceRepository } from './repositories/PriceRepository'
import { SyncOptimizer } from './SyncOptimizer'

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
    await this.initialize()
    await super.start()
    this.logger.debug('Started')
  }

  override async update(_from: number, _to: number): Promise<number> {
    this.logger.debug('Updating...')

    const from = new UnixTime(_from).toEndOf('hour')
    const to = new UnixTime(_to).toStartOf('hour')

    if (from.gt(to)) {
      return _to
    }

    const prices = await this.coingeckoQueryService.getUsdPriceHistoryHourly(
      this.token.coingeckoId,
      from,
      to,
      // TODO: either make it multichain or remove this fallback
      undefined,
    )

    const priceRecords: PriceRecord[] = prices
      // we filter out timestamps that would be deleted by TVL cleaner
      .filter((p) => this.syncOptimizer.shouldTimestampBeSynced(p.timestamp))
      .map((price) => ({
        chain: this.token.chain,
        address: this.token.address,
        timestamp: price.timestamp,
        priceUsd: price.value,
      }))

    await this.priceRepository.addMany(priceRecords)
    this.logger.debug('Updated')

    return _to
  }

  override async getSafeHeight(): Promise<number> {
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
    const indexerSafeHeight = Math.max(
      safeHeight,
      this.token.sinceTimestamp.toNumber(),
    )

    await this.stateRepository.setSafeHeight(
      this.indexerId,
      indexerSafeHeight,
      trx,
    )
  }

  async initialize() {
    this.logger.debug('Initializing...')

    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    if (indexerState === undefined) {
      await this.stateRepository.add({
        indexerId: this.indexerId,
        safeHeight: this.token.sinceTimestamp.toNumber(),
        minTimestamp: this.token.sinceTimestamp,
      })
      return
    }

    // We prevent updating the minimum timestamp of the indexer.
    // This functionality can be added in the future if needed.
    assert(
      indexerState.minTimestamp &&
        this.token.sinceTimestamp.equals(indexerState.minTimestamp),
      'Minimum timestamp of this indexer cannot be updated',
    )

    this.logger.debug('Initialized')
  }

  override async invalidate(targetHeight: number): Promise<number> {
    this.logger.debug('Invalidating...')

    await this.priceRepository.deleteBeforeInclusive(
      this.token.chain,
      this.token.address,
      new UnixTime(targetHeight),
    )

    this.logger.debug('Invalidated')

    return Promise.resolve(targetHeight)
  }
}
