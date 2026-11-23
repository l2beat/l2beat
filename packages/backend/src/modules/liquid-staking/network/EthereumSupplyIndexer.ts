import type { Logger } from '@l2beat/backend-tools'
import type { Database, EthereumSupplyDailyRecord } from '@l2beat/database'
import {
  approximateCirculatingSupply,
  type CoingeckoClient,
  type CoinMarketChartRangeData,
} from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'

const ETHEREUM = CoingeckoId('ethereum')
const DAY = UnixTime.DAY
/** A day's start takes the nearest point at most this far from midnight. */
const MAX_DISTANCE = UnixTime.HOUR
/** CoinGecko serves hourly points for ranges of up to 90 days. */
const MAX_DAYS = 60

/** Bump it when a fix changes what past days store. */
const STORED_DATA_VERSION = '1'

interface EthereumSupplyIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name' | 'minHeight'> {
  /** The first day stored. */
  firstDay: UnixTime
  db: Database
  coingecko: Pick<CoingeckoClient, 'getCoinMarketChartRange'>
}

/**
 * ETH's supply as each UTC day starts: CoinGecko's market cap over its price,
 * both read at one time near midnight. Like the staking indexer, a day is
 * stored once it has ended and a height is the end of the last stored day.
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
        minHeight: $.firstDay + DAY,
        configHash: STORED_DATA_VERSION,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    const first = UnixTime(UnixTime.toEndOf(UnixTime(from), 'day') - DAY)
    const last = UnixTime(Math.min(to - DAY, first + (MAX_DAYS - 1) * DAY))

    const data = await this.$.coingecko.getCoinMarketChartRange(
      ETHEREUM,
      'usd',
      UnixTime(first - MAX_DISTANCE),
      UnixTime(last + MAX_DISTANCE),
    )
    const records = toDailySupplies(data, first, last)
    const lastStored = records.at(-1)?.timestamp
    // None yet, or CoinGecko is down: ask again rather than skip ahead.
    if (lastStored === undefined) {
      throw new Error('No ETH supply from CoinGecko', {
        cause: { first, last },
      })
    }
    // A day before a stored one without a point stays empty for good, as
    // CoinGecko's history won't change.
    const missing = (lastStored - first) / DAY + 1 - records.length
    if (missing > 0) {
      this.logger.error('ETH supply missing on some days', {
        first,
        lastStored,
        missing,
      })
    }

    await this.$.db.ethereumSupplyDaily.upsertMany(records)
    this.logger.info('Saved ETH supply', { first, lastStored })
    return lastStored + DAY
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.ethereumSupplyDaily.deleteAfter(
      UnixTime(targetHeight - DAY),
    )
    return targetHeight
  }
}

/**
 * For each day from `first` to `last`, the supply at the point nearest its
 * start, within MAX_DISTANCE, from that point's own price and market cap. A
 * day without such a point, or whose point gives no positive supply, has no
 * record.
 */
export function toDailySupplies(
  data: CoinMarketChartRangeData,
  first: UnixTime,
  last: UnixTime,
): EthereumSupplyDailyRecord[] {
  const marketCaps = new Map(
    data.marketCaps.map((point) => [point.date.getTime(), point.value]),
  )
  const points = data.prices.flatMap((price) => {
    const marketCap = marketCaps.get(price.date.getTime())
    if (marketCap === undefined) return []
    const supply = approximateCirculatingSupply(marketCap, price.value)
    return Number.isFinite(supply) && supply > 0
      ? [{ timestamp: UnixTime.fromDate(price.date), supply }]
      : []
  })
  const records: EthereumSupplyDailyRecord[] = []
  for (let day = first; day <= last; day = UnixTime(day + DAY)) {
    const nearest = points
      .filter((point) => Math.abs(point.timestamp - day) <= MAX_DISTANCE)
      .sort(
        (a, b) => Math.abs(a.timestamp - day) - Math.abs(b.timestamp - day),
      )[0]
    if (nearest) records.push({ timestamp: day, supply: nearest.supply })
  }
  return records
}
