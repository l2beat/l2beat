import { assert, UnixTime } from '@l2beat/shared-pure'
import type { CelestiaRpcClient } from '../../clients/rpc-celestia/CelestiaRpcClient'
import type { DaBlob, DaProvider } from './DaProvider'

export type CelestiaBlob = DaBlob & {
  namespace: string
}

export class CelestiaDaProvider implements DaProvider {
  constructor(private readonly rpcClient: CelestiaRpcClient) {}

  async getBlobs(from: number, to: number): Promise<CelestiaBlob[]> {
    const blobs: CelestiaBlob[] = []

    for (let i = from; i <= to; i++) {
      const blockBlobs = await this.getBlobsFromBlock(i)
      blobs.push(...blockBlobs)
    }

    return blobs
  }

  private async getBlobsFromBlock(
    blockNumber: number,
  ): Promise<CelestiaBlob[]> {
    const block = await this.rpcClient.getBlockResult(blockNumber)

    if (block.txs_results === null) {
      return []
    }

    const events = block.txs_results
      .flatMap(({ log }) => log.flatMap(({ events }) => events))
      .filter(({ type }) => type === 'celestia.blob.v1.EventPayForBlobs')

    const blobs: CelestiaBlob[] = []

    for (const blobEvent of events) {
      const n = blobEvent.attributes.find((a) => a.key === 'namespaces')
      assert(n && n.value, `Namespaces should be defined`)
      const namespaces = JSON.parse(n.value) as string[]

      const b = blobEvent.attributes.find((a) => a.key === 'blob_sizes')
      assert(b && b.value, `Blob sizes should be defined`)
      const sizes = JSON.parse(b.value) as number[]

      assert(
        namespaces.length === sizes.length,
        `Namespaces and sizes should be equal length`,
      )

      for (const [i, nn] of namespaces.entries()) {
        blobs.push({
          namespace: nn,
          blockTimestamp: UnixTime.ZERO,
          size: BigInt(sizes[i]),
        })
      }
    }
    return blobs
  }
}
