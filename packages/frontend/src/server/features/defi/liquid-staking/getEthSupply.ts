import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getLogger } from '~/server/utils/logger'

export interface EthSupply {
  /** ETH in existence; for ETH, CoinGecko's circulating supply is the total. */
  value: number
  /** When CoinGecko last updated it. */
  timestamp: number
}

/** The supply moves by a few thousand ETH a day, so an hour-old value is fine. */
const MAX_AGE = UnixTime.HOUR
/** After a failed request, wait this long before asking again. */
const RETRY_AFTER = 5 * UnixTime.MINUTE
/** The first day of the liquid staking charts. */
const HISTORY_START = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))
/** The free API serves the past 365 days only. */
const FREE_HISTORY_DAYS = 364
const MOCK_ETH_SUPPLY = 120_700_000
const ETHEREUM = CoingeckoId('ethereum')

let client: CoingeckoClient | undefined

/**
 * ETH's total supply, from CoinGecko. Kept in memory between requests; null
 * when CoinGecko has not answered yet, so the page leaves the share out
 * instead of showing a wrong one.
 */
export const getEthSupply = cached('getEthSupply', async () => {
  if (env.MOCK) {
    return { value: MOCK_ETH_SUPPLY, timestamp: UnixTime.now() }
  }
  const data = await getClient().getCoinDataById(ETHEREUM)
  return {
    value: data.market_data.circulating_supply,
    timestamp: data.last_updated,
  }
})

/**
 * ETH's total supply as each day started, oldest first: CoinGecko's market
 * cap over its price, since it serves no supply history. Without an API key
 * it reaches back 365 days only, and older days have no value.
 */
export const getEthSupplyHistory = cached(
  'getEthSupplyHistory',
  async (): Promise<EthSupply[]> => {
    const to = UnixTime.now()
    const from = env.COINGECKO_API_KEY
      ? HISTORY_START
      : UnixTime(Math.max(HISTORY_START, to - FREE_HISTORY_DAYS * UnixTime.DAY))
    if (env.MOCK) return getMockHistory(from, to)

    const data = await getClient().getCoinMarketChartRange(
      ETHEREUM,
      'usd',
      from,
      to,
    )
    return toDailySupply(data.prices, data.marketCaps)
  },
)

type Series = { date: Date; value: number }[]

/**
 * A value per day start. Over long ranges CoinGecko gives a point at each
 * midnight and one more at the current time; the midnight one is kept.
 */
export function toDailySupply(prices: Series, marketCaps: Series): EthSupply[] {
  const byDay = new Map<number, number>()
  prices.forEach((price, i) => {
    const marketCap = marketCaps[i]
    if (!marketCap || price.value <= 0 || marketCap.value <= 0) return
    const timestamp = UnixTime.fromDate(price.date)
    const day = UnixTime.toStartOf(timestamp, 'day')
    if (timestamp !== day || byDay.has(day)) return
    byDay.set(day, marketCap.value / price.value)
  })
  return [...byDay]
    .sort(([a], [b]) => a - b)
    .map(([timestamp, value]) => ({ timestamp, value }))
}

function getMockHistory(from: number, to: number): EthSupply[] {
  const days: EthSupply[] = []
  for (let day = UnixTime.toStartOf(UnixTime(from), 'day'); day <= to; ) {
    const progress = (day - HISTORY_START) / (to - HISTORY_START)
    days.push({ timestamp: day, value: 120_000_000 + 700_000 * progress })
    day = UnixTime(day + UnixTime.DAY)
  }
  return days
}

/**
 * Keeps `fetch`'s result for MAX_AGE, shares one request between callers,
 * and after a failure keeps the last value and waits RETRY_AFTER before
 * asking again. Null until a request has succeeded.
 */
function cached<T>(name: string, fetch: () => Promise<T>) {
  let latest: { value: T; fetchedAt: number } | undefined
  let failedAt: number | undefined
  let inFlight: Promise<T | null> | undefined

  return function get(): Promise<T | null> {
    const now = UnixTime.now()
    if (latest && now - latest.fetchedAt < MAX_AGE) {
      return Promise.resolve(latest.value)
    }
    if (failedAt !== undefined && now - failedAt < RETRY_AFTER) {
      return Promise.resolve(latest?.value ?? null)
    }
    inFlight ??= fetch()
      .then((value) => {
        latest = { value, fetchedAt: UnixTime.now() }
        failedAt = undefined
        return value
      })
      .catch((error: unknown) => {
        failedAt = UnixTime.now()
        getLogger().for(name).warn('Failed to fetch from CoinGecko', error)
        // An older value is still better than none.
        return latest?.value ?? null
      })
      .finally(() => {
        inFlight = undefined
      })
    return inFlight
  }
}

function getClient(): CoingeckoClient {
  client ??= new CoingeckoClient({
    sourceName: 'coingeckoApi',
    apiKey: env.COINGECKO_API_KEY,
    http: new HttpClient(),
    logger: getLogger().for('CoingeckoClient'),
    callsPerMinute: env.COINGECKO_API_KEY ? 400 : 10,
    retryStrategy: 'FAST',
  })
  return client
}
