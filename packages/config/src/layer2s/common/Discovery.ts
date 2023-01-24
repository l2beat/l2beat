import {
  ContractParameters,
  ProjectParameters,
} from '@l2beat/backend/src/core/discovery/types'

export class Discovery {
  discovery: ProjectParameters

  constructor(project: string) {
    this.discovery = this.getDiscovery(project)
  }

  private getDiscovery(project: string): ProjectParameters {
    const discovery = require(`@l2beat/backend/discovery/${project}/discovered.json`)
    if (!discovery) {
      throw new Error(`Discovery file for ${project} does not exist`)
    }
    return discovery
  }

  getContractByName(name: string): ContractParameters {
    const contracts = this.discovery.contracts.filter(
      (contract) => contract.name === name,
    )

    if (contracts.length === 0) {
      throw new Error(`No contract of ${name} name found`)
    }

    if (contracts.length > 1) {
      throw new Error(`Found more than 1 contracts named ${name}`)
    }

    return contracts[0]
  }

  getContractByAddress(address: string): ContractParameters {
    const contract = this.discovery.contracts.find(
      (contract) => contract.address.toString() === address,
    )

    if (!contract) {
      throw new Error(`No contract of ${address} found`)
    }

    return contract
  }

  getValue<T>(value: any, key: string): T {
    const result = value[key]

    if (!result) {
      throw new Error(
        `Value of key ${String(key)} does not exist on object ${value}`,
      )
    }

    return result
  }
}
