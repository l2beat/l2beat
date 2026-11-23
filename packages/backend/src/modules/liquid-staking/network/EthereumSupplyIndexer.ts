import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { CirculatingSupplyProvider } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'

const ETHEREUM = CoingeckoId('ethereum')

/** Bump it when a fix changes what past days store. */
const STORED_DATA_VERSION = '1'

interface EthereumSupplyIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name' | 'minHeight'> {
  /** The first day stored. */
  firstDay: UnixTime
  db: Database
  circulatingSupply: Pick<
    CirculatingSupplyProvider,
    'getCirculatingSupplies' | 'getAdjustedTo'
  >
}

/**
 * ETH's supply as each UTC day starts, which CoinGecko knows once the day
 * has started. A height is the start of the last stored day.
 */
export class EthereumSupplyIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: EthereumSupplyIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.ETHEREUM_SUPPLY,
        minHeight: $.firstDay,
        configHash: STORED_DATA_VERSION,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    const first = UnixTime.toEndOf(UnixTime(from), 'day')
    const last = UnixTime.toStartOf(
      this.$.circulatingSupply.getAdjustedTo(first, to),
      'day',
    )

    // Hourly points; the day's value is the one at its start.
    const supplies = await this.$.circulatingSupply.getCirculatingSupplies(
      ETHEREUM,
      { from: first, to: last },
    )
    const records = supplies
      .filter((point) => UnixTime.isFull(point.timestamp, 'day'))
      .map((point) => ({ timestamp: point.timestamp, supply: point.value }))

    await this.$.db.ethereumSupplyDaily.upsertMany(records)
    this.logger.info('Saved ETH supply', { from: first, to: last })
    return last
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.ethereumSupplyDaily.deleteAfter(UnixTime(targetHeight))
    return targetHeight
  }
}
