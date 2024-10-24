import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { RetryHandler } from '../../tools/RetryHandler'
import { generateId } from '../../tools/generateId'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import { HttpClient2 } from '../http/HttpClient2'
import { EVMBlock, Quantity, RPCError, RpcResponse } from './types'

interface RpcClient2Deps {
  url: string
  http: HttpClient2
  rateLimiter: RateLimiter
  retryHandler: RetryHandler
  logger: Logger
  chain: string
}

// TODO: create EVMBlockClient
export class RpcClient2 {
  chain: string

  constructor(private readonly $: RpcClient2Deps) {
    this.chain = $.chain
    this.$.logger = this.$.logger.for(this).tag($.chain)
  }

  /** Calls eth_getBlockByNumber on RPC, includes full transactions bodies.
   * The query is wrapped with rate limiting and retry handling.
   */
  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<EVMBlock> {
    const method = 'eth_getBlockByNumber'
    const encodedNumber =
      blockNumber === 'latest' ? 'latest' : Quantity.encode(BigInt(blockNumber))
    const blockResponse = await this.query(method, [encodedNumber, true])

    const block = EVMBlock.safeParse(blockResponse)
    if (!block.success) {
      throw new Error(`Block ${blockNumber}: Error during parsing`)
    }
    return block.data
  }

  async getLatestBlockNumber() {
    const block = await this.getBlockWithTransactions('latest')
    return Number(block.number)
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

  async query(method: string, params: (string | number | boolean)[]) {
    try {
      return await this.$.rateLimiter.call(() => this._query(method, params))
    } catch {
      return await this.$.retryHandler.retry(() =>
        this.$.rateLimiter.call(() => this._query(method, params)),
      )
    }
  }

  async _query(method: string, params: (string | number | boolean)[]) {
    const response = await this.$.http.fetch(
      this.$.url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          params,
          id: generateId(),
          jsonrpc: '2.0',
        }),
        redirect: 'follow',
      },
      5_000, // Most RPCs respond in ~2s during regular conditions
    )

    // this parsing is needed for APIs which return 200 and error in the body
    const parsed = RpcResponse.safeParse(response)
    // TODO: add per-provider parsing heuristics
    if (!parsed.success) {
      const parsedError = RPCError.safeParse(response)

      if (parsedError.success) {
        throw new Error(
          `${parsedError.data.error.code}: ${parsedError.data.error.message}`,
        )
      }

      throw new Error(
        `Error during parsing of rpc response: ${method} ${JSON.stringify(params)}`,
      )
    }
    return parsed.data.result
  }
}
