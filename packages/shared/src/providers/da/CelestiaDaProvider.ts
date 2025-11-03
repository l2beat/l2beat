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
    const namespaces = new Set<string>()

    for (const txData of blobsTxs) {
      const txBytes = Buffer.from(txData, 'base64')

      for (let i = 0; i < txBytes.length - 29; i++) {
        if (
          (txBytes[i] === 0x0a || txBytes[i] === 0x12) &&
          txBytes[i + 1] === 0x1d
        ) {
          const namespace = txBytes.slice(i + 2, i + 2 + 29)
          const namespaceB64 = namespace.toString('base64')

          const hasLeadingZeros = namespace
            .slice(0, 18)
            .every((byte: number) => byte === 0x00)

          // Validate: Celestia namespaces start with 18 leading zeros)
          if (hasLeadingZeros && !namespaces.has(namespaceB64)) {
            namespaces.add(namespaceB64)
          }
        }
      }
    }

    return Array.from(namespaces)
  }
}
