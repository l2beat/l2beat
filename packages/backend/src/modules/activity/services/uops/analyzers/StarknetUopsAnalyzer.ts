import { StarknetTransaction } from '../../../../../peripherals/starknet/schemas'
import { AnalyzedBlock, Analyzer } from '../types'

export class StarknetUopsAnalyzer implements Analyzer {
  analyzeBlock(block: {
    number: number
    transactions: StarknetTransaction[]
  }): AnalyzedBlock {
    const uopsLength = block.transactions.reduce(
      (acc, tx) => acc + this.getOperationsCount(tx, block.number),
      0,
    )

    return {
      transactionsLength: block.transactions.length,
      uopsLength,
    }
  }

  getOperationsCount(tx: StarknetTransaction, blockNumber: number): number {
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
