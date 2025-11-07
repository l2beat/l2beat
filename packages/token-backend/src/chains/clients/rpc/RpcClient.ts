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
  constructor(
    private readonly config: RpcClientConfig,
    private readonly chain: string,
  ) {}

  async getDecimals(address: string): Promise<number> {
    const callData = {
      to: address,
      data: DECIMALS_SELECTOR,
    }

    const response = await this.call(callData, 'latest')

    if (!response.result || response.result === '0x') {
      throw new Error(
        `Could not get decimals for token ${address} on ${this.chain}`,
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
        `Invalid decimals response for token ${address} on ${this.chain}: ${response.result}`,
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

    const body = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [callData, blockParam],
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
