import type { Block } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { Chain } from '@/chains'
import type { BlockClient } from './BlockClient'

// TODO: To be replaced by BlockProvider from @l2beat/shared
export class StarknetClient implements BlockClient {
  constructor(private readonly chain: Chain) {}

  async getLatestBlockNumber(): Promise<number> {
    const params = ['latest']

    const response = await fetch(this.chain.blockchainApi.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'starknet_getBlockWithTxHashes',
        params,
        id: Math.floor(Math.random() * 1000),
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Starknet getBlock request failed with status: ${response.status}`,
      )
    }

    const text = await response.text()
    const json: unknown = JSON.parse(text)

    const { result: block } = StarknetGetBlockResponseBodySchema.parse(json)
    return block.block_number
  }

  async getBlockWithTransactions(blockNumber: number): Promise<Block> {
    const params = [{ block_number: blockNumber }]

    const response = await fetch(this.chain.blockchainApi.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'starknet_getBlockWithTxs',
        params,
        id: Math.floor(Math.random() * 1000),
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Starknet getBlock request failed with status: ${response.status}`,
      )
    }

    const text = await response.text()
    const json: unknown = JSON.parse(text)

    const { result: block } =
      StarknetGetBlockWithTxsResponseBodySchema.parse(json)

    return {
      number: block.block_number,
      timestamp: block.timestamp,
      hash: block.block_hash,
      transactions: block.transactions.map((tx: StarknetApiTransaction) => ({
        hash: tx.transaction_hash,
        data: tx.calldata ?? [],
        type: tx.type,
        from: tx.sender_address ?? '',
      })),
    }
  }
}

const StarknetGetBlockResponseBodySchema = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number().check((v) => Number.isInteger(v)),
  result: v.object({
    block_number: v.number().check((v) => Number.isInteger(v)),
    timestamp: v.number().check((v) => Number.isInteger(v)),
    transactions: v.array(v.string()),
  }),
})

const StarknetTransaction = v.object({
  type: v.string(),
  calldata: v.array(v.string()).optional(),
  transaction_hash: v.string(),
  sender_address: v.string().optional(),
})

type StarknetApiTransaction = v.infer<typeof StarknetTransaction>

const StarknetBlock = v.object({
  block_hash: v.string(),
  block_number: v.number().check((v) => Number.isInteger(v)),
  status: v.string(),
  timestamp: v.number().check((v) => Number.isInteger(v)),
  transactions: v.array(StarknetTransaction),
})

const StarknetGetBlockWithTxsResponseBodySchema = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number().check((v) => Number.isInteger(v)),
  result: StarknetBlock,
})
