import { HttpClient } from '@l2beat/common'
import { RpcEstimateGas, RpcGetBalance } from '@l2beat/config'

import { makeHandler, UptimeHandlers } from './handler'
import { rpcSchema } from './schemas'

export class RpcMonitor {
  handlers: UptimeHandlers = []

  constructor(private http: HttpClient) {
    this.handlers = [
      makeHandler('rpc_estimateGas', this.estimateGas.bind(this)),
      makeHandler('rpc_getBalance', this.getBalance.bind(this)),
    ]
  }

  async estimateGas({ url, from, to }: RpcEstimateGas) {
    const body = {
      jsonrpc: '2.0',
      method: 'eth_estimateGas',
      params: [{ from, to, value: '0x1' }],
      id: 145,
    }

    return await this.fetchAndParseRpc(url, JSON.stringify(body))
  }

  async getBalance({ url, to, data }: RpcGetBalance) {
    const body = {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{ to, data }, 'latest'],
      id: 145,
    }

    return await this.fetchAndParseRpc(url, JSON.stringify(body))
  }

  private async fetchAndParseRpc(url: string, body: string) {
    const { response, time } = await this.http.timedFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    await response.json().then((data) => rpcSchema.parse(data))

    return {
      active: true,
      time,
    }
  }
}
