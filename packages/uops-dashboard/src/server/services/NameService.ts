import { CountedBlock, CountedOperation } from '@/types'
import { DB } from '../db/db'
import { traverseOperationTree } from '@/utils/traverseOperationTree'
import { SignatureClient } from '../clients/signature/SignatureClient'
import { ContractClient } from '../clients/contract/ContractClient'

export class NameService {
  constructor(
    private readonly db: DB,
    private readonly signatureClients: SignatureClient[],
    private readonly contractClient: ContractClient,
  ) {}

  async fillNames(block: CountedBlock): Promise<void> {
    for (const tx of block.transactions) {
      if (!tx.details) continue

      await this.fillMethodNames(tx.details)
      await this.fillContractNames(tx.details)
    }
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

    const signatures: Record<string, string> = {}
    for (const selector of selectors) {
      let signature = this.db.METHODS.get(selector)

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

    const names: Record<string, string> = {}
    for (const address of addresses) {
      let name = this.db.CONTRACTS.get(address.toLowerCase())

      try {
        if (!name) {
          console.log(`SCAN::Getting name for ${address}`)
          name = await this.contractClient.getName(address)
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
      if (operation.contractAddress && !operation.contractName) {
        operation.contractName = names[operation.contractAddress]
      }
    })

    return rootOperation
  }
}
