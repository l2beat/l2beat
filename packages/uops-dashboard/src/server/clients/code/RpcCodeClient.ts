import { createHash } from 'crypto'
import {} from '@l2beat/shared'
import { providers } from 'ethers'
import { Chain } from '../../../chains'
import { getApiKey, getApiUrl } from '../apiUrls'

export class RpcCodeClient {
  private readonly provider: providers.Provider

  constructor(private readonly chain: Chain) {
    const apiUrl = getApiUrl(chain.id)
    const apiKey = getApiKey(chain.id, 'RPC')
    this.provider = new providers.StaticJsonRpcProvider({
      url: `${apiUrl}/${apiKey}`,
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
