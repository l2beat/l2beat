import { Logger } from '@l2beat/backend-tools'
import { setTimeout } from 'timers/promises'

import { ONE_HOUR_MS } from '../utils'

export class PriceService {
  constructor(private readonly logger: Logger) {
    this.logger = logger.for(this)
  }

  async getHourlyPrices(
    apiId: string,
    startHourInclusive: number,
    endHourInclusive: number,
  ): Promise<{ timestamp: number; price: number }[]> {
    const prices: { timestamp: number; price: number }[] = []
    for (let t = startHourInclusive; t <= endHourInclusive; t += ONE_HOUR_MS) {
      prices.push({ timestamp: t, price: Math.random() * 1000 })
    }

    await setTimeout(1000)

    this.logger.info('Fetched prices', {
      apiId,
      since: startHourInclusive,
      count: prices.length,
    })
    return prices
  }
}
