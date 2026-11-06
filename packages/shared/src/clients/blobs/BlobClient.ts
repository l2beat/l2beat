import { assert, type json } from '@l2beat/shared-pure'
import type { v as z } from '@l2beat/validate'
import type { IRpcClient } from '../../clients2'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  BeaconChainError,
  type Blob as BlobSchema,
  BlobsSchema,
  GenesisSchema,
} from './types'

const SECONDS_PER_SLOT = 12

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
  private genesisTime: number | undefined

  constructor(private readonly $: Dependencies) {
    super({ ...$ })
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

    const slot = await this.getSlot(blockNumber)
    // The spec forbids repeating a hash, which a tx may do
    const hashes = [...new Set(versionedHashes)]
    const query = hashes.map((hash) => `versioned_hashes=${hash}`).join('&')
    const endpoint = `eth/v1/beacon/blobs/${slot}?${query}`

    const response = await this.call(endpoint)
    const parsed = BlobsSchema.safeParse(response)

    if (!parsed.success) {
      this.$.logger.warn('Invalid response', {
        endpoint,
        response: JSON.stringify(response),
      })
      throw new Error('Invalid blobs response', { cause: { blockNumber } })
    }

    // A beacon block without these blobs answers an empty list, not an error.
    // A blob posted twice in the block may come back twice, so count distinct
    // blobs: one per hash found
    const received = new Set(parsed.data.data).size
    if (received < hashes.length) {
      throw new Error('Beacon node answered fewer blobs than asked for', {
        cause: { blockNumber, slot, requested: hashes.length, received },
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

  // An execution block's timestamp is the start of the slot whose beacon block
  // commits to it. The parent beacon root of the next block is no substitute:
  // under ePBS (Glamsterdam) it can name a beacon block whose payload never
  // came
  private async getSlot(blockNumber: number): Promise<number> {
    const [timestamp, genesisTime] = await Promise.all([
      this.$.rpcClient.getBlockTimestamp(blockNumber),
      this.getGenesisTime(),
    ])
    const sinceGenesis = timestamp - genesisTime
    if (sinceGenesis % SECONDS_PER_SLOT !== 0) {
      throw new Error('Block timestamp is off the slot grid', {
        cause: { blockNumber, timestamp, genesisTime },
      })
    }
    return sinceGenesis / SECONDS_PER_SLOT
  }

  private async getGenesisTime(): Promise<number> {
    if (this.genesisTime === undefined) {
      const response = await this.call('eth/v1/beacon/genesis')
      this.genesisTime = Number(GenesisSchema.parse(response).data.genesis_time)
    }
    return this.genesisTime
  }
}
