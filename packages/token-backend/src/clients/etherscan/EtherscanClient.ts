import {
  ContractCreationResultSchema,
  type EtherscanClientConfig,
  EtherscanResponseSchema,
} from './types'

const DEFAULT_BASE_URL = 'https://api.etherscan.io/v2/api'

export class EtherscanClient {
  constructor(
    private readonly config: EtherscanClientConfig,
    private readonly chainId: number,
  ) {}

  async getContractCreation(address: string) {
    const url = this.buildUrl({
      module: 'contract',
      chainid: this.chainId.toString(),
      action: 'getcontractcreation',
      contractaddresses: address,
    })

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(
        `Etherscan API error: ${response.status} ${response.statusText}`,
      )
    }

    const json = await response.json()
    const data = EtherscanResponseSchema.parse(json)

    if (data.status !== '1' || data.message !== 'OK') {
      throw new Error(`Etherscan API error: ${data.message ?? 'Unknown error'}`)
    }

    return ContractCreationResultSchema.parse(data.result)
  }

  private buildUrl(params: Record<string, string>): string {
    const queryParams = new URLSearchParams({
      ...params,
      apikey: this.config.apiKey,
    })
    return `${this.config.baseUrl ?? DEFAULT_BASE_URL}?${queryParams.toString()}`
  }
}
