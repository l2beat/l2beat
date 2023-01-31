import {
  ContractParameters,
  ProjectParameters,
} from '@l2beat/types/build/Discovery'
import path from 'path'
export class ProjectDiscovery {
  private readonly discovery: ProjectParameters
  constructor(project: string) {
    this.discovery = this.getDiscoveryJson(project)
  }

  private getDiscoveryJson(project: string): ProjectParameters {
    const discovery = require(path.resolve(
      `../backend/discovery/${project}/discovered.json`,
    ))
    if (!discovery) {
      throw new Error(`Discovery file for ${project} does not exist`)
    }
    return discovery as ProjectParameters
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
