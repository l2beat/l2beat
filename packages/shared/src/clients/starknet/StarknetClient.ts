import { Block, UnixTime, json } from '@l2beat/shared-pure'
import { generateIntId } from '../../tools/generateId'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import { ClientCore, ClientCoreDependencies } from '../ClientCore'
import {
  StarknetErrorResponse,
  StarknetGetBlockResponse,
  StarknetGetBlockWithTxsResponse,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
}

export class StarknetClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber() {
    const params = ['latest']

    const response = await this.query('starknet_getBlockWithTxHashes', params)

    const latestBlockNumberResponse =
      StarknetGetBlockResponse.safeParse(response)

    if (!latestBlockNumberResponse.success) {
      throw new Error(`Latest block number: Error during parsing`)
    }

    return Number(latestBlockNumberResponse.data.result.block_number)
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getLatestBlockNumber()
    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      end,
      this.getBlockWithTransactions.bind(this),
    )
  }

  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const params = [{ block_number: blockNumber }]

    const response = await this.query('starknet_getBlockWithTxs', params)

    const blockResponse = StarknetGetBlockWithTxsResponse.safeParse(response)

    if (!blockResponse.success) {
      throw new Error(`Block ${blockNumber}: Error during parsing`)
    }

    return {
      number: blockResponse.data.result.block_number,
      hash: blockResponse.data.result.block_hash,
      timestamp: blockResponse.data.result.timestamp,
      transactions: blockResponse.data.result.transactions.map((t) => ({
        hash: t.transaction_hash,
        from: t.sender_address,
        type: t.type,
        data: t.calldata,
      })),
    }
  }

  async query(method: string, params: unknown) {
    return await this.fetch(this.$.url, {
      method: 'POST',
      headers: {
        ['Content-Type']: 'application/json',
      },
      timeout: 30_000,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: this.$.generateId ? this.$.generateId() : generateIntId(),
      }),
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = StarknetErrorResponse.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn(`Response validation error`, {
        ...parsedError.data.error,
      })
      return { success: false }
    }

    return { success: true }
  }

  get chain() {
    return 'starknet'
  }
}
