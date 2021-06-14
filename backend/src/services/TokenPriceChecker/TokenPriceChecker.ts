import { getTokenBySymbol } from '@l2beat/config'
import fetch from 'node-fetch'
import { AsyncCache } from '../AsyncCache'
import { AsyncQueue } from '../AsyncQueue'
import { Logger } from '../Logger'
import { SimpleDate } from '../SimpleDate'
import { ITokenPriceChecker } from './ITokenPriceChecker'

const API_URL = 'https://api.coingecko.com/api/v3'

interface ApiResponse {
  market_data?: {
    current_price: {
      usd: number
      eth: number
    }
  }
}

export class TokenPriceChecker implements ITokenPriceChecker {
  private asyncQueue = new AsyncQueue({ length: 2, rateLimitPerMinute: 50 })

  constructor(private asyncCache: AsyncCache, private logger: Logger) {}

  async getPrice(tokenSymbol: string, date: SimpleDate) {
    const id = getTokenBySymbol(tokenSymbol).coingeckoId
    return this.asyncCache.getOrFetch(['getPrice', id, date], async () =>
      this._retryGetPrice(id, date)
    )
  }

  private async _retryGetPrice(id: string, date: SimpleDate) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await this._getPrice(id, date)
      } catch (e) {
        this.logger.error(`fetching ${id} price @ ${date}`, e)
      }
    }
  }

  private async _getPrice(id: string, date: SimpleDate) {
    const url = `${API_URL}/coins/${id}/history?date=${date.toDDMMYYYYString()}&localization=false`
    const price = await this.asyncQueue.enqueue(() =>
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw res.statusText
          }
          return res.json()
        })
        .then((data: ApiResponse) => {
          return {
            usd: data.market_data?.current_price.usd ?? 0,
            eth: data.market_data?.current_price.eth ?? 0,
          }
        })
    )
    this.logger.log(`fetched ${id} price @ ${date}`)
    return price
  }
}
