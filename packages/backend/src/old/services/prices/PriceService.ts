import { CoingeckoId, Logger, SimpleDate, UnixTime } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { BigNumber, utils } from 'ethers'

import { CoingeckoQueryService } from '../../../peripherals/coingecko/CoingeckoQueryService'
import { FetchedPrices } from './model'

export class PriceService {
  constructor(
    private coingeckoQueryService: CoingeckoQueryService,
    private logger: Logger
  ) {}

  async getPrices(
    tokens: TokenInfo[],
    dates: SimpleDate[]
  ): Promise<Map<SimpleDate, FetchedPrices>> {
    const start = dates[0]
    const end = dates[dates.length - 1]

    const fetchedPrices = new Map<number, FetchedPrices>()

    await Promise.all(
      tokens.map(async (token) => {
        const prices = await this.coingeckoQueryService.getUsdPriceHistory(
          CoingeckoId(token.coingeckoId),
          new UnixTime(start.toUnixTimestamp()),
          new UnixTime(end.toUnixTimestamp()),
          'daily'
        )

        for (const { timestamp, value } of prices) {
          const fetchedPricesForDate = fetchedPrices.get(
            timestamp.toNumber()
          ) ?? {
            token: {},
            eth: BigNumber.from(0),
          }
          if (!token.address) {
            fetchedPricesForDate.eth = utils.parseUnits(value.toFixed(18), 18)
          } else {
            fetchedPricesForDate.token[token.address] = utils.parseUnits(
              value.toFixed(18 * 2 - token.decimals),
              18 * 2 - token.decimals
            )
          }
          fetchedPrices.set(timestamp.toNumber(), fetchedPricesForDate)
        }

        this.logger.info('Fetched prices', { token: token.coingeckoId })
      })
    )

    const entries: [SimpleDate, FetchedPrices][] = []
    for (const date of dates) {
      const fetchedPricesForDate = fetchedPrices.get(date.toUnixTimestamp())
      if (!fetchedPricesForDate) {
        throw new Error(`No prices for ${date.toString()}`)
      } else {
        entries.push([date, fetchedPricesForDate])
      }
    }

    return new Map(entries)
  }
}
