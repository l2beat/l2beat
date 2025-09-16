import { ManagedChildIndexer } from '../../tools/uif/ManagedChildIndexer'
import type { EcosystemTokenIndexerDeps } from './types'

export class EcosystemTokenIndexer extends ManagedChildIndexer {
  constructor(private readonly $: EcosystemTokenIndexerDeps) {
    super({
      ...$,
      name: 'ecosystem_token_indexer',
      tags: {
        tag: $.tokenConfig.projectId,
        project: $.tokenConfig.projectId,
      },
    })
  }

  override async update(_: number, to: number): Promise<number> {
    await Promise.resolve()

    const data = await this.$.coingeckoClient.getCoinDataById(
      this.$.tokenConfig.coingeckoId,
    )

    await this.$.db.ecosystemToken.upsert({
      projectId: this.$.tokenConfig.projectId,
      coingeckoId: this.$.tokenConfig.coingeckoId,
      priceUsd: data.market_data.current_price.usd,
      marketCapUsd: data.market_data.market_cap.usd,
      circulatingSupply: data.market_data.circulating_supply,
      timestamp: to,
    })

    return to
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await Promise.resolve()

    return targetHeight
  }
}
