import { v } from '@l2beat/validate'
import { createPublicClient, http, parseAbi } from 'viem'
import type { Address, Chain } from '../config/types'
import { JsonRpcClient } from './JsonRpcClient'

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

  async hasNoCode(address: `0x${string}`, chain: Chain): Promise<boolean> {
    const code = await this.client.call(this.url(chain), {
      method: 'eth_getCode',
      params: [address, 'latest'],
    })
    return code === '0x'
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

const TransactionResponse = v.object({
  input: v.string().check((v) => /^0x[a-f\d]*$/i.test(v)),
  to: v.string().check((v) => /^0x[a-f\d]{40}$/i.test(v)),
})
