import type { BlobScanClient, DaProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { BlobScanDaProvider } from '../modules/data-availability/providers/BlobscanDaProvider'

export class DaProviders {
  daProviders: Map<string, DaProvider> = new Map()

  constructor(readonly client: BlobScanClient) {
    this.daProviders.set('ethereum', new BlobScanDaProvider(client))
  }

  getDaProvider(chain: string) {
    const daProvider = this.daProviders.get(chain)
    assert(daProvider, `DaProvider not found: ${chain}`)
    return daProvider
  }
}
