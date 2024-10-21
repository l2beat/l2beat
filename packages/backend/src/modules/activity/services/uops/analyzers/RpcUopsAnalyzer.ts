import { sum } from 'lodash'

import {
  ERC4337_methods,
  Method,
  Operation,
  SAFE_methods,
  isErc4337,
  isGnosisSafe,
} from '@l2beat/shared'
import {
  EVMBlock,
  EVMTransaction,
} from '@l2beat/shared/build/clients/rpc/types'
import type { AnalyzedBlock, Analyzer } from '../types'

export class RpcUopsAnalyzer implements Analyzer {
  analyzeBlock(rpcBlock: EVMBlock): AnalyzedBlock {
    const uops = rpcBlock.transactions.map((tx: EVMTransaction) =>
      this.mapTransaction(tx),
    )
    return {
      uopsLength: sum(uops),
      transactionsLength: rpcBlock.transactions.length,
    }
  }

  mapTransaction(tx: EVMTransaction): number {
    const methods = ERC4337_methods.concat(SAFE_methods)

    if (isErc4337(tx) || isGnosisSafe(tx)) {
      return this.countUserOperations(tx.data, methods)
    }

    return 1
  }

  countUserOperations(calldata: string, methods: Method[]): number {
    const countOperationsRecursive = (
      operation: Operation,
      methods: Method[],
    ): number => {
      if (operation.type === 'static') {
        return operation.count
      }

      const selector = operation.calldata.slice(0, 10)
      const method = methods.find((m) => m.selector === selector)

      if (!method) {
        return 1
      }

      const operations = method.count(operation.calldata)
      let count = 0
      for (const operation of operations) {
        const result = countOperationsRecursive(operation, methods)
        count += result
      }

      return count
    }

    const rootOperation = countOperationsRecursive(
      { type: 'recursive', calldata },
      methods,
    )
    return rootOperation
  }
}
