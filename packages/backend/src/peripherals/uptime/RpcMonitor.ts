import { HttpClient } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'

import { rpcSchema } from './schemas'

export class RpcMonitor {
  constructor(private http: HttpClient) {}

  async estimateGas(url: string, from: EthereumAddress, to: EthereumAddress) {
    const body = {
      jsonrpc: '2.0',
      method: 'eth_estimateGas',
      params: [{ from, to, value: '0x1' }],
      id: 145,
    }

    return await this.fetchAndParseRpc(url, JSON.stringify(body))
  }

  async getBalance(url: string, to: EthereumAddress, data: string) {
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
