import type { Chain } from '@/chains'
import type { Block, StatResults } from '@/types'
import { getApiUrl } from '../../clients/apiUrls'
import type { Analyzer } from '../analyzer'
import {
  StarknetGetBlockResponseBodySchema,
  StarknetGetBlockWithTxsResponseBodySchema,
  type StarknetTransaction,
} from './schemas'

export class StarknetAnalyzer implements Analyzer {
  constructor(private readonly chain: Chain) {}

  async getBlockNumber() {
    const params = ['latest']

    const apiUrl = getApiUrl(this.chain.id)

    const response = await fetch(apiUrl, {
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

  async analyzeBlock(blockNumber: number): Promise<Block> {
    const params = [{ block_number: blockNumber }]

    const apiUrl = getApiUrl(this.chain.id)

    const response = await fetch(apiUrl, {
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
      status: block.status,
      transactions: block.transactions.map((tx: StarknetTransaction) => ({
        type: tx.type,
        hash: tx.transaction_hash,
        operationsCount: this.getOperationsCount(tx, blockNumber),
      })),
    }
  }

  async analyzeBlocks(startBlock: number, count: number): Promise<StatResults> {
    const results: StatResults = {
      dateStart: new Date(),
      dateEnd: new Date(),
      numberOfTransactions: 0,
      numberOfOperations: 0,
      topBlocks: [],
    }

    for (let i = 0; i < count; i++) {
      const block = await this.analyzeBlock(startBlock + i)

      const uops = block.transactions.reduce(
        (acc, tx) => acc + tx.operationsCount,
        0,
      )

      if (i === 0) {
        results.dateStart = new Date(block.timestamp * 1000)
      }

      results.dateEnd = new Date(block.timestamp * 1000)
      results.numberOfTransactions += block.transactions.length
      results.numberOfOperations += uops
      results.topBlocks.push({
        number: block.number,
        ratio: uops / block.transactions.length,
      })
    }

    // get top ten only
    results.topBlocks = results.topBlocks
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 10)

    return results
  }

  private getOperationsCount(
    tx: StarknetTransaction,
    blockNumber: number,
  ): number {
    // Starknet has different execute signatures over time:
    //	- up to block 2999 it's a single-call only, calldata is pointing directly to a contract so we count it as 1
    //	- since block 3000 up to 299 999 it's a multi-call with signature  __execute__(call_array_len, call_array, calldata_len, calldata, nonce)
    //		so the first element can be interpreted as number of operations
    //	- since block 300 000 it's a different signature __execute__(calls) but still first argument reflects overall number of operations
    if (tx.type === 'DEPLOY_ACCOUNT' || blockNumber < 3000) {
      return 1
    }

    if (tx.type !== 'INVOKE') {
      return 0
    }

    if (!tx.calldata) {
      return 0
    }

    return Number(tx.calldata[0])
  }
}
