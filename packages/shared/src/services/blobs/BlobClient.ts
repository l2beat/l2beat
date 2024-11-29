import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { utils } from 'ethers'
import { z } from 'zod'

import { assert } from '@l2beat/shared-pure'
import { HttpClient } from '../HttpClient'

interface BlobClientOptions {
  callsPerMinute: number | undefined
  timeout: number | undefined
}

export class BlobClient {
  timeout: number

  constructor(
    private readonly beaconApiUrl: string,
    private readonly rpcUrl: string,
    private readonly httpClient: HttpClient,
    private readonly logger: Logger,
    options: BlobClientOptions,
  ) {
    this.logger = this.logger.for(this)
    this.timeout = options.timeout ?? 10_000
    const rateLimiter = new RateLimiter({
      callsPerMinute: options.callsPerMinute ?? 60,
    })
    this.call = rateLimiter.wrap(this.call.bind(this))
    this.callRpc = rateLimiter.wrap(this.callRpc.bind(this))
  }

  static create(
    services: {
      httpClient: HttpClient
      logger: Logger
    },
    options: {
      beaconApiUrl: string
      rpcUrl: string
      callsPerMinute: number | undefined
      timeout: number | undefined
    },
  ): BlobClient {
    return new BlobClient(
      options.beaconApiUrl,
      options.rpcUrl,
      services.httpClient,
      services.logger,
      options,
    )
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

  private async getBlockSidecar(blockNumber: number): Promise<Blob[]> {
    const blockId = await this.getBeaconBlockId(blockNumber)
    const endpoint = `eth/v1/beacon/blob_sidecars/${blockId}`

    const response = await this.call(endpoint)
    const parsed = BlockSidecarSchema.parse(response)

    return parsed.data.map((blob) => ({
      kzg_commitment: blob.kzg_commitment,
      data: blob.blob,
    }))
  }

  private async call(endpoint: string): Promise<unknown> {
    const url = `${this.beaconApiUrl}${endpoint}`

    const response = await this.httpClient.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'gzip',
      },
      timeout: this.timeout,
    })
    const json = (await response.json()) as unknown
    return json
  }

  private async getTransaction(txHash: string): Promise<{
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

  private async getBlockParentBeaconRoot(blockNumber: number): Promise<string> {
    this.logger.debug(`Getting block ${blockNumber}`, { blockNumber })
    const result = await this.callRpc('eth_getBlockByNumber', [
      '0x' + blockNumber.toString(16),
      false,
    ])
    const parsed = BlockWithParentBeaconBlockRootSchema.safeParse(result)

    if (!parsed.success) {
      this.logger.error('Error downloading block', {
        blockNumber,
        error: parsed.error,
        result,
      })
      throw parsed.error
    }

    return parsed.data.parentBeaconBlockRoot
  }

  private async callRpc(
    method: string,
    params?: (string | boolean)[],
  ): Promise<unknown> {
    const id = Math.floor(Math.random() * 1000)
    const response = await this.httpClient.fetch(this.rpcUrl, {
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

    const json = (await response.json()) as unknown
    const parsed = RpcResultSchema.parse(json)
    return parsed.result
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

const Blob = z.object({
  kzg_commitment: z.string(),
  data: z.string(),
})
export type Blob = z.infer<typeof Blob>

const BlockSidecarSchema = z.object({
  data: z.array(
    z.object({
      kzg_commitment: z.string(),
      blob: z.string(),
    }),
  ),
})

export interface BlobsInBlock {
  blobs: Blob[]
  blockNumber: number
}

const TxWithBlobsSchema = z.object({
  blockNumber: z.string(),
  type: z.string(),
  blobVersionedHashes: z.array(z.string()).optional(),
})

const BlockWithParentBeaconBlockRootSchema = z.object({
  parentBeaconBlockRoot: z.string(),
})

const RpcResultSchema = z.object({
  result: z.unknown(),
})
