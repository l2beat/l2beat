import { EthereumAddress, Hash256, RateLimiter } from '@l2beat/shared-pure'

import { HttpClient } from '../HttpClient'
import {
  ContractCreatorAndCreationTxHashResult,
  ContractSourceResult,
  EtherscanResponse,
} from './model'

export class EtherscanClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 120,
  })
  private readonly timeoutMs = 10_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly apiKey: string,
    private readonly retryCount = 3,
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

  async getContractDeploymentTx(address: EthereumAddress): Promise<Hash256> {
    const response = await this.call('contract', 'getcontractcreation', {
      contractaddresses: address.toString(),
    })
    if (response.status !== '1') {
      throw new Error(
        `Error response ${response.message} ${JSON.stringify(response.result)}`,
      )
    }

    return ContractCreatorAndCreationTxHashResult.parse(response.result)[0]
      .txHash
  }

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: this.apiKey,
    })
    const url = `${this.url}?${query.toString()}`

    let res = undefined
    for (let i = 0; i < this.retryCount; i++) {
      try {
        res = await this.httpClient.fetch(url, { timeout: this.timeoutMs })
        break
      } catch (err) {
        continue
      }
    }

    if (!res) {
      throw new Error(`Failed to fetch ${url}`)
    }

    if (!res.ok) {
      throw new Error(
        `Server responded with non-2XX result: ${res.status} ${res.statusText}`,
      )
    }

    const json = (await res.json()) as unknown
    return EtherscanResponse.parse(json)
  }
}
