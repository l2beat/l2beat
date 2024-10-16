import { providers } from 'ethers'
import { sum } from 'lodash'
import {
  ENTRY_POINT_ADDRESS_0_6_0,
  ENTRY_POINT_ADDRESS_0_7_0,
} from '../protocols/erc-4337/const'
import { ERC4337_methods } from '../protocols/erc-4337/methods'
import {
  SAFE_EXEC_TRANSACTION_SELECTOR,
  SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
} from '../protocols/gnosisSafe/const'
import { SAFE_methods } from '../protocols/gnosisSafe/methods'
import type { AnalyzedBlock, Analyzer, Method, Operation } from '../types'

export class RpcUopsAnalyzer implements Analyzer {
  async analyzeBlock(rpcBlock: {
    transactions: providers.TransactionResponse[]
  }): Promise<AnalyzedBlock> {
    const uops = await Promise.all(
      rpcBlock.transactions.map((tx: providers.TransactionResponse) =>
        this.mapTransaction(tx),
      ),
    )
    return {
      uopsLength: sum(uops),
      transactionsLength: rpcBlock.transactions.length,
    }
  }

  async mapTransaction(tx: providers.TransactionResponse): Promise<number> {
    const methods = ERC4337_methods.concat(SAFE_methods)

    const selector = tx.data.slice(0, 10)
    if (
      tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_6_0 ||
      tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_7_0 ||
      tx.to?.toLowerCase() === SAFE_MULTI_SEND_CALL_ONLY_1_3_0 ||
      selector === SAFE_EXEC_TRANSACTION_SELECTOR
    ) {
      return await this.countUserOperations(tx.data, methods)
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
