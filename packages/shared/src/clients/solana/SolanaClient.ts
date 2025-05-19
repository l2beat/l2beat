import type { json } from '@l2beat/shared-pure'
import { generateId } from '../../tools/generateId'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  SolanaApiErrorResponse,
  SolanaGetBlockResponse,
  SolanaGetBlockTimeResponse,
  SolanaGetLatestBlockhashResponse,
  type SvmBlock,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
}

export class SolanaClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
  }

  async getLatestSlotNumber(): Promise<number> {
    const method = 'getLatestBlockhash'

    const response = await this.query(method, [{ commitment: 'finalized' }])

    const parsedResponse = SolanaGetLatestBlockhashResponse.safeParse(response)

    if (!parsedResponse.success) {
      this.$.logger.warn(`Invalid response`, {
        method,
        response: JSON.stringify(response),
      })
      throw new Error(`getLatestBlockhash: Error during parsing`)
    }

    return parsedResponse.data.result.context.slot
  }

  async getBlockWithTransactions(slot: number): Promise<SvmBlock | undefined> {
    const method = 'getBlock'

    const response = await this.query(method, [
      slot,
      {
        encoding: 'json',
        maxSupportedTransactionVersion: 0,
        transactionDetails: 'accounts',
        rewards: false,
      },
    ])

    const parsedResponse = SolanaGetBlockResponse.safeParse(response)

    if (!parsedResponse.success) {
      const parsedError = SolanaApiErrorResponse.safeParse(response)

      if (
        parsedError.success &&
        parsedError.data.error.code === -32009 &&
        parsedError.data.error.message.match(
          /Slot \d+ was skipped, or missing in long-term storage/,
        )
      ) {
        // in Solana chains there can be a slot that is skipped
        return undefined
      }

      this.$.logger.warn(`Invalid response`, {
        method,
        slot,
        response: JSON.stringify(response),
      })

      throw new Error(`getBlock: Error during parsing`)
    }

    const block = parsedResponse.data.result

    return {
      number: block.blockHeight,
      hash: block.blockhash,
      timestamp: block.blockTime,
      transactionsCount: block.transactions.length,
    }
  }

  async getSlotTime(slot: number): Promise<{ timestamp: number }> {
    const method = 'getBlockTime'

    let currentSlot = slot
    let timestamp: number | null = null

    while (timestamp === null) {
      const response = await this.query(method, [slot])

      const parsedResponse = SolanaGetBlockTimeResponse.safeParse(response)

      if (!parsedResponse.success) {
        this.$.logger.warn(`Invalid response`, {
          method,
          currentSlot,
          response: JSON.stringify(response),
        })
        throw new Error('getBlockTime: Error during parsing')
      }

      currentSlot -= 1
      timestamp = parsedResponse.data.result
    }

    return { timestamp }
  }

  async query(
    method: string,
    params: (
      | string
      | number
      | boolean
      | Record<string, string | number | boolean>
    )[],
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
    const parsedError = SolanaApiErrorResponse.safeParse(response)

    if (parsedError.success) {
      if (
        // in Solana chains there can be a slot that is skipped
        parsedError.data.error.code === -32009 &&
        parsedError.data.error.message.match(
          /Slot \d+ was skipped, or missing in long-term storage/,
        )
      ) {
        return { success: true }
      }

      this.$.logger.warn(`Response validation error`, {
        message: parsedError.data.error.message,
      })
      return { success: false }
    }

    return { success: true }
  }

  get chain() {
    return this.$.sourceName
  }
}
