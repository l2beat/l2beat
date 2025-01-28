import type { Chain } from '@/chains'
import type { Block } from '@l2beat/shared-pure'
import { z } from 'zod'
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

const StarknetGetBlockResponseBodySchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number().int(),
  result: z.object({
    block_number: z.number().int(),
    timestamp: z.number().int(),
    transactions: z.array(z.string()),
  }),
})

const StarknetTransaction = z.object({
  type: z.string(),
  calldata: z.array(z.string()).optional(),
  transaction_hash: z.string(),
  sender_address: z.string().optional(),
})

type StarknetApiTransaction = z.infer<typeof StarknetTransaction>

const StarknetBlock = z.object({
  block_hash: z.string(),
  block_number: z.number().int(),
  status: z.string(),
  timestamp: z.number().int(),
  transactions: z.array(StarknetTransaction),
})

const StarknetGetBlockWithTxsResponseBodySchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number().int(),
  result: StarknetBlock,
})
