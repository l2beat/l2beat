import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import {
  type Coin,
  type CoingeckoClientConfig,
  type CoinListEntry,
  CoinListEntrySchema,
  type CoinListPlatformEntry,
  CoinListPlatformEntrySchema,
  type CoinMarketChartRangeData,
  CoinMarketChartRangeResultSchema,
  CoinSchema,
} from './types'

const API_URL = 'https://api.coingecko.com/api/v3'
const PRO_API_URL = 'https://pro-api.coingecko.com/api/v3'

export class CoingeckoClient {
  private readonly baseUrl: string
  private readonly apiKey?: string

  constructor(config: CoingeckoClientConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.apiKey ? PRO_API_URL : API_URL
  }

  async getCoinDataById(id: string): Promise<Coin> {
    const url = this.buildUrl(`/coins/${id}`, {
      localization: 'false',
      tickers: 'false',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false',
    })

    const response = await fetch(url, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(
        `CoinGecko API error: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()
    return CoinSchema.parse(data)
  }

  async getCoinList(options?: {
    includePlatform: false
  }): Promise<CoinListEntry[]>
  async getCoinList(options: {
    includePlatform: true
  }): Promise<CoinListPlatformEntry[]>
  async getCoinList(options = { includePlatform: false }) {
    const url = this.buildUrl('/coins/list', {
      include_platform: options.includePlatform.toString(),
    })

    const response = await fetch(url, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(
        `CoinGecko API error: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()
    if (!options.includePlatform) {
      return v.array(CoinListEntrySchema).parse(data)
    }
    return v.array(CoinListPlatformEntrySchema).parse(data)
  }

  async getCoinMarketChartRange(
    coinId: string,
    vs_currency: string,
    from: UnixTime,
    to: UnixTime,
  ): Promise<CoinMarketChartRangeData> {
    const now = Math.floor(Date.now() / 1000)
    const adjustedTo = to > now ? now : to

    const url = this.buildUrl(`/coins/${coinId}/market_chart/range`, {
      vs_currency: vs_currency.toLowerCase(),
      from: UnixTime.toYYYYMMDD(from),
      to: UnixTime.toYYYYMMDD(adjustedTo),
    })

    const response = await fetch(url, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(
        `CoinGecko API error: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()
    const parsedData = CoinMarketChartRangeResultSchema.parse(data)

    return {
      prices: parsedData.prices.map(([timestamp, price]) => ({
        date: new Date(Number(timestamp)),
        value: Number(price),
      })),
      marketCaps: parsedData.market_caps.map(([timestamp, marketCap]) => ({
        date: new Date(Number(timestamp)),
        value: Number(marketCap),
      })),
    }
  }

  private buildUrl(endpoint: string, params: Record<string, string>): string {
    const queryParams = new URLSearchParams(params).toString()
    return `${this.baseUrl}${endpoint}${queryParams ? `?${queryParams}` : ''}`
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    if (this.apiKey) {
      headers['x-cg-pro-api-key'] = this.apiKey
    }
    return headers
  }
}
