import type { json } from '@l2beat/shared-pure'
import { generateId } from '../../tools/generateId'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  type PolkadotBlock,
  PolkadotErrorResponse,
  PolkadotGetBlockHashResponse,
  PolkadotGetBlockResponse,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
}

export class PolkadotRpcClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getBlock(height?: number): Promise<PolkadotBlock> {
    const hashResponse = await this.query(
      'chain_getBlockHash',
      height ? [height] : [],
    )

    const hash = PolkadotGetBlockHashResponse.safeParse(hashResponse)

    if (!hash.success) {
      throw new Error(`Block ${height ?? 'latest'}: Error during parsing`)
    }

    const blockResponse = await this.query('chain_getBlock', [hash.data.result])

    const block = PolkadotGetBlockResponse.safeParse(blockResponse)

    if (!block.success) {
      console.log(block.error)
      throw new Error(`Block ${height ?? 'latest'}: Error during parsing`)
    }

    return block.data.result.block
  }

  async query(
    method: string,
    params: (string | number | boolean | Record<string, string>)[],
  ) {
    return await this.fetch(this.$.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method,
        params,
        id: this.$.generateId ? this.$.generateId() : generateId(),
        jsonrpc: '2.0',
      }),
      redirect: 'follow',
      timeout: 5_000, // Most RPCs respond in ~2s during regular conditions
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = PolkadotErrorResponse.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn(`Response validation error`, {
        ...parsedError.data.error,
      })
      return { success: false }
    }

    return { success: true }
  }
}
