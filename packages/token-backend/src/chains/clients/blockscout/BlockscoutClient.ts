import { UnixTime } from '@l2beat/shared-pure'
import {
  type BlockscoutClientConfig,
  BlockscoutResponseSchema,
  ContractCreationResultSchema,
  TransactionInfoSchema,
} from './types'

export class BlockscoutClient {
  constructor(private readonly config: BlockscoutClientConfig) {}

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
          error: error.message,
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

  async getTransactionInfo(txHash: string) {
    const data = await this.call('transaction', 'gettxinfo', {
      txhash: txHash,
    })
    return TransactionInfoSchema.parse(data)
  }

  private async call(
    module: string,
    action: string,
    params?: Record<string, string>,
  ) {
    const url = this.buildUrl({
      module,
      action,
      ...params,
    })
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(
        `Blockscout API error: ${response.status} ${response.statusText}`,
      )
    }

    const json = await response.json()
    const data = BlockscoutResponseSchema.parse(json)
    if (data.status !== '1' || data.message !== 'OK') {
      throw new Error(
        `Blockscout API error: ${data.message ?? 'Unknown error'}. ${data.result}`,
      )
    }

    return data.result
  }

  private buildUrl(params: Record<string, string>): string {
    const queryParams = new URLSearchParams({
      ...params,
    })
    return `${this.config.url}?${queryParams.toString()}`
  }
}
