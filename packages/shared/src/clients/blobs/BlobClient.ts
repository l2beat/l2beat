import { utils } from 'ethers'

import { assert, json } from '@l2beat/shared-pure'
import { z } from 'zod'
import { generateId } from '../../tools/generateId'
import { ClientCore, ClientCoreDependencies } from '../ClientCore'
import {
  Blob,
  BlockSidecarSchema,
  BlockWithParentBeaconBlockRootSchema,
  ErrorSchema,
  RpcResponseSchema,
  TxWithBlobsSchema,
} from './types'

export type Blob = z.infer<typeof Blob>
export interface BlobsInBlock {
  blobs: Blob[]
  blockNumber: number
}

interface Dependencies extends ClientCoreDependencies {
  beaconApiUrl: string
  rpcUrl: string
  timeout?: number
  generateId?: () => string
}

export class BlobClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getRelevantBlobs(txHash: string): Promise<BlobsInBlock> {
    const tx = await this.getTransaction(txHash.toString())

    // Skip blob processing for type 2 transactions
    if (tx.type === '0x2') {
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
    const parsed = BlockSidecarSchema.parse(response)

    return parsed.data.map((blob) => ({
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

  async getTransaction(txHash: string): Promise<{
    blockNumber: number
    type: string
    blobVersionedHashes?: string[]
  }> {
    const result = await this.callRpc('eth_getTransactionByHash', [txHash])
    const parsed = TxWithBlobsSchema.parse(result)

    return {
      blockNumber: Number(parsed.blockNumber),
      type: parsed.type,
      blobVersionedHashes: parsed.blobVersionedHashes,
    }
  }

  async getBlockParentBeaconRoot(blockNumber: number): Promise<string> {
    this.$.logger.debug(`Getting block ${blockNumber}`, { blockNumber })
    const result = await this.callRpc('eth_getBlockByNumber', [
      '0x' + blockNumber.toString(16),
      false,
    ])
    const parsed = BlockWithParentBeaconBlockRootSchema.safeParse(result)

    if (!parsed.success) {
      this.$.logger.error('Error downloading block', {
        blockNumber,
        error: parsed.error,
        result,
      })
      throw parsed.error
    }

    return parsed.data.parentBeaconBlockRoot
  }

  async callRpc(
    method: string,
    params?: (string | boolean)[],
  ): Promise<unknown> {
    const id = this.$.generateId ? this.$.generateId() : generateId()
    const response = await this.fetch(this.$.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params,
      }),
    })
    return RpcResponseSchema.parse(response).result
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = ErrorSchema.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn(`Response validation error`, {
        error: parsedError.data,
      })
      return { success: false }
    }

    return { success: true }
  }

  // this is very hacky, but it's the only way i know to get the beacon block id
  // if you know a better way, please fix it
  private async getBeaconBlockId(blockNumber: number): Promise<string> {
    return await this.getBlockParentBeaconRoot(blockNumber + 1)
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
