import type { Database } from '@l2beat/database'
import type { CoingeckoClient } from '@l2beat/shared'
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
    const data = await Promise.all(
      configurations.map(async (configuration) => {
        const data = await this.$.coingeckoClient.getCoinDataById(
          configuration.properties.coingeckoId,
        )
        return {
          projectId: configuration.properties.projectId,
          configurationId: configuration.id,
          ...data,
        }
      }),
    )

    await this.$.db.ecosystemToken.upsertMany(
      data.map((d) => {
        return {
          projectId: d.projectId,
          coingeckoId: d.id,
          configurationId: d.configurationId,
          priceUsd: d.market_data.current_price.usd,
          marketCapUsd: d.market_data.market_cap.usd,
          circulatingSupply: d.market_data.circulating_supply,
          timestamp: d.last_updated,
        }
      }),
    )

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
