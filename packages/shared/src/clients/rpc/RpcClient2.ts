import { Logger } from '@l2beat/backend-tools'
import { RateLimiter, UnixTime } from '@l2beat/shared-pure'
import { generateId } from '../../tools/generateId'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'
import { HttpClient2 } from '../http/HttpClient2'
import { Block, RpcResponse } from './types'

interface RpcClient2Deps {
  http: HttpClient2
  logger: Logger
  url: string
  callsPerMinute?: number
}

export class RpcClient2 {
  constructor(private readonly $: RpcClient2Deps) {
    const rateLimiter = new RateLimiter({
      callsPerMinute: this.$.callsPerMinute ?? 60,
    })
    this.query = rateLimiter.wrap(this.query.bind(this))
    this.$.logger = this.$.logger.for(this)
  }

  async getBlock(blockNumber?: number, includeFullTxs?: boolean) {
    const method = 'eth_getBlockByNumber'
    const encodedNumber = blockNumber
      ? `0x${blockNumber.toString(16)}`
      : 'latest'
    const txDetail = includeFullTxs ?? false
    const blockResponse = await this.query(method, [encodedNumber, txDetail])

    const block = Block.safeParse(blockResponse)
    if (!block.success) {
      this.$.logger.error(JSON.stringify(blockResponse))
      throw new Error('Error during parsing of eth_getBlockByNumber response')
    }
    return block.data
  }

  async getBlockNumber(blockNumber?: number) {
    const block = await this.getBlock(blockNumber, false)
    return Number(block.number)
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime, start = 0) {
    const end = await this.getBlockNumber()

    return await getBlockNumberAtOrBefore(
      timestamp,
      start,
      end,
      this.getBlock.bind(this),
    )
  }

  async query(method: string, params: (string | number | boolean)[]) {
    const blockResponse = await this.$.http.fetchJson(this.$.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method,
        params,
        id: generateId(),
        jsonrpc: '2.0',
      }),
      redirect: 'follow',
    })

    // this parsing is needed for APIs which return 200 and error in the body
    const response = RpcResponse.safeParse(blockResponse)
    if (!response.success) {
      this.$.logger.error(JSON.stringify(response))
      throw new Error('Error during parsing of rpc response')
    }
    return response.data.result
  }
}
