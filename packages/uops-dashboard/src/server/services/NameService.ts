import type {
  CountedBlock,
  CountedOperation,
  CountedTransaction,
} from '@/types'
import { traverseOperationTree } from '@/utils/traverseOperationTree'
import type { RpcCodeClient } from '../clients/code/RpcCodeClient'
import type { ContractClient } from '../clients/contract/ContractClient'
import type { SignatureClient } from '../clients/signature/SignatureClient'
import type { DB } from '../db/db'

export class NameService {
  constructor(
    private readonly db: DB,
    private readonly signatureClients: SignatureClient[],
    private readonly codeClient: RpcCodeClient,
    private readonly contractClient?: ContractClient,
  ) {}

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

    // get all method selectors
    traverseOperationTree(rootOperation, selectors, (operation, selectors) => {
      if (operation.methodSelector && !operation.methodName) {
        selectors.add(operation.methodSelector)
      }
    })

    const signatures: Record<string, string> = {}
    for (const selector of selectors) {
      let signature = this.db.METHODS.get(selector)

      if (signature) {
        const name = signature.split('(')[0]
        this.db.METHODS.set(selector, name)
        signatures[selector] = name
        continue
      }

      for (const client of this.signatureClients) {
        try {
          console.log(`${client.getName()}::Getting signature for ${selector}`)
          signature = await client.getSignature(selector)

          if (signature) {
            break
          }
        } catch (error) {
          console.error(`Failed to get signature for ${selector}: ${error}`)
        }
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
  }

  async fillContractNames(rootOperation: CountedOperation) {
    const addresses = new Set<string>()

    // get all contract addresses
    traverseOperationTree(rootOperation, addresses, (operation, addresses) => {
      if (operation.contractAddress && !operation.contractName) {
        addresses.add(operation.contractAddress)
      }
    })

    const names: Record<string, string> = {}
    for (const address of addresses) {
      let name = this.db.CONTRACTS.get(address.toLowerCase())

      if (name) {
        names[address] = name
        continue
      }

      if (!this.contractClient) {
        continue
      }

      try {
        console.log(`SCAN::Getting name for ${address}`)
        name = await this.contractClient.getName(address)
        if (name) {
          this.db.CONTRACTS.set(address.toLowerCase(), name)
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
      if (operation.contractAddress && !operation.contractName) {
        operation.contractName = names[operation.contractAddress]
      }
    })
  }

  async fillImplementationName(tx: CountedTransaction) {
    if (tx.type !== 'EIP-712') {
      return
    }

    try {
      console.log(`CODE::Getting name for ${tx.from}`)
      const codeHash = await this.codeClient.getCodeHash(tx.from)

      let implementationName = 'EOA'

      if (codeHash) {
        implementationName = this.db.IMPLEMENTATIONS.get(codeHash) ?? 'unknown'
      }

      tx.type = `${tx.type} (${implementationName})`
    } catch (error) {
      console.error(`Failed to get data for ${tx.from}: ${error}`)
    }
  }
}
