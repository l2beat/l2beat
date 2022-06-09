import { CoingeckoId, UnixTime } from '@l2beat/common'

import { CoingeckoQueryService } from '../peripherals/coingecko/CoingeckoQueryService'
import {
  DataBoundary,
  PriceRecord,
  PriceRepository,
} from '../peripherals/database/PriceRepository'

export class PriceUpdater {
  constructor(
    private coingeckoQueryService: CoingeckoQueryService,
    private priceRepository: PriceRepository,
    private coingeckoIds: CoingeckoId[]
  ) {}

  async update(timestamps: UnixTime[]) {
    if (timestamps.length === 0) {
      return
    }

    const from = timestamps[0]
    const to = timestamps[timestamps.length - 1]

    const boundaries = await this.priceRepository.calcDataBoundaries()

    await Promise.all(
      this.coingeckoIds.map((coingeckoId) => {
        const boundary = boundaries.get(coingeckoId)
        return this.updateToken(coingeckoId, boundary, from, to)
      })
    )
  }

  async updateToken(
    coingeckoId: CoingeckoId,
    boundary: DataBoundary | undefined,
    from: UnixTime,
    to: UnixTime
  ) {
    if (boundary === undefined) {
      await this.fetchAndSave(coingeckoId, from, to)
    } else {
      if (boundary.earliest.gt(from)) {
        await this.fetchAndSave(coingeckoId, from, boundary.earliest)
      }
      if (boundary.latest.lt(to)) {
        await this.fetchAndSave(coingeckoId, boundary.latest, to)
      }
    }
  }

  async fetchAndSave(coingeckoId: CoingeckoId, from: UnixTime, to: UnixTime) {
    const prices = await this.coingeckoQueryService.getUsdPriceHistory(
      coingeckoId,
      from,
      to,
      'hourly'
    )
    const priceRecords: PriceRecord[] = prices.map((price) => ({
      coingeckoId,
      timestamp: price.timestamp,
      priceUsd: price.value,
    }))

    this.priceRepository.addOrUpdate(priceRecords)
  }
}
