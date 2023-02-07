import { RateLimiter } from '../../tools/RateLimiter'
import { EthereumAddress } from '../../types'
import { HttpClient } from '../HttpClient'
import { ContractSourceResult, EtherscanResponse } from './model'

export class EtherscanClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 120,
  })
  private readonly timeoutMs = 10_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly apiKey: string,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
  }

  async getContractSource(address: EthereumAddress) {
    const response = await this.call('contract', 'getsourcecode', {
      address: address.toString(),
    })
    if (response.status !== '1') {
      throw new Error(
        `Error response ${response.message} ${JSON.stringify(response.result)}`,
      )
    }
    return ContractSourceResult.parse(response.result)[0]
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: this.apiKey,
    })
    const url = `${this.url}?${query.toString()}`

    const res = await this.httpClient.fetch(url, { timeout: this.timeoutMs })

    if (!res.ok) {
      throw new Error(
        `Server responded with non-2XX result: ${res.status} ${res.statusText}`,
      )
    }

    const json = (await res.json()) as unknown
    return EtherscanResponse.parse(json)
  }
}
