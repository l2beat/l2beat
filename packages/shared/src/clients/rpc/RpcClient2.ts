import { assert } from '@l2beat/shared-pure'
import { isArray } from 'lodash'
import { HttpClient2 } from '../http/HttpClient2'

interface RpcClient2Deps {
  http: HttpClient2
  chain: string
  url: string
}

export interface Block {
  transactions: string[]
}

export class RpcClient2 {
  constructor(private readonly $: RpcClient2Deps) {}

  async getBlock(blockNumber: number, includeFullTxs: boolean) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const block = (await this.$.http.fetchJson(this.$.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        method: 'eth_getBlockByNumber',
        params: [`0x${blockNumber.toString(16)}`, includeFullTxs],
        // TODO: should we use UUID here?
        id: 1,
        jsonrpc: '2.0',
      }),
      redirect: 'follow',
    })) as Block

    // TODO: do we need extensive pattern checking with Zod? check performance
    assert(block.transactions && isArray(block.transactions))

    return {
      transactions: block.transactions,
    }
  }
}
