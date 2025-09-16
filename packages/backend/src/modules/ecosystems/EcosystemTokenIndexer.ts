import type { Database } from '@l2beat/database'
import type { CoingeckoClient } from '@l2beat/shared'
import type { EcosystemTokenConfig } from '../../config/Config'
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
      name: 'ecosystem_token_indexer',
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
          ...data,
        }
      }),
    )

    await this.$.db.ecosystemToken.upsertMany(
      data.map((d) => {
        return {
          projectId: d.projectId,
          coingeckoId: d.id,
          priceUsd: d.market_data.current_price.usd,
          marketCapUsd: d.market_data.market_cap.usd,
          circulatingSupply: d.market_data.circulating_supply,
          timestamp: d.last_updated,
        }
      }),
    )

    return () => Promise.resolve(to)
  }
  override removeData(_: RemovalConfiguration[]): Promise<void> {
    return Promise.resolve()
  }
}
