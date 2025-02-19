import type { json } from '@l2beat/shared-pure'
import type { RequestInit } from 'node-fetch'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  type BlobSchema,
  BlobscanErrorSchema,
  GetBlobsResponseSchema,
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
      // expand property to get transaction data
      expand: 'transaction',
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
      /* Blobscan API has longer response times */
      timeout: this.$.timeout ?? 30_000,
      ...options,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = BlobscanErrorSchema.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn(`Response validation error`, {
        error: parsedError.data,
      })
      return { success: false }
    }

    return { success: true }
  }
}
