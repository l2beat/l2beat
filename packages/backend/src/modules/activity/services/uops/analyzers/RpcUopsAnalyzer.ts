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
import type {
  AnalyzedBlock,
  Analyzer,
  CountedOperation,
  Method,
  Operation,
} from '../types'

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

  private async mapTransaction(
    tx: providers.TransactionResponse,
  ): Promise<number> {
    if (
      tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_6_0 ||
      tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_7_0 ||
      tx.to?.toLowerCase() === SAFE_MULTI_SEND_CALL_ONLY_1_3_0
    ) {
      return await this.createTransaction(tx)
    }

    const selector = tx.data.slice(0, 10)
    if (selector === SAFE_EXEC_TRANSACTION_SELECTOR) {
      return this.createTransaction(tx)
    }

    return 1
  }

  private async createTransaction(
    tx: providers.TransactionResponse,
  ): Promise<number> {
    const methods = ERC4337_methods.concat(SAFE_methods)
    const countedOperation = await this.countUserOperations(tx.data, methods)

    return countedOperation.count
  }

  private async countUserOperations(
    calldata: string,
    methods: Method[],
  ): Promise<CountedOperation> {
    const countOperationsRecursive = (
      operation: Operation,
      level: number,
      methods: Method[],
    ): CountedOperation => {
      if (operation.type === 'static') {
        return {
          count: operation.count,
          children: [],
        }
      }

      const selector = operation.calldata.slice(0, 10)
      const method = methods.find((m) => m.selector === selector)

      if (!method) {
        return {
          count: 1,
          children: [],
        }
      }

      const operations = method.count(operation.calldata)
      let count = 0
      const children: CountedOperation[] = []
      for (const operation of operations) {
        const result = countOperationsRecursive(operation, level + 1, methods)
        count += result.count
        children.push(result)
      }

      return {
        count,
        children,
      }
    }

    const rootOperation = countOperationsRecursive(
      { type: 'recursive', calldata },
      0,
      methods,
    )
    return rootOperation
  }
}
