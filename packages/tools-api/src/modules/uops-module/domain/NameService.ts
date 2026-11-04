import type { Logger } from '@l2beat/backend-tools'
import type {
  CountedBlock,
  CountedOperation,
  CountedTransaction,
} from '../types'
import type { KnownNames } from './KnownNames'
import type { CodeClient } from './RpcCodeClient'
import { traverseOperationTree } from './traverseOperationTree'

export interface SignatureLookup {
  lookup(selector: `0x${string}`): Promise<string[]>
}

export interface ContractClient {
  getName(address: string): Promise<string>
}

export class NameService {
  constructor(
    private readonly knownNames: KnownNames,
    private readonly signatureLookup: SignatureLookup,
    private readonly codeClient: CodeClient,
    private readonly contractClient: ContractClient | undefined,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async fillNames(block: CountedBlock): Promise<void> {
    for (const tx of block.transactions) {
      if (!tx.details) continue

      await this.fillImplementationName(tx)

      await this.fillMethodNames(tx.details)
      await this.fillContractNames(tx.details)
    }
  }

  async fillMethodNames(rootOperation: CountedOperation) {
    const selectors = new Set<string>()
    traverseOperationTree(rootOperation, selectors, (operation, selectors) => {
      if (operation.methodSelector && !operation.methodName) {
        selectors.add(operation.methodSelector)
      }
    })

    for (const selector of selectors) {
      if (this.knownNames.methods.has(selector)) {
        continue
      }
      try {
        const signatures = await this.signatureLookup.lookup(
          selector as `0x${string}`,
        )
        const signature = signatures[0]
        if (signature) {
          this.knownNames.methods.set(selector, toMethodName(signature))
        }
      } catch (error) {
        this.logger.error('Signature lookup failed', { selector, error })
      }
    }

    traverseOperationTree(
      rootOperation,
      this.knownNames,
      (operation, names) => {
        if (!operation.methodName) {
          operation.methodName = names.methods.get(operation.methodSelector)
        }
      },
    )
  }

  async fillContractNames(rootOperation: CountedOperation) {
    const addresses = new Set<string>()
    traverseOperationTree(rootOperation, addresses, (operation, addresses) => {
      if (operation.contractAddress && !operation.contractName) {
        addresses.add(operation.contractAddress.toLowerCase())
      }
    })

    for (const address of addresses) {
      if (this.knownNames.contracts.has(address) || !this.contractClient) {
        continue
      }
      try {
        const name = await this.contractClient.getName(address)
        if (name) {
          this.knownNames.contracts.set(address, name)
        }
      } catch (error) {
        this.logger.error('Contract name lookup failed', { address, error })
      }
    }

    traverseOperationTree(
      rootOperation,
      this.knownNames,
      (operation, names) => {
        if (operation.contractAddress && !operation.contractName) {
          operation.contractName = names.contracts.get(
            operation.contractAddress.toLowerCase(),
          )
        }
      },
    )
  }

  async fillImplementationName(tx: CountedTransaction) {
    if (tx.type !== 'EIP-712') {
      return
    }

    try {
      const codeHash = await this.codeClient.getCodeHash(tx.from)
      const implementationName = codeHash
        ? (this.knownNames.implementations.get(codeHash) ?? 'unknown')
        : 'EOA'
      tx.type = `${tx.type} (${implementationName})`
    } catch (error) {
      this.logger.error('Code lookup failed', { address: tx.from, error })
    }
  }
}

function toMethodName(signature: string): string {
  const withoutKeyword = signature.startsWith('function ')
    ? signature.slice('function '.length)
    : signature
  return withoutKeyword.split('(')[0] ?? withoutKeyword
}
