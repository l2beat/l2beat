import { getTokenByCoingeckoId } from '@l2beat/config'
import { CoingeckoId, UnixTime } from '@l2beat/types'

import { RateLimiter } from '../../tools/RateLimiter'
import { HttpClient } from '../HttpClient'
import {
  CoinListEntry,
  CoinListPlatformEntry,
  CoinListPlatformResult,
  CoinListResult,
  CoinMarketChartRangeData,
  CoinMarketChartRangeResult,
} from './model'

const API_URL = 'https://api.coingecko.com/api/v3'
const PRO_API_URL = 'https://pro-api.coingecko.com/api/v3'

export class CoingeckoClient {
  private readonly timeoutMs = 10_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly apiKey: string | undefined,
  ) {
    const rateLimiter = new RateLimiter({
      callsPerMinute: apiKey ? 450 : 35,
    })
    this.query = rateLimiter.wrap(this.query.bind(this))
  }

  async getCoinList(options?: {
    includePlatform: false
  }): Promise<CoinListEntry[]>
  async getCoinList(options: {
    includePlatform: true
  }): Promise<CoinListPlatformEntry[]>
  async getCoinList(options = { includePlatform: false }) {
    const data = await this.query('/coins/list', {
      include_platform: options.includePlatform.toString(),
    })
    if (!options.includePlatform) {
      return CoinListResult.parse(data)
    } else {
      return CoinListPlatformResult.parse(data)
    }
  }

  async getCoinMarketChartRange(
    coinId: CoingeckoId,
    vs_currency: string,
    from: UnixTime,
    to: UnixTime,
  ): Promise<CoinMarketChartRangeData | undefined> {
    try {
      const data = await this.query(
        `/coins/${coinId.toString()}/market_chart/range`,
        {
          vs_currency: vs_currency.toLowerCase(),
          from: from.toString(),
          to: to.toString(),
        },
      )
      const parsedData = CoinMarketChartRangeResult.parse(data)
      return {
        prices: parsedData.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp),
          price,
        })),
        marketCaps: parsedData.market_caps.map(([timestamp, marketCap]) => ({
          date: new Date(timestamp),
          marketCap,
        })),
        totalVolumes: parsedData.total_volumes.map(
          ([timestamp, totalVolume]) => ({
            date: new Date(timestamp),
            totalVolume,
          }),
        ),
      }
    } catch {
      const list = await this.getCoinList({ includePlatform: true })
      const token = getTokenByCoingeckoId(coinId)
      const coingeckoSupported = list.find((item) => {
        const addr = item.platforms.ethereum
        return (
          addr?.toLocaleLowerCase() ===
          token.address?.toString().toLocaleLowerCase()
        )
      })
      if (coingeckoSupported?.id === undefined) {
        throw new Error(
          `Server responded with non-2XX result: Could not fetch the prices for ${coinId.toString()}`,
        )
      }

      const data = await this.query(
        `/coins/${coingeckoSupported.id.toString()}/market_chart/range`,
        {
          vs_currency: vs_currency.toLowerCase(),
          from: from.toString(),
          to: to.toString(),
        },
      )
      const parsedData = CoinMarketChartRangeResult.parse(data)
      return {
        prices: parsedData.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp),
          price,
        })),
        marketCaps: parsedData.market_caps.map(([timestamp, marketCap]) => ({
          date: new Date(timestamp),
          marketCap,
        })),
        totalVolumes: parsedData.total_volumes.map(
          ([timestamp, totalVolume]) => ({
            date: new Date(timestamp),
            totalVolume,
          }),
        ),
      }
    }
  }

  async query(endpoint: string, params: Record<string, string>) {
    const queryParams = this.apiKey
      ? { ...params, x_cg_pro_api_key: this.apiKey }
      : params
    const query = new URLSearchParams(queryParams).toString()
    let url = `${this.apiKey ? PRO_API_URL : API_URL}${endpoint}`
    if (query) {
      url += `?${query}`
    }
    const res = await this.httpClient.fetch(url, { timeout: this.timeoutMs })
    if (!res.ok) {
      throw new Error(
        `Server responded with non-2XX result: ${res.status} ${res.statusText}`,
      )
    }
    return res.json() as unknown
  }
}
