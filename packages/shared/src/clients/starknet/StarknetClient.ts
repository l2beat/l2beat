import type { Block, json } from '@l2beat/shared-pure'
import { generateIntId } from '../../tools/generateId'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import type { BlockClient, BlockHeader } from '../types'
import {
  type StarknetCallParameters,
  StarknetCallResponse,
  StarknetErrorResponse,
  type StarknetEvent,
  StarknetGetBlockResponse,
  StarknetGetBlockWithReceiptsResponse,
  StarknetGetEventsResponse,
  type StarknetTransaction,
} from './types'

export type { StarknetEvent } from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
}

export class StarknetClient extends ClientCore implements BlockClient {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber() {
    const header = await this.getBlockHeader('latest')
    return header.number
  }

  /** Calls starknet_getBlockWithTxHashes, transactions come as hashes only. */
  async getBlockHeader(blockNumber: number | 'latest'): Promise<BlockHeader> {
    const params = [
      blockNumber === 'latest' ? 'latest' : { block_number: blockNumber },
    ]

    const response = await this.query('starknet_getBlockWithTxHashes', params)

    const blockResponse = StarknetGetBlockResponse.safeParse(response)

    if (!blockResponse.success) {
      throw new Error('Block header: Error during parsing', {
        cause: { blockNumber },
      })
    }

    return {
      number: blockResponse.data.result.block_number,
      timestamp: blockResponse.data.result.timestamp,
    }
  }

  /** Calls starknet_getBlockWithReceipts, whose receipts say which txs reverted. */
  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const params = [{ block_number: blockNumber }]

    const response = await this.query('starknet_getBlockWithReceipts', params)

    const blockResponse =
      StarknetGetBlockWithReceiptsResponse.safeParse(response)

    if (!blockResponse.success) {
      throw new Error(`Block ${blockNumber}: Error during parsing`)
    }

    // Paradex bug workaround: Paradex returns empty/malformed transactions
    // with missing transaction_hash. For Paradex, we silently filter these out.
    // For other chains, missing transaction_hash throws an error.
    const validTransactions = blockResponse.data.result.transactions.filter(
      (
        t,
      ): t is StarknetTransaction & {
        receipt: { transaction_hash: string }
      } => {
        if (!t.receipt.transaction_hash && this.$.sourceName !== 'paradex') {
          throw new Error(`Block ${blockNumber}: Missing transaction hash`)
        }
        return !!t.receipt.transaction_hash
      },
    )

    return {
      number: blockResponse.data.result.block_number,
      hash: blockResponse.data.result.block_hash,
      timestamp: blockResponse.data.result.timestamp,
      transactions: validTransactions.map(({ transaction, receipt }) => ({
        hash: receipt.transaction_hash,
        from: transaction.sender_address,
        type: transaction.type,
        data: transaction.calldata,
        reverted: receipt.execution_status === 'REVERTED',
      })),
      logsBloom: 'UNSUPPORTED',
    }
  }

  async getBlockTimestamps(
    blockNumbers: number[],
  ): Promise<Map<number, number>> {
    const blocks = await Promise.all(
      blockNumbers.map((blockNumber) => this.getBlockHeader(blockNumber)),
    )
    return new Map(blocks.map((block) => [block.number, block.timestamp]))
  }

  async call(
    callParams: StarknetCallParameters,
    blockNumber: number | 'latest',
  ): Promise<string[]> {
    const params = [
      callParams,
      blockNumber === 'latest' ? 'latest' : { block_number: blockNumber },
    ]

    const response = await this.query('starknet_call', params)
    const callResponse = StarknetCallResponse.safeParse(response)

    if (!callResponse.success) {
      throw new Error('Call: Error during parsing')
    }

    return callResponse.data.result
  }

  async getEvents(
    fromBlock: number,
    toBlock: number,
    address: string,
    eventSelectors: string[],
  ): Promise<StarknetEvent[]> {
    const events: StarknetRpcEvent[] = []
    let continuationToken: string | undefined

    do {
      const response = await this.query('starknet_getEvents', [
        {
          from_block: { block_number: fromBlock },
          to_block: { block_number: toBlock },
          address,
          keys: [eventSelectors],
          chunk_size: 1_000,
          ...(continuationToken
            ? { continuation_token: continuationToken }
            : {}),
        },
      ])
      const parsed = StarknetGetEventsResponse.safeParse(response)

      if (!parsed.success) {
        throw new Error('Get events: Error during parsing')
      }

      events.push(...parsed.data.result.events)
      continuationToken = parsed.data.result.continuation_token ?? undefined
    } while (continuationToken)

    const lastEventIndexByTransaction = new Map<string, number>()
    return events.map((event) => {
      const previousEventIndex =
        lastEventIndexByTransaction.get(event.transaction_hash) ?? -1
      const eventIndex = event.event_index ?? previousEventIndex + 1
      lastEventIndexByTransaction.set(event.transaction_hash, eventIndex)

      return { ...event, event_index: eventIndex }
    })
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

type StarknetRpcEvent = Omit<StarknetEvent, 'event_index'> & {
  event_index?: number
}
