import { HttpClient } from '../HttpClient'

export class EtherscanClient {
  constructor(
    private etherscanApiKey: string,
    private httpClient: HttpClient
  ) {}

  async getBlockNumberAtOrBefore(unixTimestamp: number): Promise<BigInt> {
    const params = new URLSearchParams({
      module: 'block',
      action: 'getblocknobytime',
      timestamp: unixTimestamp.toString(),
      closest: 'before',
      apikey: this.etherscanApiKey,
    })

    const url = `https://api.etherscan.io/api?${params}`
    const response = await this.httpClient.fetch(url)

    // TODO: proper parsing
    const json = await response.json()
    return BigInt(json.result)
  }
}
