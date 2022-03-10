import { JobQueue, Logger, UnixTime } from '@l2beat/common'

import { Token } from '../model/Token'
import { CoingeckoQueryService } from '../peripherals/coingecko/CoingeckoQueryService'
import {
  PriceRecord,
  PriceRepository,
} from '../peripherals/database/PriceRepository'

export class PriceUpdater {
  private jobQueue: JobQueue

  constructor(
    private coingeckoQueryService: CoingeckoQueryService,
    private priceRepository: PriceRepository,
    private tokens: Token[],
    private minTimestamp: UnixTime,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
    this.jobQueue = new JobQueue({ maxConcurrentJobs: 20 }, this.logger)
  }

  updateAllPricesUntilNow() {
    for (const token of this.tokens) {
      this.jobQueue.add({
        name: `${token.coingeckoId}-update-price`,
        execute: () => this.updateTokenPrice(token),
      })
    }
  }

  async updateTokenPrice(token: Token) {
    const latestKnownDate =
      await this.priceRepository.getLatestKnownDateByToken(token.coingeckoId)
    const from = (latestKnownDate ?? this.minTimestamp).toStartOf('hour')
    const to = UnixTime.now().toStartOf('hour')

    if (from.equals(to)) {
      return
    }

    const newPrices = await this.coingeckoQueryService.getUsdPriceHistory(
      token.coingeckoId,
      from,
      to,
      'hourly'
    )
    const priceRecords: PriceRecord[] = newPrices.map((price) => ({
      coingeckoId: token.coingeckoId,
      timestamp: price.timestamp,
      priceUsd: price.value,
    }))

    if (newPrices.length > 0) {
      this.priceRepository.addOrUpdate(priceRecords)
    }
  }
}
