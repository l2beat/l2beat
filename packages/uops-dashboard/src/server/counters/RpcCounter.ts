import type {
  BlockRatio,
  CountedBlock,
  CountedOperation,
  CountedTransaction,
  StatResults,
} from '@/types'

import {
  ENTRY_POINT_ADDRESS_0_6_0,
  ENTRY_POINT_ADDRESS_0_7_0,
  ERC4337_methods,
  EVMBlock,
  EVMTransaction,
  Method,
  Operation,
  SAFE_EXEC_TRANSACTION_SELECTOR,
  SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
  SAFE_methods,
  isErc4337,
  isGnosisSafe,
} from '@l2beat/shared'
import { generateId } from '../../utils/generateId'
import { rankBlocks } from '../../utils/rankBlocks'
import { traverseOperationTree } from '../../utils/traverseOperationTree'
import type { Counter } from './counter'

export class RpcCounter implements Counter {
  countForBlock(block: EVMBlock): CountedBlock {
    return {
      ...block,
      status: '<unknown>',
      transactions: block.transactions.map((tx: EVMTransaction) =>
        this.mapTransaction(tx),
      ),
    }
  }

  countForBlocks(blocks: EVMBlock[]): StatResults {
    let dateStart = new Date()
    let dateEnd = new Date()
    let numberOfTransactions = 0
    let numberOfOperations = 0
    const topBlocks: BlockRatio[] = []

    const smartAccountUsage = new Map<string, number>()

    for (let i = 0; i < blocks.length; i++) {
      const current = this.countForBlock(blocks[i])

      dateStart = i === 0 ? new Date(current.timestamp * 1000) : dateStart
      dateEnd = new Date(current.timestamp * 1000)
      numberOfTransactions += current.transactions.length

      const currentUserOperations = current.transactions.reduce(
        (acc, tx) => acc + tx.operationsCount,
        0,
      )

      const currentSmartAccountUsage =
        this.generateSmartAccountUsageForBlock(current)
      for (const [signature, count] of currentSmartAccountUsage) {
        const currentCount = smartAccountUsage.get(signature) ?? 0
        smartAccountUsage.set(signature, currentCount + count)
      }

      numberOfOperations += currentUserOperations
      topBlocks.push({
        number: current.number,
        ratio: currentUserOperations / current.transactions.length,
        includesBatch: current.transactions.some((tx) => tx.includesBatch),
        includesUnknown: currentSmartAccountUsage.has('unknown'),
      })
    }

    return {
      dateStart,
      dateEnd,
      numberOfTransactions,
      numberOfOperations,
      topBlocks: topBlocks.sort(rankBlocks).slice(0, 10),
      smartAccountUsage: Array.from(
        smartAccountUsage,
        ([signature, count]) => ({ signature, count }),
      ),
    }
  }

  mapTransaction(tx: EVMTransaction): CountedTransaction {
    const methods = ERC4337_methods.concat(SAFE_methods)

    if (isErc4337(tx) || isGnosisSafe(tx)) {
      const countedOperation = this.countUserOperations(
        tx.data as string,
        tx.to ?? '',
        methods,
      )

      const { includesBatch, includesUnknown } =
        this.checkOperations(countedOperation)

      return {
        type: this.getTransactionType(tx.to),
        hash: tx.hash,
        operationsCount: countedOperation.count,
        details: countedOperation,
        includesBatch,
        includesUnknown,
      }
    }

    return {
      type: 'unknown',
      hash: tx.hash,
      operationsCount: 1,
      includesBatch: false,
    }
  }

  countUserOperations(
    calldata: string,
    to: string,
    methods: Method[],
  ): CountedOperation {
    const countOperationsRecursive = (
      operation: Operation,
      level: number,
      methods: Method[],
    ): CountedOperation => {
      if (operation.type === 'static') {
        return {
          id: generateId(),
          level,
          methodSelector: '',
          methodName: operation.name,
          count: operation.count,
          children: [],
        }
      }

      const selector = operation.calldata.slice(0, 10)
      const method = methods.find((m) => m.selector === selector)

      if (!method) {
        return {
          id: generateId(),
          level,
          count: 1,
          methodSelector: selector,
          contractAddress: operation.to ?? '',
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
        id: generateId(),
        level,
        methodSelector: method.selector,
        methodSignature: method.signature,
        methodName: method.name,
        contractAddress: operation.to,
        contractName: method.contractName,
        count,
        children,
      }
    }

    const rootOperation = countOperationsRecursive(
      { type: 'recursive', calldata, to },
      0,
      methods,
    )
    return rootOperation
  }

  checkOperations(countedOperation: CountedOperation): {
    includesBatch: boolean
    includesUnknown: boolean
  } {
    const batchOperations: string[] = []
    const unknownOperations: string[] = []

    traverseOperationTree(
      countedOperation,
      batchOperations,
      (operation, batchOperations) => {
        if (operation.level > 0 && operation.children.length > 1) {
          batchOperations.push(operation.id)
        }

        if (
          operation.contractAddress?.toLowerCase() !==
            ENTRY_POINT_ADDRESS_0_6_0 &&
          operation.contractAddress?.toLowerCase() !== ENTRY_POINT_ADDRESS_0_7_0
        ) {
          return
        }

        for (const child of operation.children) {
          if (child.methodName === 'contract_deployment') {
            continue
          }

          if (!child.methodSignature) {
            unknownOperations.push(operation.id)
            break
          }
        }
      },
    )

    return {
      includesBatch: batchOperations.length > 0,
      includesUnknown: unknownOperations.length > 0,
    }
  }

  getTransactionType(to?: string): string {
    switch (to?.toLowerCase()) {
      case ENTRY_POINT_ADDRESS_0_6_0:
        return 'ERC-4337 Entry Point 0.6.0'
      case ENTRY_POINT_ADDRESS_0_7_0:
        return 'ERC-4337 Entry Point 0.7.0'
      case SAFE_MULTI_SEND_CALL_ONLY_1_3_0:
        return 'Safe: Multi Send Call Only 1.3.0'
      case SAFE_EXEC_TRANSACTION_SELECTOR:
        return 'Safe: Singleton 1.3.0'
      default:
        return 'unknown'
    }
  }

  generateSmartAccountUsageForBlock(block: CountedBlock): Map<string, number> {
    const smartAccountUsage = new Map<string, number>()

    for (const tx of block.transactions) {
      if (!tx.details) {
        continue
      }

      traverseOperationTree(
        tx.details,
        smartAccountUsage,
        (operation, smartAccountUsage) => {
          // for now we assume that only ERC-4337 Entry Points can call smart accounts
          if (
            operation.contractAddress?.toLowerCase() !==
              ENTRY_POINT_ADDRESS_0_6_0 &&
            operation.contractAddress?.toLowerCase() !==
              ENTRY_POINT_ADDRESS_0_7_0
          ) {
            return
          }

          for (const child of operation.children) {
            if (child.methodName === 'contract_deployment') {
              continue
            }

            if (child.methodSignature) {
              const count = smartAccountUsage.get(child.methodSignature) ?? 0
              smartAccountUsage.set(child.methodSignature, count + 1)
            } else {
              const count = smartAccountUsage.get('unknown') ?? 0
              smartAccountUsage.set('unknown', count + 1)
            }
          }
        },
      )
    }

    return smartAccountUsage
  }
}
