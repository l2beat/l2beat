import { assert, type json } from '@l2beat/shared-pure'
import type { v as z } from '@l2beat/validate'
import type { IRpcClient } from '../../clients2'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import { BeaconChainError, type Blob as BlobSchema, BlobsSchema } from './types'

export type Blob = z.infer<typeof BlobSchema>
export interface BlobsInBlock {
  blobs: Blob[]
  blockNumber: number
}

interface Dependencies extends ClientCoreDependencies {
  beaconApiUrl: string
  rpcClient: IRpcClient
  timeout?: number
  generateId?: () => string
}

export class BlobClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getBlobsByVersionedHashesAndBlockNumber(
    blobVersionedHashes: string[],
    blockNumber: number,
  ): Promise<BlobsInBlock> {
    const blobs = await this.getBlobs(blockNumber, blobVersionedHashes)
    return { blobs, blockNumber }
  }

  async getRelevantBlobs(txHash: string): Promise<BlobsInBlock> {
    const tx = await this.$.rpcClient.getTransaction(txHash)

    assert(tx.blockNumber, `Tx ${tx}: No pending txs allowed`)

    // Skip blob processing for type 2 transactions
    if (Number(tx.type) === 2) {
      return { blobs: [], blockNumber: tx.blockNumber }
    }

    // For type 3 transactions, ensure blobVersionedHashes exists
    assert(
      tx.blobVersionedHashes,
      'Type 3 transaction missing blobVersionedHashes',
    )

    const blobs = await this.getBlobs(tx.blockNumber, tx.blobVersionedHashes)
    return { blobs, blockNumber: tx.blockNumber }
  }

  /** In the block's order, which need not be that of `versionedHashes` */
  async getBlobs(
    blockNumber: number,
    versionedHashes: string[],
  ): Promise<Blob[]> {
    // Without the param the endpoint answers every blob of the block
    if (versionedHashes.length === 0) return []

    const blockId = await this.getBeaconBlockId(blockNumber)
    const query = versionedHashes
      .map((hash) => `versioned_hashes=${hash}`)
      .join('&')
    const endpoint = `eth/v1/beacon/blobs/${blockId}?${query}`

    const response = await this.call(endpoint)
    const parsed = BlobsSchema.safeParse(response)

    if (!parsed.success) {
      this.$.logger.warn('Invalid response', {
        endpoint,
        response: JSON.stringify(response),
      })
      throw new Error('Invalid blobs response', { cause: { blockNumber } })
    }

    // A beacon block without these blobs answers an empty list, not an error
    if (parsed.data.data.length !== versionedHashes.length) {
      throw new Error('Beacon node answered a different number of blobs', {
        cause: {
          blockNumber,
          blockId,
          requested: versionedHashes.length,
          received: parsed.data.data.length,
        },
      })
    }

    return parsed.data.data.map((data) => ({ data }))
  }

  async call(endpoint: string): Promise<unknown> {
    const url = `${this.$.beaconApiUrl}${endpoint}`

    return await this.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'gzip',
      },
      timeout: this.$.timeout,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = BeaconChainError.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        error: parsedError.data,
      })
      return { success: false }
    }

    return { success: true }
  }

  // this is very hacky, but it's the only way i know to get the beacon block id
  // if you know a better way, please fix it
  private async getBeaconBlockId(blockNumber: number): Promise<string> {
    return await this.$.rpcClient.getBlockParentBeaconRoot(blockNumber + 1)
  }
}
