import { UnixTime } from '@l2beat/shared-pure'
import { formatError } from '../../../utils/formatError'
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

  async test(): Promise<{ success: boolean; error?: string }> {
    try {
      const data = await this.call('block', 'getblocknobytime', {
        timestamp: UnixTime.now().toString(),
        closest: 'before',
      })
      return {
        success: data !== undefined,
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: formatError(error),
        }
      }
      return {
        success: false,
        error: 'Unknown error',
      }
    }
  }

  async getContractCreation(address: string) {
    const data = await this.call('contract', 'getcontractcreation', {
      contractaddresses: address,
    })

    return ContractCreationResultSchema.parse(data)
  }

  private async call(
    module: string,
    action: string,
    params?: Record<string, string>,
  ) {
    const url = this.buildUrl({
      module,
      action,
      chainid: this.chainId.toString(),
      ...params,
    })
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Etherscan API request failed', {
        cause: { status: response.status, statusText: response.statusText },
      })
    }

    const json = await response.json()
    const data = EtherscanResponseSchema.parse(json)
    if (data.status !== '1' || data.message !== 'OK') {
      throw new Error('Etherscan API returned an error', {
        cause: { message: data.message, result: data.result },
      })
    }

    return data.result
  }

  private buildUrl(params: Record<string, string>): string {
    const queryParams = new URLSearchParams({
      ...params,
      apikey: this.config.apiKey,
    })
    return `${this.config.baseUrl ?? DEFAULT_BASE_URL}?${queryParams.toString()}`
  }
}
