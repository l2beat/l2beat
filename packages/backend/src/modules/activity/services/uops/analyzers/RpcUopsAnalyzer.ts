import { isArray, sum } from 'lodash'

import {
  ERC4337_methods,
  Method,
  Operation,
  SAFE_methods,
  isErc4337,
  isGnosisSafe,
} from '@l2beat/shared'
import { assert, Block, Transaction } from '@l2beat/shared-pure'

export class RpcUopsAnalyzer {
  calculateUops(rpcBlock: Block) {
    const uops = rpcBlock.transactions.map((tx: Transaction) =>
      this.mapTransaction(tx),
    )
    return sum(uops)
  }

  mapTransaction(tx: Transaction): number {
    const methods = ERC4337_methods.concat(SAFE_methods)

    if (isErc4337(tx) || isGnosisSafe(tx)) {
      assert(
        tx.data && !isArray(tx.data),
        `EVM Transaction should have data: ${tx.hash}`,
      )
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
