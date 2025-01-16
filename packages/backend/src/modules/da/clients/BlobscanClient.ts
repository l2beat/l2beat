import { Logger, RateLimiter } from '@l2beat/backend-tools'

import { HttpClient } from '@l2beat/shared'
import { RequestInit } from 'node-fetch'
import {
  BlobSchema,
  GetBlobsResponseSchema,
  GetTransactionsWithBlobsSchema,
} from './blobscan-model'

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
    const blobs: BlobSchema[] = []

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

    return blobs
  }

  async getBlobsCount(fromBlock: number, toBlock: number) {
    const blobs = await this._getBlobs(fromBlock, toBlock, 1)
    return blobs.totalBlobs
  }

  async getTransactionsWithBlobsByAddress(
    fromBlock: number,
    toBlock: number,
    address: string,
  ) {
    const txs: GetTransactionsWithBlobsSchema['transactions'] = []

    const firstPage = await this._getBlobsByAddress(
      fromBlock,
      toBlock,
      address,
      1,
    )

    txs.push(...firstPage.transactions)

    if (
      firstPage.totalTransactions &&
      firstPage.totalTransactions > MAX_PER_PAGE
    ) {
      await Promise.all(
        Array.from(
          { length: Math.ceil(firstPage.totalTransactions / MAX_PER_PAGE) },
          (_, i) => i + 2, // offset from second page
        ).map(async (page) => {
          const response = await this._getBlobsByAddress(
            fromBlock,
            toBlock,
            address,
            page,
          )
          txs.push(...response.transactions)
        }),
      )
    }

    return txs
  }

  private async _getBlobsByAddress(
    fromBlock: number,
    toBlock: number,
    address: string,
    page: number,
  ) {
    const params = new URLSearchParams({
      startBlock: fromBlock.toString(),
      endBlock: toBlock.toString(),
      to: address,
      p: page.toString(),
      ps: MAX_PER_PAGE.toString(),
      count: 'true',
    })

    const response = await this.call(`transactions?${params.toString()}`)

    return GetTransactionsWithBlobsSchema.parse(response)
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

    return GetBlobsResponseSchema.parse(response)
  }

  private call(endpoint: string, options: RequestInit = {}) {
    return this.httpClient.fetch(`${this.url}/${endpoint}`, {
      timeout: 20_000,
      ...options,
    })
  }
}
