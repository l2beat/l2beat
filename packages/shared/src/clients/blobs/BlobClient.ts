import { assert, type json } from '@l2beat/shared-pure'
import type { v as z } from '@l2beat/validate'
import { utils } from 'ethers'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import type { RpcClient } from '../rpc/RpcClient'
import {
  BeaconChainError,
  type Blob as BlobSchema,
  BlockSidecarSchema,
} from './types'

export type Blob = z.infer<typeof BlobSchema>
export interface BlobsInBlock {
  blobs: Blob[]
  blockNumber: number
}

interface Dependencies extends ClientCoreDependencies {
  beaconApiUrl: string
  rpcClient: RpcClient
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
    const blockSidecar = await this.getBlockSidecar(blockNumber)
    const relevantBlobs = filterOutIrrelevant(blockSidecar, blobVersionedHashes)

    return { blobs: relevantBlobs, blockNumber }
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

    const blockSidecar = await this.getBlockSidecar(tx.blockNumber)
    const relevantBlobs = filterOutIrrelevant(
      blockSidecar,
      tx.blobVersionedHashes,
    )

    return { blobs: relevantBlobs, blockNumber: tx.blockNumber }
  }

  async getBlockSidecar(blockNumber: number): Promise<Blob[]> {
    const blockId = await this.getBeaconBlockId(blockNumber)
    const endpoint = `eth/v1/beacon/blob_sidecars/${blockId}`

    const response = await this.call(endpoint)
    const parsed = BlockSidecarSchema.safeParse(response)

    if (!parsed.success) {
      this.$.logger.warn('Invalid response', {
        endpoint,
        response: JSON.stringify(response),
      })
      throw new Error(`Block: ${blockNumber}: Error during sidecar parsing`)
    }

    return parsed.data.data.map((blob) => ({
      kzg_commitment: blob.kzg_commitment,
      data: blob.blob,
    }))
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

function filterOutIrrelevant(
  sidecarData: Blob[],
  relevantBlobVersionedHashes: string[],
): Blob[] {
  return sidecarData.filter((blob) =>
    relevantBlobVersionedHashes.includes(
      kzgCommitmentToVersionedHash(blob.kzg_commitment),
    ),
  )
}

function kzgCommitmentToVersionedHash(commitment: string): string {
  return '0x01' + utils.sha256(commitment).substring(4)
}
