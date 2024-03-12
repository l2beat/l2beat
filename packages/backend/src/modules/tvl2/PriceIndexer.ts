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
    private readonly priceConfigEntry: PriceConfigEntry,
    private readonly syncService: SyncService,
  ) {
    super(logger, [parentIndexer])
    this.indexerId = `price_indexer_${
      priceConfigEntry.chain
    }_${priceConfigEntry.address.toString()}`
  }

  override async start(): Promise<void> {
    this.logger.info('Starting...')
    await this.initializeIndexerState()
    await super.start()
  }

  override async update(_from: number, _to: number): Promise<number> {
    const from = this.syncService.getTimestampToSync(new UnixTime(_from))
    const to = this.syncService.getTimestampToSync(from)

    const prices = await this.coingeckoQueryService.getUsdPriceHistory(
      this.priceConfigEntry.coingeckoId,
      from,
      to,
      this.priceConfigEntry.address === 'native'
        ? undefined
        : this.priceConfigEntry.address,
    )

    const priceRecords: PricesRecord[] = prices.map((price) => ({
      chain: this.priceConfigEntry.chain,
      address: this.priceConfigEntry.address,
      timestamp: price.timestamp,
      priceUsd: price.value,
    }))

    await this.pricesRepository.addMany(priceRecords)

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
    assert(
      safeHeight >= this.priceConfigEntry.sinceTimestamp.toNumber(),
      'Cannot set height to be lower than the minimum timestamp',
    )

    await this.stateRepository.setSafeHeight(this.indexerId, safeHeight, trx)
  }

  async initializeIndexerState() {
    const indexerState = await this.stateRepository.findIndexerState(
      this.indexerId,
    )

    if (indexerState === undefined) {
      await this.stateRepository.add({
        indexerId: this.indexerId,
        safeHeight: 0,
        minTimestamp: this.priceConfigEntry.sinceTimestamp,
      })
      return
    }

    // We prevent updating the minimum timestamp of the indexer.
    // This functionality can be added in the future if needed.
    assert(
      indexerState.minTimestamp &&
        this.priceConfigEntry.sinceTimestamp.equals(indexerState.minTimestamp),
      'Minimum timestamp of this indexer cannot be updated',
    )
  }

  /**
   * WARNING: this method does not do anything
   * 
    In our case there is no re-org handling so we do not have to worry
    that our data will become invalid.
    Also there is no need to handle the case when the server is randomly shut down during update,
    liveness configurations are storing the latest synced timestamp, so even if the server is shut down
    without setting new safeHeight. And although the next update will run on the already processed timestamp,
    the configuration's lastSyncedTimestamp will filter out already processed configurations
    and the data will not be fetched again
  **/
  override async invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
