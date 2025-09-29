import type { CoingeckoClient } from '@l2beat/shared'
import {
  assert,
  type Configuration,
  type RemovalConfiguration,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../tools/uif/multi/ManagedMultiIndexer'
import type { ManagedMultiIndexerOptions } from '../../tools/uif/multi/types'
import { CoingeckoResponse } from './types'

interface DaBeatPricesConfig {
  coingeckoIds: string[]
}

interface DaBeatPricesIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<DaBeatPricesConfig>, 'name'> {
  coingeckoClient: CoingeckoClient
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
    assert(configuration.properties.coingeckoIds.length <= 100, 'Too many ids')

    const coingeckoResponse = await this.$.coingeckoClient.query(
      '/coins/markets',
      {
        vs_currency: 'usd',
        ids: configuration.properties.coingeckoIds.join(','),
      },
    )

    const parsed = CoingeckoResponse.parse(coingeckoResponse)

    if (parsed.length === 0) {
      this.logger.info('No prices found', {
        from,
        to,
      })
      return () => Promise.resolve(to)
    }

    const result = parsed.map(({ id, current_price }) => ({
      coingeckoId: id,
      priceUsd: current_price,
    }))

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
