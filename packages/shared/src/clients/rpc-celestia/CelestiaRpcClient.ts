import { type Block, type json, UnixTime } from '@l2beat/shared-pure'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  CelestiaBlockResponse,
  type CelestiaBlockResult,
  CelestiaBlockResultResponse,
  CelestiaErrorResponse,
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
    const block = await this.getBlockResult()
    return Number(block.height)
  }

  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<Block> {
    const height = blockNumber === 'latest' ? undefined : blockNumber
    const block = await this.getBlockResult(height)
    const blockTimestamp = await this.getBlockTimestamp(height)

    return {
      number: Number(block.height),
      hash: 'UNSUPPORTED',
      timestamp: blockTimestamp,
      transactions: [], // UNSUPPORTED
    }
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

  async getBlockResult(height?: number): Promise<CelestiaBlockResult> {
    const response = await this.query('block_results', {
      ...(height && { height: height.toString() }),
    })

    const blockResponse = CelestiaBlockResultResponse.safeParse(response)

    if (!blockResponse.success) {
      this.$.logger.warn('Invalid response', {
        height,
        response: JSON.stringify(blockResponse),
      })
      throw new Error(`Block ${height ?? 'latest'}: Error during parsing`)
    }

    return blockResponse.data.result
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
