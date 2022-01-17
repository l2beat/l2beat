import { RateLimiter } from '../../tools/RateLimiter'
import { HttpClient } from '../HttpClient'
import { CoingeckoId } from '.'
import {
  CoinListEntry,
  CoinListPlatformEntry,
  CoinListPlatformResult,
  CoinListResult,
  CoinMarketChartRangeResult,
  MarketChartRangeParams,
} from './model'

const API_URL = 'https://api.coingecko.com/api/v3'

export class CoingeckoClient {
  private rateLimiter = new RateLimiter({
    callsPerMinute: 40,
  })
  private timeoutMs = 10_000

  constructor(private httpClient: HttpClient) {
    this.query = this.rateLimiter.wrap(this.query.bind(this))
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

  async getCoinMarketChartRange(coindId: CoingeckoId, params: MarketChartRangeParams): Promise<CoinMarketChartRangeResult> {
    
    const data = await this.query(`/coins/${coindId}/market_chart/range`,{...params})
    return CoinMarketChartRangeResult.parse(data)

  }

  async query(endpoint: string, params: Record<string, string>) {
    const query = new URLSearchParams(params).toString()
    let url = `${API_URL}${endpoint}`
    if (query) {
      url += `?${query}`
    }
    const res = await this.httpClient.fetch(url, { timeout: this.timeoutMs })
    if (!res.ok) {
      throw new Error(
        `Server responded with non-2XX result: ${res.status} ${res.statusText}`
      )
    }
    return res.json()
  }
}
