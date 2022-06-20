import { AssetId, Logger, UnixTime } from '@l2beat/common'

import { Token } from '../model'
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
    private tokens: Token[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(timestamps: UnixTime[]) {
    if (timestamps.length === 0) {
      return
    }

    this.logger.info('Update started', { timestamps: timestamps.length })

    const from = timestamps[0]
    const to = timestamps[timestamps.length - 1]

    const boundaries = await this.priceRepository.calcDataBoundaries()

    const results = await Promise.allSettled(
      this.tokens.map(({ id: assetId }) => {
        const boundary = boundaries.get(assetId)
        return this.updateToken(assetId, boundary, from, to)
      }),
    )
    const error = results.find((x) => x.status === 'rejected')
    if (error && error.status === 'rejected') {
      throw error.reason
    }

    this.logger.info('Update completed', { timestamps: timestamps.length })
  }

  async updateToken(
    assetId: AssetId,
    boundary: DataBoundary | undefined,
    from: UnixTime,
    to: UnixTime,
  ) {
    let hours = 0
    const hourDiff = (from: UnixTime, to: UnixTime) =>
      Math.floor((to.toNumber() - from.toNumber()) / 3_600) + 1
    if (boundary === undefined) {
      await this.fetchAndSave(assetId, from, to)
      hours += hourDiff(from, to)
    } else {
      if (from.lt(boundary.earliest)) {
        const lastUnknown = boundary.earliest.add(-1, 'hours')
        await this.fetchAndSave(assetId, from, lastUnknown)
        hours += hourDiff(from, lastUnknown)
      }
      if (to.gt(boundary.latest)) {
        const firstUnknown = boundary.latest.add(1, 'hours')
        await this.fetchAndSave(assetId, firstUnknown, to)
        hours += hourDiff(firstUnknown, to)
      }
    }
    if (hours > 0) {
      this.logger.info('Updated prices', {
        coingeckoId: assetId.toString(),
        hours,
      })
    }
  }
  private getCoingeckoId(assetId: AssetId) {
    const coingeckoId = this.tokens.find(
      (token) => token.id === assetId,
    )?.coingeckoId
    if (!coingeckoId) {
      throw new Error('Programmer error: incorrect asset ID')
    }
    return coingeckoId
  }

  async fetchAndSave(assetId: AssetId, from: UnixTime, to: UnixTime) {
    const coingeckoId = this.getCoingeckoId(assetId)
    const prices = await this.coingeckoQueryService.getUsdPriceHistory(
      coingeckoId,
      // Make sure that we have enough old data to fill holes
      from.add(-7, 'days'),
      to,
      'hourly',
    )
    const priceRecords: PriceRecord[] = prices
      .filter((x) => x.timestamp.gte(from))
      .map((price) => ({
        assetId,
        timestamp: price.timestamp,
        priceUsd: price.value,
      }))

    await this.priceRepository.addMany(priceRecords)
  }
}
