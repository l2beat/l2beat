import type { CoingeckoId, json, UnixTime } from '@l2beat/shared-pure'
import {
  ClientCore,
  type ClientCoreDependencies,
} from '../../clients/ClientCore'
import {
  CoingeckoError,
  type CoinListEntry,
  type CoinListPlatformEntry,
  CoinListPlatformResult,
  CoinListResult,
  type CoinMarketChartRangeData,
  CoinMarketChartRangeResult,
  CoinMetadata,
  CoinsMarketResultData,
} from './types'

const API_URL = 'https://api.coingecko.com/api/v3'
const PRO_API_URL = 'https://pro-api.coingecko.com/api/v3'

interface Dependencies extends ClientCoreDependencies {
  apiKey: string | undefined
}

export class CoingeckoClient extends ClientCore {
  static COINS_MARKET_PAGE_SIZE = 250
  private readonly timeoutMs = 10_000

  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getCoinMarketChartRange(
    coinId: CoingeckoId,
    vs_currency: string,
    from: UnixTime,
    to: UnixTime,
  ): Promise<CoinMarketChartRangeData> {
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
        value: price,
      })),
      marketCaps: parsedData.market_caps.map(([timestamp, marketCap]) => ({
        date: new Date(timestamp),
        value: marketCap,
      })),
    }
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
    }
    return CoinListPlatformResult.parse(data)
  }

  async getImageUrl(id: CoingeckoId): Promise<string> {
    const data = await this.query(`/coins/${id.toString()}`, {
      localization: 'false',
      tickers: 'false',
      market_data: 'false',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false',
    })

    const parsed = CoinMetadata.parse(data)
    return parsed.image.large
  }

  /** Fetches latest prices, uses */
  async getCoinsMarket(
    coinIds: CoingeckoId[],
    vs_currency: string,
  ): Promise<CoinsMarketResultData> {
    const data = await this.query('/coins/markets', {
      vs_currency: vs_currency.toLowerCase(),
      ids: coinIds.map((id) => id.toString()).join(','),
      per_page: CoingeckoClient.COINS_MARKET_PAGE_SIZE.toString(),
    })

    return CoinsMarketResultData.parse(data)
  }

  async query(endpoint: string, params: Record<string, string>) {
    const queryParams = this.$.apiKey
      ? { ...params, x_cg_pro_api_key: this.$.apiKey }
      : params
    const query = new URLSearchParams(queryParams).toString()
    let url = `${this.$.apiKey ? PRO_API_URL : API_URL}${endpoint}`
    if (query) {
      url += `?${query}`
    }
    return await this.fetch(url, { timeout: this.timeoutMs })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = CoingeckoError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        error: parsedError.data.error,
      })
      return { success: false, message: parsedError.data.error }
    }

    return { success: true }
  }
}
