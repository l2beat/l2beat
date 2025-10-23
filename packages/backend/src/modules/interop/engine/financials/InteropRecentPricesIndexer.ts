import type { Database } from '@l2beat/database'
import type { InteropRecentPricesRecord } from '@l2beat/database/dist/repositories/InteropRecentPricesRepository'
import type { PriceProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../../tools/uif/ManagedChildIndexer'

export interface Dependencies extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  priceProvider: PriceProvider
}

export class InteropRecentPricesIndexer extends ManagedChildIndexer {
  constructor(private readonly $: Dependencies) {
    super({ ...$, name: INDEXER_NAMES.INTEROP_RECENT_PRICES })
  }

  override async update(from: number, to: number): Promise<number> {
    const fullHourInRange = this.findFullHourInRange(from, to)

    if (fullHourInRange === undefined) {
      this.logger.info('Update skipped, no full hour in range', {
        from,
        to,
      })
      return to
    }

    const coingeckoIds = await this.$.priceProvider.getAllCoingeckoIds()
    this.logger.info('Fetched coingecko ids', { ids: coingeckoIds.length })

    const prices = await this.$.priceProvider.getLatestPrices(
      coingeckoIds.filter((c) => c.length <= 64), // there are random tokens with long names
    )
    this.logger.info('Fetched prices', { prices: prices.size })

    const records: InteropRecentPricesRecord[] = []
    for (const [coingeckoId, priceUsd] of prices.entries()) {
      records.push({ coingeckoId, priceUsd, timestamp: fullHourInRange })
    }

    await this.$.db.interopRecentPrices.insertMany(records)
    this.logger.info('Saved prices into DB', {
      target: fullHourInRange,
      records: records.length,
    })

    return to
  }

  findFullHourInRange(from: number, to: number) {
    const target = UnixTime.toStartOf(to, 'hour')

    if (target < from) {
      return undefined
    }

    return target
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await this.$.db.interopRecentPrices.deleteAfter(targetHeight)
  }
}
