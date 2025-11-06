import type { Database } from '@l2beat/database'
import type { CoingeckoClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { EcosystemTokenConfig } from '../../config/Config'
import { INDEXER_NAMES } from '../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../tools/uif/multi/types'

export interface EcosystemTokenIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<EcosystemTokenConfig>, 'name'> {
  db: Database
  coingeckoClient: CoingeckoClient
}
export class EcosystemTokenIndexer extends ManagedMultiIndexer<EcosystemTokenConfig> {
  constructor(private readonly $: EcosystemTokenIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.ECOSYSTEM_TOKEN,
    })
  }

  override async multiUpdate(
    _: number,
    to: number,
    configurations: Configuration<EcosystemTokenConfig>[],
  ): Promise<() => Promise<number>> {
    const records = await Promise.all(
      configurations.map(async (configuration) => {
        const [data, historicalData] = await Promise.all([
          this.$.coingeckoClient.getCoinDataById(
            configuration.properties.coingeckoId,
          ),
          this.$.coingeckoClient.getCoinHistoricalDataById(
            configuration.properties.coingeckoId,
            UnixTime.toStartOf(to, 'day') - 7 * UnixTime.DAY,
          ),
        ])

        const price7dChange =
          (data.market_data.current_price.usd -
            historicalData.market_data.current_price.usd) /
          historicalData.market_data.current_price.usd

        const marketCap7dChange =
          (data.market_data.market_cap.usd -
            historicalData.market_data.market_cap.usd) /
          historicalData.market_data.market_cap.usd

        // Coingecko doesnt return circulating supply, so we need to calculate it
        const historicalCirculatingSupply =
          historicalData.market_data.market_cap.usd /
          historicalData.market_data.current_price.usd
        const circulatingSupply7dChange =
          (data.market_data.circulating_supply - historicalCirculatingSupply) /
          historicalCirculatingSupply
        return {
          projectId: configuration.properties.projectId,
          coingeckoId: configuration.properties.coingeckoId,
          configurationId: configuration.id,
          priceUsd: data.market_data.current_price.usd,
          price7dChange,
          marketCapUsd: data.market_data.market_cap.usd,
          marketCap7dChange,
          circulatingSupply: data.market_data.circulating_supply,
          circulatingSupply7dChange,
          timestamp: data.last_updated,
        }
      }),
    )

    await this.$.db.ecosystemToken.upsertMany(records)

    this.logger.info('Saved ecosystem token records', {
      configurations: configurations.length,
      to,
    })

    return () => Promise.resolve(to)
  }
  override async removeData(
    configurations: RemovalConfiguration[],
  ): Promise<void> {
    for (const c of configurations) {
      const deletedRecords =
        await this.$.db.ecosystemToken.deleteByConfigurationId(c.id)

      this.logger.info('Wiped ecosystem token records for configuration', {
        id: c.id,
        deletedRecords,
      })
    }
  }
}
