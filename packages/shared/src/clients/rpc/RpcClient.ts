import {
  assert,
  type Block,
  Bytes,
  type EthereumAddress,
  type json,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { generateId } from '../../tools/generateId'
import {
  ClientCore,
  type ClientCoreDependencies as ClientCoreDependencies,
} from '../ClientCore'
import type { BlockClient, LogsClient } from '../types'
import type { MulticallV3Client } from './multicall/MulticallV3Client'
import {
  type CallParameters,
  EVMBalanceResponse,
  type EVMBlock,
  EVMBlockResponse,
  type EVMBlockWithTransactions,
  EVMBlockWithTransactionsResponse,
  EVMCallResponse,
  type EVMLog,
  EVMLogsResponse,
  EVMTransactionReceiptResponse,
  EVMTransactionResponse,
  Quantity,
  RPCError,
  RpcResponse,
} from './types'

interface Dependencies extends Omit<ClientCoreDependencies, 'sourceName'> {
  url: string
  chain: string
  generateId?: () => string
  multicallClient?: MulticallV3Client
}

type Param =
  | string
  | number
  | boolean
  | Record<string, string | string[] | string[][]>

export class RpcClient extends ClientCore implements BlockClient, LogsClient {
  multicallClient?: MulticallV3Client

  constructor(private readonly $: Dependencies) {
    super({ ...$, sourceName: $.chain })
    this.multicallClient = $.multicallClient
  }

  async getLatestBlockNumber() {
    const block = await this.getBlock('latest', false)
    return Number(block.number)
  }

  /** Calls eth_getBlockByNumber on RPC, includes full transactions bodies.*/
  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<Block> {
    return await this.getBlock(blockNumber, true)
  }

  async getBlockParentBeaconRoot(blockNumber: number): Promise<string> {
    const block = await this.getBlock(blockNumber, false)

    assert(
      block.parentBeaconBlockRoot,
      `Block ${block}: parentBeaconBlockRoot should be defined`,
    )
    return block.parentBeaconBlockRoot
  }

  async getBlock(
    blockNumber: 'latest' | number,
    includeTxs: false,
  ): Promise<EVMBlock>
  async getBlock(
    blockNumber: 'latest' | number,
    includeTxs: true,
  ): Promise<EVMBlockWithTransactions>
  async getBlock(blockNumber: 'latest' | number, includeTxs: boolean) {
    const method = 'eth_getBlockByNumber'
    const encodedNumber =
      blockNumber === 'latest' ? 'latest' : Quantity.encode(BigInt(blockNumber))
    const blockResponse = await this.query(method, [encodedNumber, includeTxs])

    const block = includeTxs
      ? EVMBlockWithTransactionsResponse.safeParse(blockResponse)
      : EVMBlockResponse.safeParse(blockResponse)
    if (!block.success) {
      this.$.logger.warn('Invalid response', {
        blockNumber,
        includeTxs,
        response: JSON.stringify(blockResponse),
      })
      throw new Error(`Block ${blockNumber}: Error during parsing`)
    }

    return { ...block.data.result }
  }

  async getTransaction(txHash: string) {
    const response = await this.query('eth_getTransactionByHash', [txHash])

    const transaction = EVMTransactionResponse.safeParse(response)
    if (!transaction.success) {
      this.$.logger.warn('Invalid response', {
        txHash,
        response: JSON.stringify(response),
      })
      throw new Error(`Tx ${txHash}: Error during parsing`)
    }

    return { ...transaction.data.result }
  }

  async getTransactionReceipt(txHash: string) {
    const response = await this.query('eth_getTransactionReceipt', [txHash])

    const receipt = EVMTransactionReceiptResponse.safeParse(response)
    if (!receipt.success) {
      this.$.logger.warn('Invalid response', {
        txHash,
        response: JSON.stringify(response),
      })
      throw new Error(`Receipt ${txHash}: Error during parsing`)
    }

    return { ...receipt.data.result }
  }

  async getBalance(
    holder: EthereumAddress,
    blockNumber: number | 'latest',
  ): Promise<bigint> {
    const method = 'eth_getBalance'
    const encodedNumber =
      blockNumber === 'latest' ? 'latest' : Quantity.encode(BigInt(blockNumber))
    const balanceResponse = await this.query(method, [
      holder.toString(),
      encodedNumber,
    ])

    const balance = EVMBalanceResponse.safeParse(balanceResponse)
    if (!balance.success) {
      this.$.logger.warn('Invalid response', {
        blockNumber,
        holder,
        response: JSON.stringify(balanceResponse),
      })
      throw new Error(
        `Balance of ${holder} at block ${blockNumber}: Error during parsing`,
      )
    }
    return balance.data.result
  }

  async getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: string[],
  ): Promise<EVMLog[]> {
    const method = 'eth_getLogs'
    const response = await this.query(method, [
      {
        address: addresses ?? [],
        topics: topics ? [topics] : [],
        fromBlock: Quantity.encode(BigInt(from)),
        toBlock: Quantity.encode(BigInt(to)),
      },
    ])

    const logsResponse = EVMLogsResponse.safeParse(response)
    if (!logsResponse.success) {
      // in EVM chains there can be a limit on the number of logs returned
      const parsedError = RPCError.safeParse(response)
      if (parsedError.success && isLimitExceededError(parsedError.data)) {
        const midpoint = Math.floor((from + to) / 2)

        this.$.logger.warn('Limit exceeded for logs. Splitting in half', {
          from,
          to,
          midpoint,
        })

        const results = await Promise.all([
          this.getLogs(from, midpoint, addresses, topics),
          this.getLogs(midpoint + 1, to, addresses, topics),
        ])

        return results.flat()
      }

      this.$.logger.warn('Invalid response', {
        method,
        response: JSON.stringify(response),
      })
      throw new Error('Error during parsing')
    }

    return logsResponse.data.result
  }

  async call(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    const method = 'eth_call'
    const encodedNumber = encodeBlockNumber(blockNumber)
    const callObject = buildCallObject(callParams)

    const params = [callObject, encodedNumber]
    const callResponse = await this.query(method, params)
    const callResult = EVMCallResponse.safeParse(callResponse)

    if (!callResult.success) {
      this.$.logger.warn('Error during call', JSON.stringify(callResponse))
      throw new Error('Call response: Error during parsing')
    }

    return Bytes.fromHex(callResult.data.result)
  }

  isMulticallDeployed(blockNumber: number) {
    return !!(
      this.$.multicallClient && this.$.multicallClient.sinceBlock <= blockNumber
    )
  }

  async multicall(calls: CallParameters[], blockNumber: number) {
    assert(
      this.$.multicallClient &&
        blockNumber >= this.$.multicallClient.sinceBlock,
      `Multicall not configured for block ${blockNumber}`,
    )

    const batches = this.$.multicallClient.encodeBatches(calls)

    this.$.logger.debug('Multicall', { batches: batches.length })

    const batchedResults = await Promise.all(
      batches.map(async (batch) => {
        assert(this.$.multicallClient)
        return this.$.multicallClient.decode(
          await this.call(batch, blockNumber),
        )
      }),
    )

    return batchedResults.flat()
  }

  async batchCall(
    calls: {
      params: CallParameters
      blockNumber: number | 'latest'
    }[],
  ): Promise<Bytes[]> {
    const method = 'eth_call'
    const params = calls.map((call) => [
      buildCallObject(call.params),
      encodeBlockNumber(call.blockNumber),
    ])

    const callResponse = await this.batchQuery(method, params)
    const callResult = v.array(EVMCallResponse).safeParse(callResponse)

    if (!callResult.success) {
      this.$.logger.warn(
        'Error during batch call',
        JSON.stringify(callResponse),
      )
      throw new Error('BatchCall response: Error during parsing')
    }

    return callResult.data.map((c) => Bytes.fromHex(c.result))
  }

  async query(method: string, params: Param[]) {
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
      timeout: 10_000,
    })
  }

  // TODO: add multi-method support
  async batchQuery(method: string, paramsBatch: Param[][]) {
    const queries = paramsBatch.map((params) => ({
      method: method,
      params: params,
      id: this.$.generateId ? this.$.generateId() : generateId(),
      jsonrpc: '2.0',
    }))

    const response = await this.fetch(this.$.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queries),
      redirect: 'follow',
      timeout: 10_000, // Most RPCs respond in ~2s during regular conditions
    })

    const results = new Map(
      v
        .array(RpcResponse)
        .parse(response)
        .map((p) => [p.id, p]),
    )

    return queries.map((q) => {
      const r = results.get(q.id)
      assert(r, `Request with ${q.id} not found`)
      return r
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = RPCError.safeParse(response)

    if (parsedError.success) {
      // no retry in this case
      if (isLimitExceededError(parsedError.data)) {
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
    return this.$.chain
  }
}

function encodeBlockNumber(blockNumber: number | 'latest'): string {
  return blockNumber === 'latest'
    ? 'latest'
    : Quantity.encode(BigInt(blockNumber))
}

function buildCallObject(callParams: CallParameters): Record<string, string> {
  return {
    to: callParams.to.toString(),
    data: callParams.data.toString(),
  }
}

function isLimitExceededError(response: RPCError) {
  if (
    response.error &&
    (response.error.message.includes('Log response size exceeded') ||
      response.error.message.includes('query exceeds max block range 100000') ||
      response.error.message.includes(
        'eth_getLogs is limited to a 10,000 range',
      ) ||
      response.error.message.includes('returned more than 10000'))
  ) {
    return true
  }

  return false
}
