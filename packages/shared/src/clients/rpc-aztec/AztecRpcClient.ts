import type { json } from '@l2beat/shared-pure'
import { generateId } from '../../tools/generateId'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import type { AztecBlock, AztecBlockClient, AztecBlockHeader } from '../types'
import {
  AztecGetBlockNumberResponse,
  AztecGetBlocksResponse,
  AztecGetBlockHeadersResponse,
  AztecRpcErrorResponse,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
}

export class AztecRpcClient extends ClientCore implements AztecBlockClient {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber(): Promise<number> {
    const method = 'aztec_getBlockNumber'
    const response = await this.query(method, [])
    const parsedResponse = AztecGetBlockNumberResponse.safeParse(response)

    if (!parsedResponse.success) {
      this.$.logger.warn('Invalid response', {
        method,
        response: JSON.stringify(response),
      })
      throw new Error(`${method}: Error during parsing`)
    }

    return parsedResponse.data.result
  }

  async getBlocks(start: number, limit: number): Promise<AztecBlock[]> {
    const method = 'aztec_getBlocks'
    const response = await this.query(method, [
      start,
      limit,
      { includeTransactions: true },
    ])
    const parsedResponse = AztecGetBlocksResponse.safeParse(response)

    if (!parsedResponse.success) {
      this.$.logger.warn('Invalid response', {
        method,
        start,
        limit,
        response: JSON.stringify(response),
      })
      throw new Error(`${method}: Error during parsing`)
    }

    return parsedResponse.data.result
  }

  async getBlockHeaders(
    start: number,
    limit: number,
  ): Promise<AztecBlockHeader[]> {
    const method = 'aztec_getBlocks'
    const response = await this.query(method, [
      start,
      limit,
      { includeTransactions: false },
    ])
    const parsedResponse = AztecGetBlockHeadersResponse.safeParse(response)

    if (!parsedResponse.success) {
      this.$.logger.warn('Invalid response', {
        method,
        start,
        limit,
        response: JSON.stringify(response),
      })
      throw new Error(`${method}: Error during parsing`)
    }

    return parsedResponse.data.result
  }

  async query(method: string, params: unknown[]) {
    return await this.fetch(this.$.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: this.$.generateId ? this.$.generateId() : generateId(),
      }),
      redirect: 'follow',
      timeout: 10_000,
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = AztecRpcErrorResponse.safeParse(response)
    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        errorCode: parsedError.data.error.code,
        errorMessage: parsedError.data.error.message,
      })
      return { success: false }
    }
    return { success: true }
  }

  get chain() {
    return this.$.sourceName
  }
}
