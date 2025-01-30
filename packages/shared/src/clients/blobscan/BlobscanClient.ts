import type { json } from '@l2beat/shared-pure'
import type { RequestInit } from 'node-fetch'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  type BlobSchema,
  GetBlobsResponseSchema,
  GetTransactionsWithBlobsSchema,
} from './types'

// API does not limit it in anyway, so arbitrary limit
const MAX_PER_PAGE = 500

interface Dependencies extends ClientCoreDependencies {
  baseUrl: string
  timeout?: number
  maxPerPage?: number
}

export class BlobScanClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getBlobs(fromBlock: number, toBlock: number) {
    const blobs: BlobSchema[] = []

    const firstPage = await this._getBlobs(fromBlock, toBlock, 1)

    blobs.push(...firstPage.blobs)

    if (firstPage.totalBlobs && firstPage.totalBlobs > MAX_PER_PAGE) {
      const expectedPages = Math.ceil(firstPage.totalBlobs / MAX_PER_PAGE) - 1

      const pages = Array.from({ length: expectedPages }, (_, i) => i + 2)

      await Promise.all(
        pages.map(async (page) => {
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
      1, // first page
    )

    txs.push(...firstPage.transactions)

    if (
      firstPage.totalTransactions &&
      firstPage.totalTransactions > MAX_PER_PAGE
    ) {
      const expectedPages =
        Math.ceil(firstPage.totalTransactions / MAX_PER_PAGE) - 1

      const pages = Array.from({ length: expectedPages }, (_, i) => i + 2)

      await Promise.all(
        pages.map(async (page) => {
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
      ps: (this.$.maxPerPage ?? MAX_PER_PAGE).toString(),
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
    const url = `${this.$.baseUrl}${endpoint}`

    return this.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...options,
    })
  }

  override validateResponse(_response: json): {
    success: boolean
    message?: string
  } {
    // TODO: Implement
    return { success: true }
  }
}
