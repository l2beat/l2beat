import type { CelestiaBlock, CelestiaRpcClient } from '../../clients'
import type { DaBlobProvider } from './DaProvider'
import type { CelestiaBlob } from './types'

const PAY_FOR_BLOBS_EVENT_SIGNATURE =
  'Y2VsZXN0aWEuYmxvYi52MS5Nc2dQYXlGb3JCbG9ic'

export class CelestiaDaProvider implements DaBlobProvider {
  constructor(
    private readonly rpcClient: CelestiaRpcClient,
    readonly daLayer: string,
  ) {}

  async getBlobs(from: number, to: number): Promise<CelestiaBlob[]> {
    const promises = []
    for (let i = from; i <= to; i++) {
      promises.push(this.getBlobsFromBlock(i))
    }
    const blobArrays = await Promise.all(promises)
    return blobArrays.flat()
  }

  private async getBlobsFromBlock(
    blockNumber: number,
  ): Promise<CelestiaBlob[]> {
    const blockData = await this.rpcClient.getBlock(blockNumber)
    const namespaces = this.extractNamespaces(blockData)
    const blobsForNamespaces = await this.rpcClient.getBlobsForNamespaces(
      blockNumber,
      namespaces,
    )

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
        blockTimestamp: blockData.block.header.time,
        blockNumber,
        size: BigInt(size),
      }
    })

    return blobs
  }

  private extractNamespaces(blockData: CelestiaBlock): string[] {
    const blobsTxs = blockData.block.data.txs.filter((tx) =>
      tx.includes(PAY_FOR_BLOBS_EVENT_SIGNATURE),
    )
    return blobsTxs.map((txData) => `${txData.slice(128, 128 + 39)}=`)
  }
}
