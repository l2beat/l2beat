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
  private asyncQueue = new AsyncQueue({ length: 1, rateLimitPerMinute: 50 })

  constructor(private asyncCache: AsyncCache, private logger: Logger) {}

  async getPrice(tokenSymbol: string, date: SimpleDate) {
    return this.asyncCache.getOrFetch(
      ['getPrice', tokenSymbol, date],
      async () => this._getPrice(tokenSymbol, date)
    )
  }

  private async _getPrice(tokenSymbol: string, date: SimpleDate) {
    const id = getTokenBySymbol(tokenSymbol).coingeckoId
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
    this.logger.log(`fetched ${tokenSymbol} price @ ${date}`)
    return price
  }
}
