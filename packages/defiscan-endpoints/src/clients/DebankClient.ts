import { ClientCore, type ClientCoreDependencies } from '@l2beat/shared'
import { type EthereumAddress, type json } from '@l2beat/shared-pure'
import {
  DebankComplexProtocolListResponse,
  DebankTokenBalanceListResponse,
  type DebankComplexProtocol,
  type DebankTokenBalance,
} from '../types/debank'

// DeBank API documentation: https://docs.open.debank.com/

interface DebankClientDependencies extends ClientCoreDependencies {
  apiKey: string
  baseUrl: string
}

export class DebankClient extends ClientCore {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(deps: DebankClientDependencies) {
    super(deps)
    this.apiKey = deps.apiKey
    this.baseUrl = deps.baseUrl
  }

  /**
   * Get token balances for an address
   * DeBank API: GET /v1/user/token_list
   * Docs: https://docs.open.debank.com/en/reference/api-pro-reference/user#get-the-users-token-list
   */
  async getTokenBalances(
    address: EthereumAddress,
    chainId?: string,
  ): Promise<DebankTokenBalance[]> {
    const params = new URLSearchParams({
      id: address.toLowerCase(),
    })
    if (chainId) {
      params.append('chain_id', chainId)
    }

    const data = await this.fetch(`${this.baseUrl}/v1/user/token_list?${params}`, {
      timeout: 15_000,
      headers: {
        AccessKey: this.apiKey,
      },
    })

    return DebankTokenBalanceListResponse.parse(data)
  }

  /**
   * Get complex protocol positions for an address
   * DeBank API: GET /v1/user/complex_protocol_list
   * Docs: https://docs.open.debank.com/en/reference/api-pro-reference/user#get-the-users-complex-protocol-list
   */
  async getComplexProtocols(
    address: EthereumAddress,
    chainId?: string,
  ): Promise<DebankComplexProtocol[]> {
    const params = new URLSearchParams({
      id: address.toLowerCase(),
    })
    if (chainId) {
      params.append('chain_id', chainId)
    }

    const data = await this.fetch(
      `${this.baseUrl}/v1/user/complex_protocol_list?${params}`,
      {
        timeout: 15_000,
        headers: {
          AccessKey: this.apiKey,
        },
      },
    )

    return DebankComplexProtocolListResponse.parse(data)
  }

  validateResponse(response: json): { success: boolean; message?: string } {
    // DeBank error format: { "error_code": 10001, "error_msg": "..." }
    if (typeof response === 'object' && response !== null) {
      const error = response as Record<string, unknown>
      if ('error_code' in error && 'error_msg' in error) {
        return {
          success: false,
          message: `DeBank API error: ${error.error_msg}`,
        }
      }
    }
    return { success: true }
  }
}
