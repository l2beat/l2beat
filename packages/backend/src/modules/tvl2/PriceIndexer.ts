import { assert, Logger } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import { PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { Knex } from 'knex'

import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { HourlyIndexer } from '../liveness/HourlyIndexer'
import { PricesRecord, PricesRepository } from './repositories/PricesRepository'
import { SyncService } from './SyncService'

export class PriceIndexer extends ChildIndexer {
  indexerId: string

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly coingeckoQueryService: CoingeckoQueryService,
    private readonly stateRepository: IndexerStateRepository,
    private readonly pricesRepository: PricesRepository,
    private readonly token: PriceConfigEntry,
    private readonly syncService: SyncService,
  ) {
    super(logger, [parentIndexer])
    this.indexerId = `price_indexer_${token.chain}_${token.address.toString()}`
  }

  override async start(): Promise<void> {
    this.logger.info('Starting...')
    await this.initialize()
    await super.start()
    this.logger.info('Started')
  }

  override async update(_from: number, _to: number): Promise<number> {
    this.logger.info('Updating...')

    const from = this.syncService.getTimestampToSync(
      this.token.chain,
      new UnixTime(_from),
      'from',
    )

    // Edge case when scheduled update is before the minimum timestamp of token/chain
    if (from.gt(new UnixTime(_to))) {
      return _to
    }

    const to = this.syncService.getTimestampToSync(
      this.token.chain,
      new UnixTime(_to),
      'to',
    )

    assert(from.lte(to), 'Programmer error: Invalid range')

    const prices = await this.coingeckoQueryService.getUsdPriceHistoryHourly(
      this.token.coingeckoId,
      from,
      to,
      this.token.address === 'native' ? undefined : this.token.address,
    )

    const priceRecords: PricesRecord[] = prices
      // we filter out timestamps that would be deleted by TVL cleaner
      // performance is not a big issue as we download 80 days worth of prices at once
      .filter((p) =>
        this.syncService.shouldTimestampBeSynced(this.token.chain, p.timestamp),
      )
      .map((price) => ({
        chain: this.token.chain,
        address: this.token.address,
        timestamp: price.timestamp,
        priceUsd: price.value,
      }))

    await this.pricesRepository.addMany(priceRecords)

    this.logger.info('Updated')

    return to.toNumber()
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
    this.logger.info('Initializing...')

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

    this.logger.info('Initialized')
  }

  override async invalidate(targetHeight: number): Promise<number> {
    this.logger.info('Invalidating...')

    await this.pricesRepository.deleteBeforeInclusive(
      this.token.chain,
      this.token.address,
      new UnixTime(targetHeight),
    )

    this.logger.info('Invalidated')

    return Promise.resolve(targetHeight)
  }
}
