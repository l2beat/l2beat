import { UnixTime } from '@l2beat/shared-pure'
import { type Validator, v } from '@l2beat/validate'
import {
  decodeFunctionResult,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import type { RpcClientConfig } from './types'

const DECIMALS_ABI = parseAbi(['function decimals() view returns (uint8)'])
const SYMBOL_ABI = parseAbi(['function symbol() view returns (string)'])
const SYMBOL_BYTES32_ABI = parseAbi([
  'function symbol() view returns (bytes32)',
])

const RpcEnvelopeSchema = v.object({
  id: v.union([v.string(), v.number()]),
  jsonrpc: v.string(),
  result: v.unknown().optional(),
  error: v
    .object({
      code: v.number(),
      message: v.string(),
    })
    .optional(),
})

const HexStringSchema = v
  .string()
  .check((s): s is Hex => s.startsWith('0x'), 'expected 0x-prefixed hex string')

const BlockSchema = v.object({
  timestamp: HexStringSchema,
})

export class RpcClient {
  constructor(private readonly config: RpcClientConfig) {}

  async test(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.query('eth_blockNumber', [], HexStringSchema)
      return { success: true }
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

    const result = await this.call(callData, 'latest')

    if (result === '0x') {
      throw new Error(
        `Could not get decimals for token ${address} for URL ${this.config.url}`,
      )
    }

    const decimals = Number(
      decodeFunctionResult({
        abi: DECIMALS_ABI,
        functionName: 'decimals',
        data: result,
      }),
    )

    if (Number.isNaN(decimals)) {
      throw new Error(
        `Invalid decimals response for token ${address} for URL ${this.config.url}: ${result}`,
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

    const result = await this.call(callData, 'latest')

    if (result === '0x') {
      throw new Error(
        `Could not get symbol for token ${address} for URL ${this.config.url}`,
      )
    }

    try {
      const symbol = decodeFunctionResult({
        abi: SYMBOL_ABI,
        functionName: 'symbol',
        data: result,
      })

      if (!symbol) {
        throw new Error(
          `Invalid symbol response for token ${address} for URL ${this.config.url}: ${result}`,
        )
      }

      return symbol
    } catch {
      console.log('Fallback to bytes32 symbol')
    }

    const bytes32Symbol = decodeFunctionResult({
      abi: SYMBOL_BYTES32_ABI,
      functionName: 'symbol',
      data: result,
    })
    const symbol = Buffer.from(bytes32Symbol.slice(2), 'hex')
      .toString('utf8')
      .replace(/\0+$/g, '')

    if (!symbol) {
      throw new Error(
        `Invalid symbol response for token ${address} for URL ${this.config.url}: ${result}`,
      )
    }

    return symbol
  }

  async getBlockNumber(): Promise<number> {
    const result = await this.query('eth_blockNumber', [], HexStringSchema)
    return Number.parseInt(result, 16)
  }

  async getCode(
    address: string,
    blockNumber: 'latest' | number,
  ): Promise<string> {
    return await this.query(
      'eth_getCode',
      [address, encodeBlock(blockNumber)],
      HexStringSchema,
    )
  }

  async getBlockTimestamp(blockNumber: number): Promise<UnixTime> {
    const block = await this.query(
      'eth_getBlockByNumber',
      [encodeBlock(blockNumber), false],
      BlockSchema,
    )
    return UnixTime(Number.parseInt(block.timestamp, 16))
  }

  private async call(
    callData: { to: string; data: string },
    blockNumber: 'latest' | number,
  ): Promise<Hex> {
    return await this.query(
      'eth_call',
      [callData, encodeBlock(blockNumber)],
      HexStringSchema,
    )
  }

  private async query<T>(
    method: string,
    params: unknown[],
    resultSchema: Validator<T>,
  ): Promise<T> {
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
    const envelope = RpcEnvelopeSchema.parse(data)

    if (envelope.error) {
      throw new Error(
        `RPC error: ${envelope.error.code} - ${envelope.error.message}`,
      )
    }

    return resultSchema.parse(envelope.result)
  }
}

function encodeBlock(blockNumber: 'latest' | number): string {
  return blockNumber === 'latest' ? 'latest' : `0x${blockNumber.toString(16)}`
}
