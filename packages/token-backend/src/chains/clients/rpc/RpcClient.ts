import { v } from '@l2beat/validate'
import type { RpcClientConfig, RpcResponse } from './types'

// ERC20 decimals() function selector: 0x313ce567
const DECIMALS_SELECTOR = '0x313ce567'

const RpcResponseSchema = v.object({
  id: v.union([v.string(), v.number()]),
  jsonrpc: v.string(),
  result: v.string().optional(),
  error: v
    .object({
      code: v.number(),
      message: v.string(),
    })
    .optional(),
})

export class RpcClient {
  constructor(private readonly config: RpcClientConfig) {}

  async test(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.query('eth_blockNumber', [])
      return {
        success: response.result !== undefined && !response.error,
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

  async getDecimals(address: string): Promise<number> {
    const callData = {
      to: address,
      data: DECIMALS_SELECTOR,
    }

    const response = await this.call(callData, 'latest')

    if (!response.result || response.result === '0x') {
      throw new Error(
        `Could not get decimals for token ${address} for URL ${this.config.url}`,
      )
    }

    // Decode uint8 from hex string
    // Response is padded (e.g., "0x0000000000000000000000000000000000000000000000000000000000000012")
    // or can be shorter (e.g., "0x12")
    // Remove '0x' prefix and parse as integer
    const hexValue = response.result.startsWith('0x')
      ? response.result.slice(2)
      : response.result

    const decimals = Number.parseInt(hexValue, 16)

    if (Number.isNaN(decimals)) {
      throw new Error(
        `Invalid decimals response for token ${address} for URL ${this.config.url}: ${response.result}`,
      )
    }

    return decimals
  }

  private async call(
    callData: { to: string; data: string },
    blockNumber: 'latest' | number,
  ): Promise<RpcResponse> {
    const blockParam =
      blockNumber === 'latest' ? 'latest' : `0x${blockNumber.toString(16)}`

    return await this.query('eth_call', [callData, blockParam])
  }

  private async query(method: string, params: unknown[]): Promise<RpcResponse> {
    const body = {
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }

    const response = await fetch(this.config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(
        `RPC call failed: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()
    const parsed = RpcResponseSchema.parse(data)

    if (parsed.error) {
      throw new Error(
        `RPC error: ${parsed.error.code} - ${parsed.error.message}`,
      )
    }

    return parsed
  }
}
