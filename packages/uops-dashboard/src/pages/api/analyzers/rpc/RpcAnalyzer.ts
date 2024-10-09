import type { Chain } from '@/chains'
import type {
  Block,
  BlockRatio,
  CountedOperation,
  Method,
  Operation,
  StatResults,
  Transaction,
} from '@/types'
import { providers } from 'ethers'
import { getApiKey, getApiUrl, getScanUrl } from '../../clients/apiUrls'
import { ScanClient } from '../../clients/contract/ScanClient'
import { EtherfaceClient } from '../../clients/signature/EtherfaceClient'
import { FourByteClient } from '../../clients/signature/FourByteClient'
import { OpenChainClient } from '../../clients/signature/OpenChainClient'
import type { DB } from '../../db/db'
import {
  ENTRY_POINT_ADDRESS_0_6_0,
  ENTRY_POINT_ADDRESS_0_7_0,
} from '../../protocols/erc-4337/const'
import { ERC4337_methods } from '../../protocols/erc-4337/methods'
import {
  SAFE_EXEC_TRANSACTION_SELECTOR,
  SAFE_MULTI_SEND_CALL_ONLY_1_3_0,
} from '../../protocols/gnosisSafe/const'
import { SAFE_methods } from '../../protocols/gnosisSafe/methods'
import { generateId } from '../../utils/generateId'
import { rankBlocks } from '../../utils/rankBlocks'
import { traverseOperationTree } from '../../utils/traverseOperationTree'
import type { Analyzer } from '../analyzer'

export class RpcAnalyzer implements Analyzer {
  private readonly provider: providers.Provider

  constructor(
    private readonly chain: Chain,
    private readonly db: DB,
  ) {
    const apiUrl = getApiUrl(chain.id)
    const apiKey = getApiKey(chain.id, 'RPC')
    this.provider = new providers.StaticJsonRpcProvider({
      url: `${apiUrl}/${apiKey}`,
      timeout: 15_000,
    })
  }

  async getBlockNumber() {
    // eth_blockNumber
    const result = await this.provider.getBlockNumber()
    return result
  }

  async analyzeBlock(
    blockNumber: number,
    includeDetails = true,
  ): Promise<Block> {
    // eth_getBlockByNumber
    const rpcBlock = await this.provider.getBlockWithTransactions(blockNumber)

    return {
      number: rpcBlock.number,
      timestamp: rpcBlock.timestamp,
      hash: rpcBlock.hash,
      status: '<unknown>',
      transactions: await Promise.all(
        rpcBlock.transactions.map((tx: providers.TransactionResponse) =>
          this.mapTransaction(tx, includeDetails),
        ),
      ),
    }
  }

  async analyzeBlocks(startBlock: number, count: number): Promise<StatResults> {
    let dateStart = new Date()
    let dateEnd = new Date()
    let numberOfTransactions = 0
    let numberOfOperations = 0
    const topBlocks: BlockRatio[] = []

    const smartAccountUsage = new Map<string, number>()

    for (let i = 0; i < count; i++) {
      const current = await this.analyzeBlock(startBlock + i, false)

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

  private async mapTransaction(
    tx: providers.TransactionResponse,
    includeDetails: boolean,
  ): Promise<Transaction> {
    if (tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_6_0) {
      return await this.createTransaction(
        'ERC-4337 Entry Point 0.6.0',
        tx,
        includeDetails,
      )
    }

    if (tx.to?.toLowerCase() === ENTRY_POINT_ADDRESS_0_7_0) {
      return await this.createTransaction(
        'ERC-4337 Entry Point 0.7.0',
        tx,
        includeDetails,
      )
    }

    if (tx.to?.toLowerCase() === SAFE_MULTI_SEND_CALL_ONLY_1_3_0) {
      return this.createTransaction(
        'Safe: Multi Send Call Only 1.3.0',
        tx,
        includeDetails,
      )
    }

    const selector = tx.data.slice(0, 10)
    if (selector === SAFE_EXEC_TRANSACTION_SELECTOR) {
      return this.createTransaction('Safe: Singleton 1.3.0', tx, includeDetails)
    }

    return {
      type: 'unknown',
      hash: tx.hash,
      operationsCount: 1,
      includesBatch: false,
    }
  }

  private async createTransaction(
    type: string,
    tx: providers.TransactionResponse,
    includeDetails: boolean,
  ): Promise<Transaction> {
    const methods = ERC4337_methods.concat(SAFE_methods)
    const countedOperation = await this.countUserOperations(
      tx.data,
      tx.to ?? '',
      methods,
    )
    if (includeDetails) {
      await this.fillMethodNames(countedOperation)
      await this.fillContractNames(countedOperation)
    }

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
          operation.contractAddress.toLowerCase() !==
            ENTRY_POINT_ADDRESS_0_6_0 &&
          operation.contractAddress.toLowerCase() !== ENTRY_POINT_ADDRESS_0_7_0
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
      type,
      hash: tx.hash,
      operationsCount: countedOperation.count,
      details: countedOperation,
      includesBatch: batchOperations.length > 0,
      includesUnknown: unknownOperations.length > 0,
    }
  }

  private async countUserOperations(
    calldata: string,
    to: string,
    methods: Method[],
  ): Promise<CountedOperation> {
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
          contractAddress: '',
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
          contractAddress: operation.to,
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

  private async fillMethodNames(
    rootOperation: CountedOperation,
  ): Promise<CountedOperation> {
    const selectors = new Set<string>()

    // get all method selectors
    traverseOperationTree(rootOperation, selectors, (operation, selectors) => {
      if (operation.methodSelector && !operation.methodName) {
        selectors.add(operation.methodSelector)
      }
    })

    const etherfaceClient = new EtherfaceClient()
    const fourByteClient = new FourByteClient()
    const openCHainCLient = new OpenChainClient()

    const signatures: Record<string, string> = {}
    for (const selector of selectors) {
      let signature = this.db.METHODS.get(selector)

      try {
        if (!signature) {
          console.log(`Etherface::Getting signature for ${selector}`)
          signature = await etherfaceClient.getSignature(selector)
        }

        if (!signature) {
          console.log(`4Byte::Getting signature for ${selector}`)
          signature = await fourByteClient.getSignature(selector)
        }

        if (!signature) {
          console.log(`OpenChain::Getting signature for ${selector}`)
          signature = await openCHainCLient.getSignature(selector)
        }
      } catch (error) {
        console.error(`Failed to get signature for ${selector}: ${error}`)
      }

      if (signature) {
        const name = signature.split('(')[0]
        this.db.METHODS.set(selector, name)
        signatures[selector] = name
      }
    }

    // fill method names
    traverseOperationTree(
      rootOperation,
      signatures,
      (operation, signatures) => {
        if (!operation.methodName) {
          const signature = signatures[operation.methodSelector]

          if (signature) {
            // remove arguments from signature
            operation.methodName = signature.split('(')[0]
          }
        }
      },
    )

    return rootOperation
  }

  private async fillContractNames(
    rootOperation: CountedOperation,
  ): Promise<CountedOperation> {
    const addresses = new Set<string>()

    // get all contract addresses
    traverseOperationTree(rootOperation, addresses, (operation, addresses) => {
      if (operation.contractAddress && !operation.contractName) {
        addresses.add(operation.contractAddress)
      }
    })

    let scanClient = undefined
    const url = getScanUrl(this.chain.id)
    const key = getApiKey(this.chain.id, 'SCAN')

    if (url && key) {
      scanClient = new ScanClient(url, key)
    }

    const names: Record<string, string> = {}
    for (const address of addresses) {
      let name = this.db.CONTRACTS.get(address.toLowerCase())

      try {
        if (!name && scanClient) {
          console.log(`SCAN::Getting name for ${address}`)
          name = await scanClient.getName(address)
          if (name) {
            this.db.CONTRACTS.set(address.toLowerCase(), name)
          }
        }
      } catch (error) {
        console.error(`Failed to get data for ${address}: ${error}`)
      }

      if (name) {
        names[address] = name
      }
    }

    // fill contract names
    traverseOperationTree(rootOperation, names, (operation, names) => {
      if (!operation.contractName) {
        operation.contractName = names[operation.contractAddress]
      }
    })

    return rootOperation
  }

  private generateSmartAccountUsageForBlock(block: Block): Map<string, number> {
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
            operation.contractAddress.toLowerCase() !==
              ENTRY_POINT_ADDRESS_0_6_0 &&
            operation.contractAddress.toLowerCase() !==
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
