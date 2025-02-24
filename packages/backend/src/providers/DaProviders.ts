import {
  AvailDaProvider,
  type BlobScanClient,
  CelestiaDaProvider,
  type CelestiaRpcClient,
  type DaProvider,
  EthereumDaProvider,
  type PolkadotRpcClient,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

export class DaProviders {
  daProviders: Map<string, DaProvider> = new Map()

  constructor(
    ethereumLikeClients: { daLayer: string; client: BlobScanClient }[],
    celestiaLikeClients: { daLayer: string; client: CelestiaRpcClient }[],
    availLikeClients: { daLayer: string; client: PolkadotRpcClient }[],
  ) {
    for (const client of ethereumLikeClients) {
      this.daProviders.set(
        client.daLayer,
        new EthereumDaProvider(client.client, 'ethereum'),
      )
    }
    for (const client of celestiaLikeClients) {
      this.daProviders.set(
        client.daLayer,
        new CelestiaDaProvider(client.client, 'celestia'),
      )
    }
    for (const client of availLikeClients) {
      this.daProviders.set(
        client.daLayer,
        new AvailDaProvider(client.client, 'avail'),
      )
    }
  }

  getProvider(chain: string): DaProvider {
    const daProvider = this.daProviders.get(chain)
    assert(daProvider, `DaProvider not found: ${chain}`)
    return daProvider
  }
}
