import type { Block, json } from '@l2beat/shared-pure'
import { generateIntId } from '../../tools/generateId'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import type { BlockClient } from '../types'
import {
  STARKNET_ERROR_CODES,
  type StarknetCallParameters,
  StarknetCallResponse,
  StarknetClassHashResponse,
  StarknetClassResponse,
  type StarknetContractClass,
  StarknetErrorResponse,
  type StarknetEvent,
  StarknetGetBlockResponse,
  StarknetGetBlockWithTxsResponse,
  StarknetGetEventsResponse,
  StarknetStorageResponse,
  type StarknetTransaction,
} from './types'

export type { StarknetContractClass, StarknetEvent } from './types'
export { STARKNET_ERROR_CODES } from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
  headers?: Record<string, string>
  /**
   * JSON-RPC error codes that are semantic answers rather than failures
   * (e.g. CONTRACT_NOT_FOUND when probing an address). Responses with these
   * codes pass validation instead of triggering retries; callers inspect them.
   */
  allowedErrorCodes?: number[]
}

export type StarknetBlockId = number | 'latest'

type StarknetCallResult =
  | { success: true; result: string[] }
  | { success: false; errorCode: number; errorMessage: string }

export class StarknetClient extends ClientCore implements BlockClient {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber() {
    const params = ['latest']

    const response = await this.query('starknet_getBlockWithTxHashes', params)

    const latestBlockNumberResponse =
      StarknetGetBlockResponse.safeParse(response)

    if (!latestBlockNumberResponse.success) {
      throw new Error('Latest block number: Error during parsing')
    }

    return Number(latestBlockNumberResponse.data.result.block_number)
  }

  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const params = [{ block_number: blockNumber }]

    const response = await this.query('starknet_getBlockWithTxs', params)

    const blockResponse = StarknetGetBlockWithTxsResponse.safeParse(response)

    if (!blockResponse.success) {
      throw new Error(`Block ${blockNumber}: Error during parsing`)
    }

    // Paradex bug workaround: Paradex returns empty/malformed transactions
    // with missing transaction_hash. For Paradex, we silently filter these out.
    // For other chains, missing transaction_hash throws an error.
    const validTransactions = blockResponse.data.result.transactions.filter(
      (t): t is StarknetTransaction & { transaction_hash: string } => {
        if (!t.transaction_hash && this.$.sourceName !== 'paradex') {
          throw new Error(`Block ${blockNumber}: Missing transaction hash`)
        }
        return !!t.transaction_hash
      },
    )

    return {
      number: blockResponse.data.result.block_number,
      hash: blockResponse.data.result.block_hash,
      timestamp: blockResponse.data.result.timestamp,
      transactions: validTransactions.map((t) => ({
        hash: t.transaction_hash,
        from: t.sender_address,
        type: t.type,
        data: t.calldata,
      })),
      logsBloom: 'UNSUPPORTED',
    }
  }

  async getBlockTimestamps(
    blockNumbers: number[],
  ): Promise<Map<number, number>> {
    const blocks = await Promise.all(
      blockNumbers.map((blockNumber) =>
        this.getBlockWithTransactions(blockNumber),
      ),
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

  /** @returns the class hash, or undefined when no contract is deployed at the address */
  async getClassHashAt(
    address: string,
    blockId: StarknetBlockId,
  ): Promise<string | undefined> {
    const response = await this.query('starknet_getClassHashAt', {
      contract_address: address,
      block_id: toBlockId(blockId),
    })

    if (this.isContractNotFound(response)) {
      return undefined
    }

    const parsed = StarknetClassHashResponse.safeParse(response)
    if (!parsed.success) {
      throw new Error(`Get class hash at ${address}: Error during parsing`)
    }

    return parsed.data.result
  }

  /** @returns the contract class of the contract at the address, or undefined when not deployed */
  async getClassAt(
    address: string,
    blockId: StarknetBlockId,
  ): Promise<StarknetContractClass | undefined> {
    return await this.queryClass('starknet_getClassAt', {
      contract_address: address,
      block_id: toBlockId(blockId),
    })
  }

  /** @returns the contract class with the given hash, or undefined when not declared */
  async getClass(
    classHash: string,
    blockId: StarknetBlockId,
  ): Promise<StarknetContractClass | undefined> {
    return await this.queryClass('starknet_getClass', {
      class_hash: classHash,
      block_id: toBlockId(blockId),
    })
  }

  async getStorageAt(
    address: string,
    key: string,
    blockId: StarknetBlockId,
  ): Promise<string> {
    const response = await this.query('starknet_getStorageAt', {
      contract_address: address,
      key,
      block_id: toBlockId(blockId),
    })

    const parsed = StarknetStorageResponse.safeParse(response)
    if (!parsed.success) {
      throw new Error(`Get storage at ${address}: Error during parsing`)
    }

    return parsed.data.result
  }

  /**
   * Like `call`, but returns semantic failures (reverts, missing entrypoints)
   * as values instead of throwing. Requires the corresponding error codes in
   * `allowedErrorCodes`.
   */
  async tryCall(
    callParams: StarknetCallParameters,
    blockId: StarknetBlockId,
  ): Promise<StarknetCallResult> {
    const response = await this.query('starknet_call', {
      request: callParams,
      block_id: toBlockId(blockId),
    })

    const error = StarknetErrorResponse.safeParse(response)
    if (error.success) {
      return {
        success: false,
        errorCode: error.data.error.code,
        errorMessage: error.data.error.message,
      }
    }

    const parsed = StarknetCallResponse.safeParse(response)
    if (!parsed.success) {
      throw new Error('Call: Error during parsing')
    }

    return { success: true, result: parsed.data.result }
  }

  private async queryClass(
    method: 'starknet_getClassAt' | 'starknet_getClass',
    params: unknown,
  ): Promise<StarknetContractClass | undefined> {
    const response = await this.query(method, params)

    if (this.isContractNotFound(response)) {
      return undefined
    }

    const parsed = StarknetClassResponse.safeParse(response)
    if (!parsed.success) {
      throw new Error(`${method}: Error during parsing`)
    }

    return parsed.data.result
  }

  private isContractNotFound(response: json): boolean {
    const error = StarknetErrorResponse.safeParse(response)
    return (
      error.success &&
      (error.data.error.code === STARKNET_ERROR_CODES.CONTRACT_NOT_FOUND ||
        error.data.error.code === STARKNET_ERROR_CODES.CLASS_HASH_NOT_FOUND)
    )
  }

  async query(method: string, params: unknown) {
    return await this.fetch(this.$.url, {
      method: 'POST',
      headers: {
        ['Content-Type']: 'application/json',
        ...this.$.headers,
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
      if (this.$.allowedErrorCodes?.includes(parsedError.data.error.code)) {
        return { success: true }
      }
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

function toBlockId(blockId: StarknetBlockId) {
  return blockId === 'latest' ? 'latest' : { block_number: blockId }
}
