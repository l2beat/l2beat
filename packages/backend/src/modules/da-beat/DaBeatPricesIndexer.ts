import type { PriceProvider } from '@l2beat/shared'
import {
  assert,
  type CoingeckoId,
  type Configuration,
  type RemovalConfiguration,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../tools/uif/multi/ManagedMultiIndexer'
import type { ManagedMultiIndexerOptions } from '../../tools/uif/multi/types'

interface DaBeatPricesConfig {
  coingeckoIds: string[]
}

interface DaBeatPricesIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<DaBeatPricesConfig>, 'name'> {
  priceProvider: PriceProvider
}

export class DaBeatPricesIndexer extends ManagedMultiIndexer<DaBeatPricesConfig> {
  constructor(private readonly $: DaBeatPricesIndexerDeps) {
    assert(
      $.configurations.length === 1,
      'This indexer should take only one configuration',
    )
    super({
      ...$,
      name: 'dabeat_prices_indexer',
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<DaBeatPricesConfig>[],
  ) {
    const configuration = configurations[0]

    const latestPrices = await this.$.priceProvider.getLatestPrices(
      configuration.properties.coingeckoIds as CoingeckoId[],
    )

    if (latestPrices.size === 0) {
      this.logger.info('No prices found', {
        from,
        to,
      })
      return () => Promise.resolve(to)
    }

    const result = Array.from(latestPrices.entries()).map(
      ([coingeckoId, priceUsd]) => ({
        coingeckoId,
        priceUsd,
      }),
    )

    return async () => {
      await this.$.db.currentPrice.upsertMany(result)
      this.logger.info('Saved DABEAT prices values into DB', {
        records: result.length,
      })

      return to
    }
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    assert(configurations.length === 1)

    const coingeckoIds = this.$.configurations[0].properties.coingeckoIds

    const deletedRecords =
      await this.$.db.currentPrice.deleteByCoingeckoIds(coingeckoIds)

    if (deletedRecords > 0) {
      this.logger.info('Deleted records for configuration', {
        deletedRecords,
      })
    }
  }
}
