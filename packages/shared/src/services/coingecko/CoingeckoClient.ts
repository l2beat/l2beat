import {
  CoingeckoId,
  EthereumAddress,
  UnixTime,
  json,
} from '@l2beat/shared-pure'
import { ClientCore, ClientCoreDependencies } from '../../clients/ClientCore'
import {
  CoinListEntry,
  CoinListPlatformEntry,
  CoinListPlatformResult,
  CoinListResult,
  CoinMarketChartRangeData,
  CoinMarketChartRangeResult,
  CoinMetadata,
  CoingeckoError,
  CoinsMarketResultData,
} from './model'

const API_URL = 'https://api.coingecko.com/api/v3'
const PRO_API_URL = 'https://pro-api.coingecko.com/api/v3'

interface Dependencies extends ClientCoreDependencies {
  apiKey: string | undefined
}

export class CoingeckoClient extends ClientCore {
  private readonly timeoutMs = 10_000
  private readonly newIds = new Map<string, CoingeckoId>()

  constructor(private readonly $: Dependencies) {
    super({ ...$ })
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

  async getCoinMarketChartRange(
    coinId: CoingeckoId,
    vs_currency: string,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<CoinMarketChartRangeData> {
    try {
      const id = this.newIds.get(address?.toString() ?? '') ?? coinId
      return await this.callMarketChartRange(id, vs_currency, from, to)
    } catch (e) {
      if (!isCoingeckoIdError(e)) {
        throw e
      }
      this.$.logger.error(`CoingeckoId change detected: ${coinId}`)
      const id = await this.getNewCoingeckoId(coinId, address)
      this.$.logger.info(
        `Successfully fetched new CoingeckoId: ${coinId} -> ${id}`,
      )
      return await this.callMarketChartRange(id, vs_currency, from, to)
    }
  }

  async callMarketChartRange(
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

  async getNewCoingeckoId(
    oldId: CoingeckoId,
    address?: EthereumAddress,
  ): Promise<CoingeckoId> {
    if (address === undefined) {
      throw new Error(
        `Server responded with non-2XX result: Could not fetch the prices for ${oldId.toString()}`,
      )
    }
    const list = await this.getCoinList({ includePlatform: true })
    const coingeckoSupported = list.find((item) => {
      const addr = item.platforms.ethereum
      return (
        addr?.toLocaleLowerCase() === address.toString().toLocaleLowerCase()
      )
    })
    if (coingeckoSupported?.id === undefined) {
      throw new Error(
        `Server responded with non-2XX result: Could not fetch the prices for ${oldId.toString()}`,
      )
    }

    this.newIds.set(address.toString(), coingeckoSupported.id)
    return coingeckoSupported.id
  }

  async getCoinsMarket(
    coinIds: CoingeckoId[],
    vs_currency: string,
  ): Promise<CoinsMarketResultData> {
    const data = await this.query('/coins/markets', {
      vs_currency: vs_currency.toLowerCase(),
      ids: coinIds.map((id) => id.toString()).join(','),
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
      this.$.logger.warn(`Response validation error`, {
        error: parsedError.data.error,
      })
      return { success: false, message: parsedError.data.error }
    }

    return { success: true }
  }
}

function isCoingeckoIdError(e: unknown): boolean {
  if (e instanceof Error) {
    return e.message.includes('coin not found')
  }
  return false
}
