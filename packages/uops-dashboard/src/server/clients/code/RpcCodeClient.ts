import { createHash } from 'crypto'
import { providers } from 'ethers'
import { Chain } from '../../../chains'
import { getApiUrl } from '../apiUrls'

export class RpcCodeClient {
  private readonly provider: providers.Provider

  constructor(private readonly chain: Chain) {
    const apiUrl = getApiUrl(chain.id)
    this.provider = new providers.StaticJsonRpcProvider({
      url: apiUrl,
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
