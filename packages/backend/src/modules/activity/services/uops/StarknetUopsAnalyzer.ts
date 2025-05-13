import { assert, type Block, type Transaction } from '@l2beat/shared-pure'
import isArray from 'lodash/isArray'
import type { UopsAnalyzer } from './types'

export class StarknetUopsAnalyzer implements UopsAnalyzer {
  calculateUops(block: Block) {
    const uops = block.transactions.reduce(
      (acc, tx) => acc + this.getOperationsCount(tx, block.number),
      0,
    )

    return uops
  }

  getOperationsCount(tx: Transaction, blockNumber: number): number {
    assert(
      tx.data === undefined || isArray(tx.data),
      `Starknet tx should have calldata as array: ${tx.hash}`,
    )
    // Starknet has different execute signatures over time:
    //	- up to block 2999 it's a single-call only, calldata is pointing directly to a contract so we count it as 1
    //	- since block 3000 up to 299 999 it's a multi-call with signature  __execute__(call_array_len, call_array, calldata_len, calldata, nonce)
    //		so the first element can be interpreted as number of operations
    //	- since block 300 000 it's a different signature __execute__(calls) but still first argument reflects overall number of operations
    if (blockNumber < 3000 || tx.type !== 'INVOKE' || !tx.data) {
      return 1
    }

    return Number(tx.data[0])
  }
}
