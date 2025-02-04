import { isArray, sum } from 'lodash'

import {
  EIP712_methods,
  ERC20ROUTER_methods,
  ERC4337_methods,
  MULTICALLV3_methods,
  type Method,
  type Operation,
  SAFE_methods,
  isEip712,
  isErc20Router,
  isErc4337,
  isGnosisSafe,
  isMulticallv3,
} from '@l2beat/shared'
import { assert, type Block, type Transaction } from '@l2beat/shared-pure'

export class RpcUopsAnalyzer {
  calculateUops(rpcBlock: Block) {
    const uops = rpcBlock.transactions.map((tx: Transaction) =>
      this.mapTransaction(tx),
    )
    return sum(uops)
  }

  mapTransaction(tx: Transaction): number {
    const methods = ERC4337_methods.concat(SAFE_methods)
      .concat(EIP712_methods)
      .concat(MULTICALLV3_methods)
      .concat(ERC20ROUTER_methods)

    if (
      isErc4337(tx) ||
      isGnosisSafe(tx) ||
      isEip712(tx) ||
      isMulticallv3(tx) ||
      isErc20Router(tx)
    ) {
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

      let operations = []
      try {
        operations = method.count(operation.calldata)
      } catch {
        return 1
      }

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
