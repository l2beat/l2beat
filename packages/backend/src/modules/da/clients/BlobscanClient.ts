import { Logger, RateLimiter } from '@l2beat/backend-tools'

import { z } from 'zod'

import { HttpClient } from '@l2beat/shared'
import { RequestInit } from 'node-fetch'

// API does not limit it in anyway, so arbitrary limit
const MAX_PER_PAGE = 500

export class BlobScanClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 300,
  })

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly logger = Logger.SILENT,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
    this.logger = logger.for(this)
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: {
      url: string
    },
  ) {
    return new BlobScanClient(services.httpClient, options.url, services.logger)
  }

  async getBlobs(fromBlock: number, toBlock: number) {
    const blobs: BlobScanBlobSchema[] = []

    const firstPage = await this._getBlobs(fromBlock, toBlock, 1)

    blobs.push(...firstPage.blobs)

    if (firstPage.totalBlobs && firstPage.totalBlobs > MAX_PER_PAGE) {
      await Promise.all(
        Array.from(
          { length: Math.ceil(firstPage.totalBlobs / MAX_PER_PAGE) },
          (_, i) => i + 2, // offset from second page
        ).map(async (page) => {
          const response = await this._getBlobs(fromBlock, toBlock, page)
          blobs.push(...response.blobs)
        }),
      )
    }

    return blobs.map((blob) => ({
      ...blob,
      size: 131072, // each blob is 128 KiB so 131,072 B
    }))
  }

  async getBlobsCount(fromBlock: number, toBlock: number) {
    const blobs = await this._getBlobs(fromBlock, toBlock, 1)
    return blobs.totalBlobs
  }

  private async _getBlobs(fromBlock: number, toBlock: number, page: number) {
    const params = new URLSearchParams({
      startBlock: fromBlock.toString(),
      endBlock: toBlock.toString(),
      // Page
      p: page.toString(),
      // To receive totalBlobs
      count: 'true',
      // Per Page
      ps: MAX_PER_PAGE.toString(),
    })

    const response = await this.call(`blobs?${params.toString()}`)

    return BlobScanGetBlobsResponseSchema.parse(response)
  }

  private call(endpoint: string, options: RequestInit = {}) {
    return this.httpClient.fetch(`${this.url}/${endpoint}`, options)
  }
}

export const BlobScanDataStorageReferenceSchema = z.object({
  storage: z.string(),
  url: z.string(),
})

export const BlobScanTransactionSchema = z.object({
  category: z.string().optional(),
  rollup: z.string().optional(),
})

export const BlobScanBlobSchema = z.object({
  commitment: z.string(),
  proof: z.string(),
  size: z.number(),
  versionedHash: z.string(),
  dataStorageReferences: z.array(BlobScanDataStorageReferenceSchema),
  index: z.number(),
  txHash: z.string(),
  txIndex: z.number(),
  blockHash: z.string(),
  blockNumber: z.number(),
  blockTimestamp: z.string(),
  transaction: BlobScanTransactionSchema,
})

export const BlobScanGetBlobsResponseSchema = z.object({
  blobs: z.array(BlobScanBlobSchema),
  totalBlobs: z.number().optional(),
})
export type BlobScanGetBlobsResponse = z.infer<
  typeof BlobScanGetBlobsResponseSchema
>

export type BlobScanBlobSchema = z.infer<typeof BlobScanBlobSchema>
export type BlobScanDataStorageReference = z.infer<
  typeof BlobScanDataStorageReferenceSchema
>
export type BlobScanTransaction = z.infer<typeof BlobScanTransactionSchema>
