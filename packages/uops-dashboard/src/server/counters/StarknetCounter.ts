import type { StarknetTransaction } from '@l2beat/shared/uops'
import type { Block, Transaction } from '@l2beat/shared-pure'
import type { CountedBlock, StatResults } from '@/types'
import type { Counter } from './counter'

export class StarknetCounter implements Counter {
  countForBlock(block: Block): CountedBlock {
    return {
      ...block,
      transactions: block.transactions.map((tx: Transaction) => {
        const starknetTx = tx as StarknetTransaction
        return {
          type: starknetTx.type,
          from: starknetTx.from,
          hash: starknetTx.hash,
          operationsCount: this.getOperationsCount(starknetTx, block.number),
        }
      }),
    }
  }

  countForBlocks(blocks: Block[]): StatResults {
    const results: StatResults = {
      dateStart: new Date(),
      dateEnd: new Date(),
      numberOfTransactions: 0,
      numberOfOperations: 0,
      topBlocks: [],
    }

    for (let i = 0; i < blocks.length; i++) {
      const countedBlock = this.countForBlock(blocks[i])

      const uops = countedBlock.transactions.reduce(
        (acc, tx) => acc + tx.operationsCount,
        0,
      )

      if (i === 0) {
        results.dateStart = new Date(blocks[i].timestamp * 1000)
      }

      results.dateEnd = new Date(blocks[i].timestamp * 1000)
      results.numberOfTransactions += blocks[i].transactions.length
      results.numberOfOperations += uops
      results.topBlocks.push({
        number: blocks[i].number,
        ratio: uops / blocks[i].transactions.length,
      })
    }

    // get top ten only
    results.topBlocks = results.topBlocks
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 10)

    return results
  }

  getOperationsCount(tx: StarknetTransaction, blockNumber: number): number {
    // Starknet has different execute signatures over time:
    //	- up to block 2999 it's a single-call only, calldata is pointing directly to a contract so we count it as 1
    //	- since block 3000 up to 299 999 it's a multi-call with signature  __execute__(call_array_len, call_array, calldata_len, calldata, nonce)
    //		so the first element can be interpreted as number of operations
    //	- since block 300 000 it's a different signature __execute__(calls) but still first argument reflects overall number of operations
    if (blockNumber < 3000 || tx.type !== 'INVOKE' || !tx.data.length) {
      return 1
    }

    return Number(tx.data[0])
  }
}
