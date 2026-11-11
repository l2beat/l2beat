import { EthRpcClient, Http } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { createHash } from 'crypto'

export interface CodeClient {
  getCodeHash(address: string): Promise<string | undefined>
}

export class RpcCodeClient implements CodeClient {
  private readonly client: EthRpcClient

  constructor(url: string, callsPerMinute: number) {
    const http = new Http({
      timeoutMs: 15_000,
      maxCallsPerMinute: callsPerMinute,
    })
    this.client = new EthRpcClient(http, url)
  }

  async getCodeHash(address: string): Promise<string | undefined> {
    const code = await this.client.getCode(EthereumAddress(address), 'latest')
    if (code === '0x') {
      return undefined
    }
    return createHash('sha256').update(code).digest('hex')
  }
}
