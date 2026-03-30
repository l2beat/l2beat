import { v } from '@l2beat/validate'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import type { RpcClientConfig, RpcResponse } from './types'

const DECIMALS_ABI = parseAbi(['function decimals() view returns (uint8)'])
const SYMBOL_ABI = parseAbi(['function symbol() view returns (string)'])
const SYMBOL_BYTES32_ABI = parseAbi([
  'function symbol() view returns (bytes32)',
])

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
      data: encodeFunctionData({
        abi: DECIMALS_ABI,
        functionName: 'decimals',
      }),
    }

    const response = await this.call(callData, 'latest')

    if (!response.result || response.result === '0x') {
      throw new Error(
        `Could not get decimals for token ${address} for URL ${this.config.url}`,
      )
    }

    const decimals = Number(
      decodeFunctionResult({
        abi: DECIMALS_ABI,
        functionName: 'decimals',
        data: response.result as Hex,
      }),
    )

    if (Number.isNaN(decimals)) {
      throw new Error(
        `Invalid decimals response for token ${address} for URL ${this.config.url}: ${response.result}`,
      )
    }

    return decimals
  }

  async getSymbol(address: string): Promise<string> {
    const callData = {
      to: address,
      data: encodeFunctionData({
        abi: SYMBOL_ABI,
        functionName: 'symbol',
      }),
    }

    const response = await this.call(callData, 'latest')

    if (!response.result || response.result === '0x') {
      throw new Error(
        `Could not get symbol for token ${address} for URL ${this.config.url}`,
      )
    }

    try {
      const symbol = decodeFunctionResult({
        abi: SYMBOL_ABI,
        functionName: 'symbol',
        data: response.result as Hex,
      })

      if (!symbol) {
        throw new Error(
          `Invalid symbol response for token ${address} for URL ${this.config.url}: ${response.result}`,
        )
      }

      return symbol
    } catch {
      console.log('Fallback to bytes32 symbol')
    }

    const bytes32Symbol = decodeFunctionResult({
      abi: SYMBOL_BYTES32_ABI,
      functionName: 'symbol',
      data: response.result as Hex,
    })
    const symbol = Buffer.from(bytes32Symbol.slice(2), 'hex')
      .toString('utf8')
      .replace(/\0+$/g, '')

    if (!symbol) {
      throw new Error(
        `Invalid symbol response for token ${address} for URL ${this.config.url}: ${response.result}`,
      )
    }

    return symbol
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
