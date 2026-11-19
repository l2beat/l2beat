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
const MOCK_ETH_SUPPLY = 120_700_000

let latest: { supply: EthSupply; fetchedAt: number } | undefined
let failedAt: number | undefined
let inFlight: Promise<EthSupply | null> | undefined
let client: CoingeckoClient | undefined

/**
 * ETH's total supply, from CoinGecko. Kept in memory between requests; null
 * when CoinGecko has not answered yet, so the page leaves the share out
 * instead of showing a wrong one.
 */
export function getEthSupply(): Promise<EthSupply | null> {
  if (env.MOCK) {
    return Promise.resolve({
      value: MOCK_ETH_SUPPLY,
      timestamp: UnixTime.now(),
    })
  }
  const now = UnixTime.now()
  if (latest && now - latest.fetchedAt < MAX_AGE) {
    return Promise.resolve(latest.supply)
  }
  if (failedAt !== undefined && now - failedAt < RETRY_AFTER) {
    return Promise.resolve(latest?.supply ?? null)
  }
  inFlight ??= fetchEthSupply().finally(() => {
    inFlight = undefined
  })
  return inFlight
}

async function fetchEthSupply(): Promise<EthSupply | null> {
  try {
    const data = await getClient().getCoinDataById(CoingeckoId('ethereum'))
    const supply = {
      value: data.market_data.circulating_supply,
      timestamp: data.last_updated,
    }
    latest = { supply, fetchedAt: UnixTime.now() }
    failedAt = undefined
    return supply
  } catch (error) {
    failedAt = UnixTime.now()
    getLogger().for('getEthSupply').warn('Failed to fetch ETH supply', error)
    // An older value is still better than none.
    return latest?.supply ?? null
  }
}

function getClient(): CoingeckoClient {
  const logger = getLogger().for('CoingeckoClient')
  client ??= new CoingeckoClient({
    sourceName: 'coingeckoApi',
    apiKey: env.COINGECKO_API_KEY,
    http: new HttpClient(),
    logger,
    callsPerMinute: env.COINGECKO_API_KEY ? 400 : 10,
    retryStrategy: 'FAST',
  })
  return client
}
