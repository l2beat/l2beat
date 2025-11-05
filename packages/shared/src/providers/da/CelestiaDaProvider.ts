import { assert } from '@l2beat/shared-pure'
import type { CelestiaRpcClient } from '../../clients/rpc-celestia/CelestiaRpcClient'
import type { DaBlobProvider } from './DaProvider'
import type { CelestiaBlob } from './types'

// Block number when Celestia switched from base64-encoded to plain-text response attributes
const CELESTIA_BASE64_ENCODING_END_BLOCK = 6515203

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
    const [block, blockTimestamp] = await Promise.all([
      this.rpcClient.getBlockResult(blockNumber),
      this.rpcClient.getBlockTimestamp(blockNumber),
    ])

    if (block.txs_results === null) {
      return []
    }

    const blobEvents = block.txs_results
      .flatMap(({ events }) => events)
      .filter(({ type }) => type === 'celestia.blob.v1.EventPayForBlobs')

    const usesBase64Encoding = blockNumber < CELESTIA_BASE64_ENCODING_END_BLOCK

    const blobs: CelestiaBlob[] = blobEvents.flatMap((blobEvent) => {
      const namespaces = getAttributeValue<string[]>(
        blobEvent,
        'namespaces',
        usesBase64Encoding,
      )
      const sizes = getAttributeValue<number[]>(
        blobEvent,
        'blob_sizes',
        usesBase64Encoding,
      )

      assert(
        namespaces.length === sizes.length,
        `[${blockNumber}] Namespaces and sizes should be equal length`,
      )

      return namespaces.map((namespace, i) => ({
        type: 'celestia',
        daLayer: this.daLayer,
        namespace,
        blockTimestamp,
        blockNumber,
        size: BigInt(sizes[i]),
      }))
    })

    return blobs
  }
}

function getAttributeValue<T>(
  event: { attributes: { key: string; value?: string }[] },
  key: string,
  decodeBase64: boolean,
): T {
  const attribute = event.attributes.find((a) =>
    decodeBase64
      ? Buffer.from(a.key, 'base64').toString() === key
      : a.key === key,
  )
  assert(attribute && attribute.value, `${key} should be defined`)
  if (decodeBase64) {
    return JSON.parse(Buffer.from(attribute.value, 'base64').toString()) as T
  }
  return JSON.parse(attribute.value) as T
}
