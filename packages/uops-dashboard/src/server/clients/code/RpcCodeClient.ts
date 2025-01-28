import { createHash } from 'crypto'
import { providers } from 'ethers'
import type { Chain } from '../../../chains'

export class RpcCodeClient {
  private readonly provider: providers.Provider

  constructor(private readonly chain: Chain) {
    this.provider = new providers.StaticJsonRpcProvider({
      url: this.chain.blockchainApi.url,
      timeout: 15_000,
    })
  }

  async getCodeHash(address: string): Promise<string | undefined> {
    // eth_getCode
    const code = await this.provider.getCode(address)

    if (code === '0x') {
      return undefined
    }

    return createHash('sha256').update(code).digest('hex')
  }
}
