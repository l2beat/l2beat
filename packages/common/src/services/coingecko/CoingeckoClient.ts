import { HttpClient } from '../HttpClient'
import {
  CoinListEntry,
  CoinListPlatformEntry,
  CoinListPlatformResult,
  CoinListResult,
} from './model'

const API_URL = 'https://api.coingecko.com/api/v3'

export class CoingeckoClient {
  private timeoutMs = 10_000

  constructor(private httpClient: HttpClient) {}

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
