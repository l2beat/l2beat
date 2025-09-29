import type { Block, json } from '@l2beat/shared-pure'
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

const TIMESTAMP_SHIFT = 4300

export class PolkadotRpcClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber(): Promise<number> {
    const block = await this.getBlock()
    return Number(block.header.number)
  }

  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<Block> {
    const height = blockNumber === 'latest' ? undefined : blockNumber
    const block = await this.getBlock(height)

    const bn = Number(block.header.number)

    return {
      number: bn,
      hash: 'UNSUPPORTED',
      timestamp: PolkadotRpcClient.calculateAvailTimestamp(bn),
      transactions: [], // UNSUPPORTED
    }
  }

  async getBlock(height?: number): Promise<PolkadotBlock> {
    const hashResponse = await this.query(
      'chain_getBlockHash',
      height ? [height] : [],
    )

    const hash = PolkadotGetBlockHashResponse.safeParse(hashResponse)

    if (!hash.success) {
      this.$.logger.warn('Invalid response', {
        height,
        response: JSON.stringify(hash),
      })
      throw new Error(`Block ${height ?? 'latest'}: Error during parsing`)
    }

    const blockResponse = await this.query('chain_getBlock', [hash.data.result])

    const block = PolkadotGetBlockResponse.safeParse(blockResponse)

    if (!block.success) {
      this.$.logger.warn('Invalid response', {
        height,
        response: JSON.stringify(blockResponse),
      })
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

  static calculateAvailTimestamp(blockNumber: number) {
    const referenceBlock = 1
    const referenceTimestamp = 1720082320

    // Define the block time interval in milliseconds (20 seconds)
    const blockInterval = 20 // 20 seconds

    // Calculate the difference in blocks
    const blockDifference = blockNumber - referenceBlock

    // Calculate the timestamp by adding the time difference to the reference timestamp
    const timestamp =
      referenceTimestamp + blockDifference * blockInterval + TIMESTAMP_SHIFT

    return timestamp
  }
}
