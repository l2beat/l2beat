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

    const results = await Promise.allSettled(
      this.coingeckoIds.map((coingeckoId) => {
        const boundary = boundaries.get(coingeckoId)
        return this.updateToken(coingeckoId, boundary, from, to)
      })
    )
    const error = results.find((x) => x.status === 'rejected')
    if (error && error.status === 'rejected') {
      throw error.reason
    }
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
      if (from.lt(boundary.earliest)) {
        const lastUnknown = boundary.earliest.add(-1, 'hours')
        await this.fetchAndSave(coingeckoId, from, lastUnknown)
      }
      if (to.gt(boundary.latest)) {
        const firstUnknown = boundary.latest.add(1, 'hours')
        await this.fetchAndSave(coingeckoId, firstUnknown, to)
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

    await this.priceRepository.addMany(priceRecords)
  }
}
