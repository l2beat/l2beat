import { UnixTime, json } from '@l2beat/shared-pure'
import { generateId } from '../../tools/generateId'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import {
  ClientCore,
  ClientCoreDeps as ClientCoreDependencies,
} from '../ClientCore'
import { EVMBlock, EVMBlockResponse, Quantity, RPCError } from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  chain: string
  generateId?: () => string
}

export class RpcClient2 extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super({ ...$ })
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

  /** Calls eth_getBlockByNumber on RPC, includes full transactions bodies.*/
  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<EVMBlock> {
    const method = 'eth_getBlockByNumber'
    const encodedNumber =
      blockNumber === 'latest' ? 'latest' : Quantity.encode(BigInt(blockNumber))
    const blockResponse = await this.query(method, [encodedNumber, true])

    const block = EVMBlockResponse.safeParse(blockResponse)
    if (!block.success) {
      throw new Error(`Block ${blockNumber}: Error during parsing`)
    }
    return { ...block.data.result }
  }

  async query(method: string, params: (string | number | boolean)[]) {
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

  override validateResponse(response: json): boolean {
    const parsedError = RPCError.safeParse(response)

    if (parsedError.success) {
      // TODO: based on error return differently
      this.$.logger.warn(`Response validation error`, {
        ...parsedError.data.error,
      })
      return false
    }

    return true
  }

  get chain() {
    return this.$.chain
  }
}
