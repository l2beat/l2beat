import { HttpClient } from '../HttpClient'
import { asBigIntFromString } from './asBigIntFromString'
import { parseEtherscanResponse } from './parseEtherscanResponse'

export class EtherscanError extends Error {}

export class EtherscanClient {
  constructor(
    private etherscanApiKey: string,
    private httpClient: HttpClient
  ) {}

  async getBlockNumberAtOrBefore(unixTimestamp: number): Promise<BigInt> {
    const result = await this.execute('block', 'getblocknobytime', {
      timestamp: unixTimestamp.toString(),
      closest: 'before',
    })
    return asBigIntFromString(result)
  }

  private async execute(
    module: string,
    action: string,
    params: Record<string, string>
  ) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: this.etherscanApiKey,
    })

    const url = `https://api.etherscan.io/api?${query}`
    const res = await this.httpClient.fetch(url)
    const text = await res.text()
    if (!res.ok) {
      throw new Error(`Http error ${res.status}: ${text}`)
    }
    const parsed = parseEtherscanResponse(text)
    if (parsed.message !== 'OK') {
      throw new EtherscanError(parsed.result)
    }
    return parsed.result
  }
}
