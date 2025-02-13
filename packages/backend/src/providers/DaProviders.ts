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
    blobscanClient?: BlobScanClient,
    celestiaClient?: CelestiaRpcClient,
    availClient?: PolkadotRpcClient,
  ) {
    if (blobscanClient) {
      this.daProviders.set(
        'ethereum',
        new EthereumDaProvider(blobscanClient, 'ethereum'),
      )
    }

    if (celestiaClient) {
      this.daProviders.set(
        'celestia',
        new CelestiaDaProvider(celestiaClient, 'celestia'),
      )
    }

    if (availClient) {
      this.daProviders.set('avail', new AvailDaProvider(availClient, 'avail'))
    }
  }

  getProvider(chain: string): DaProvider {
    const daProvider = this.daProviders.get(chain)
    assert(daProvider, `DaProvider not found: ${chain}`)
    return daProvider
  }
}
