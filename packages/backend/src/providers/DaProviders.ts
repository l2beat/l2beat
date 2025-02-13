import {
  type BlobScanClient,
  type DaProvider,
  EthereumDaProvider,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

export class DaProviders {
  daProviders: Map<string, DaProvider> = new Map()

  constructor(readonly client: BlobScanClient) {
    this.daProviders.set('ethereum', new EthereumDaProvider(client, 'ethereum'))
  }

  getDaProvider(chain: string) {
    const daProvider = this.daProviders.get(chain)
    assert(daProvider, `DaProvider not found: ${chain}`)
    return daProvider
  }
}
