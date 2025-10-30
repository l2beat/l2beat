import { type Block, type json, UnixTime } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  type CelestiaBlobResponse,
  CelestiaBlobsResponse,
  CelestiaBlockchainResponse,
  CelestiaBlockResponse,
  CelestiaErrorResponse,
  CelestiaValidatorsResponse,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
}

export class CelestiaRpcClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber(): Promise<number> {
    const response = await this.query('blockchain', {})

    const parsedResponse = CelestiaBlockchainResponse.safeParse(response)

    if (!parsedResponse.success) {
      this.$.logger.warn('Invalid response', {
        response: JSON.stringify(response),
      })
      throw new Error('Error during parsing')
    }

    return Number(parsedResponse.data.result.last_height)
  }

  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<Block> {
    let number: number
    if (blockNumber === 'latest') {
      number = await this.getLatestBlockNumber()
    } else {
      number = blockNumber
    }
    const blockTimestamp = await this.getBlockTimestamp(number)

    return {
      number,
      hash: 'UNSUPPORTED',
      logsBloom: 'UNSUPPORTED',
      timestamp: blockTimestamp,
      transactions: [], // UNSUPPORTED
    }
  }

  async getBlobsForNamespaces(
    height: number,
    namespaces: string[],
  ): Promise<CelestiaBlobResponse[]> {
    const response = await this.fetch(this.$.url, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify({
        id: '1',
        jsonrpc: '2.0',
        method: 'blob.GetAll',
        params: [height, namespaces],
      }),
    })

    const parsedResponse = CelestiaBlobsResponse.safeParse(response)
    if (!parsedResponse.success) {
      this.$.logger.warn('Invalid response', {
        height,
        namespaces,
        response: JSON.stringify(parsedResponse),
      })
      throw new Error(
        `Blobs for namespaces ${namespaces.join(',')}: Error during parsing`,
      )
    }
    return parsedResponse.data.result ?? []
  }

  async getBlockTimestamp(height?: number): Promise<UnixTime> {
    const response = await this.query('block', {
      ...(height && { height: height.toString() }),
    })

    const blockResponse = CelestiaBlockResponse.safeParse(response)

    if (!blockResponse.success) {
      this.$.logger.warn('Invalid response', {
        height,
        response: JSON.stringify(blockResponse),
      })
      throw new Error(`Block ${height ?? 'latest'}: Error during parsing`)
    }

    return UnixTime.fromDate(
      new Date(blockResponse.data.result.block.header.time),
    )
  }

  async getValidatorsInfo({
    page = 1,
    perPage = 100,
  }: {
    page: number
    perPage?: number
  }) {
    const response = await this.query(
      `validators?${new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      }).toString()}`,
      {},
    )

    const parsedResponse = CelestiaValidatorsResponse.safeParse(response)

    if (!parsedResponse.success) {
      this.$.logger.warn('Invalid response', {
        response: JSON.stringify(parsedResponse),
      })
      throw new Error('Error during validators parsing')
    }

    return parsedResponse.data.result
  }

  async query(method: string, params: Record<string, string>) {
    const url = `${this.$.url}${method}`
    const query =
      Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : ''

    return await this.fetch(`${url}${query}`, {
      method: 'GET',
      redirect: 'follow',
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = CelestiaErrorResponse.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        ...parsedError.data.error,
      })
      return { success: false }
    }

    return { success: true }
  }

  get chain() {
    return this.$.sourceName
  }
}
