import { assert } from '@l2beat/shared-pure'
import type { CelestiaRpcClient } from '../../clients'
import type { DaBlobProvider } from './DaProvider'
import type { CelestiaBlob } from './types'

export class CelestiaDaProvider implements DaBlobProvider {
  constructor(
    private readonly rpcClient: CelestiaRpcClient,
    readonly daLayer: string,
  ) {}

  async getBlobs(
    from: number,
    to: number,
    namespaces?: string[],
  ): Promise<CelestiaBlob[]> {
    assert(namespaces && namespaces.length > 0, 'Namespaces are required')
    const promises = []
    for (let i = from; i <= to; i++) {
      promises.push(this.getBlobsFromBlock(i, namespaces))
    }
    const blobArrays = await Promise.all(promises)
    return blobArrays.flat()
  }

  private async getBlobsFromBlock(
    blockNumber: number,
    namespaces: string[],
  ): Promise<CelestiaBlob[]> {
    const [blobsForNamespaces, blockTimestamp] = await Promise.all([
      this.rpcClient.getBlobsForNamespaces(blockNumber, namespaces),
      this.rpcClient.getBlockTimestamp(blockNumber),
    ])

    if (blobsForNamespaces.length === 0) {
      return []
    }

    const blobs: CelestiaBlob[] = blobsForNamespaces.map((blobForNamespace) => {
      const { namespace, data } = blobForNamespace
      const size = Buffer.from(data, 'base64').length
      return {
        type: 'celestia',
        daLayer: this.daLayer,
        namespace,
        blockTimestamp,
        blockNumber,
        size: BigInt(size),
      }
    })

    return blobs
  }
}
