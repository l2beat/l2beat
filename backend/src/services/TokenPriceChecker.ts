import fetch from 'node-fetch'
import { getTokenBySymbol } from '../tokens'
import { AsyncCache } from './AsyncCache'
import { AsyncQueue } from './AsyncQueue'
import { Logger } from './Logger'
import { SimpleDate } from './SimpleDate'

const API_URL = 'https://api.coingecko.com/api/v3'

interface ApiResponse {
  market_data?: {
    current_price: {
      usd: number
      eth: number
    }
  }
}

export class TokenPriceChecker {
  private asyncQueue = new AsyncQueue({ length: 1, rateLimitPerMinute: 60 })

  constructor(private asyncCache: AsyncCache, private logger: Logger) {}

  async getPrice(tokenSymbol: string, date: SimpleDate) {
    return this.asyncCache.getOrFetch(
      ['getPrice', tokenSymbol, date],
      async () => {
        const price = await this._getPrice(tokenSymbol, date)
        this.logger.log(`${tokenSymbol} price fetched for ${date}`)
        return price
      }
    )
  }

  private async _getPrice(tokenSymbol: string, date: SimpleDate) {
    const id = getTokenBySymbol(tokenSymbol).coingeckoId
    const url = `${API_URL}/coins/${id}/history?date=${date.toDDMMYYYYString()}&localization=false`
    return this.asyncQueue.enqueue(() =>
      fetch(url)
        .then((res) => res.json())
        .then((data: ApiResponse) => {
          return {
            usd: data.market_data?.current_price.usd ?? 0,
            eth: data.market_data?.current_price.eth ?? 0,
          }
        })
    )
  }
}
