import { UnixTime } from '@l2beat/shared-pure'
import { formatError } from '../../../utils/formatError'
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
      throw new Error('Blockscout API request failed', {
        cause: { status: response.status, statusText: response.statusText },
      })
    }

    const json = await response.json()
    const data = BlockscoutResponseSchema.parse(json)
    if (data.status !== '1' || data.message !== 'OK') {
      throw new Error('Blockscout API returned an error', {
        cause: { message: data.message, result: data.result },
      })
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
