import { v } from '@l2beat/validate'
import {
  BaseError,
  createPublicClient,
  ExecutionRevertedError,
  http,
  parseAbi,
} from 'viem'
import type { Address, Chain } from '../config/types'
import { JsonRpcClient } from './JsonRpcClient'

export interface AccountInfo {
  kind: 'eoa' | 'contract' | 'delegated'
  nonce?: string
  // EIP-7702 delegation target of a delegated EOA.
  delegate?: `0x${string}`
}

export interface BasicTxInfo {
  to: Address
  data: `0x${string}`
}

export class AlchemyClient {
  private client = new JsonRpcClient()

  constructor(private key: string) {}

  async getSafeState(address: `0x${string}`, chain: Chain) {
    const client = createPublicClient({
      transport: http(this.url(chain), { timeout: 15_000, retryCount: 1 }),
    })
    const blockNumber = await client.getBlockNumber()
    const abi = parseAbi([
      'function nonce() view returns (uint256)',
      'function VERSION() view returns (string)',
    ])
    const [nonce, version] = await Promise.all([
      client.readContract({ address, abi, functionName: 'nonce', blockNumber }),
      client.readContract({
        address,
        abi,
        functionName: 'VERSION',
        blockNumber,
      }),
    ])
    return {
      nonce: nonce.toString(),
      version,
      blockNumber: blockNumber.toString(),
    }
  }

  async getAccount(address: `0x${string}`, chain: Chain): Promise<AccountInfo> {
    const code = HexString.parse(
      await this.client.call(this.url(chain), {
        method: 'eth_getCode',
        params: [address, 'latest'],
      }),
    ).toLowerCase()
    const delegation = /^0xef0100([\da-f]{40})$/.exec(code)
    if (code !== '0x' && !delegation) return { kind: 'contract' }

    const nonce = BigInt(
      HexString.parse(
        await this.client.call(this.url(chain), {
          method: 'eth_getTransactionCount',
          params: [address, 'latest'],
        }),
      ),
    ).toString()
    if (!delegation) return { kind: 'eoa', nonce }
    return { kind: 'delegated', nonce, delegate: `0x${delegation[1]}` }
  }

  // Reads every call at one block. A reverted call reads as null.
  async readState(
    address: `0x${string}`,
    calls: `0x${string}`[],
    chain: Chain,
  ) {
    const client = createPublicClient({
      transport: http(this.url(chain), { timeout: 15_000, retryCount: 1 }),
    })
    const blockNumber = await client.getBlockNumber()
    const results = await Promise.all(
      calls.map(async (data) => {
        try {
          const result = await client.call({ to: address, data, blockNumber })
          return result.data ?? '0x'
        } catch (error) {
          if (
            error instanceof BaseError &&
            error.walk((cause) => cause instanceof ExecutionRevertedError)
          ) {
            return null
          }
          throw error
        }
      }),
    )
    return { blockNumber: blockNumber.toString(), results }
  }

  async getTransaction(
    hash: `0x${string}`,
    chain: Chain,
  ): Promise<BasicTxInfo | undefined> {
    const tx = await this.client.call(this.url(chain), {
      method: 'eth_getTransactionByHash',
      params: [hash],
    })
    if (!tx) {
      return undefined
    }
    const response = TransactionResponse.safeParse(tx)
    if (!response.success) {
      return undefined
    }
    return {
      data: response.data.input.toLowerCase() as `0x${string}`,
      to: `${chain.shortName}:${response.data.to.toLowerCase()}` as Address,
    }
  }

  private url(chain: Chain) {
    return `https://${chain.alchemyId}.g.alchemy.com/v2/${this.key}`
  }
}

const HexString = v.string().check((v) => /^0x[a-f\d]*$/i.test(v))

const TransactionResponse = v.object({
  input: v.string().check((v) => /^0x[a-f\d]*$/i.test(v)),
  to: v.string().check((v) => /^0x[a-f\d]{40}$/i.test(v)),
})
