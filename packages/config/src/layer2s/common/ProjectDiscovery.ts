import { assert } from '@l2beat/common'
import {
  ContractParameters,
  ContractValue,
  ProjectParameters,
} from '@l2beat/types'
import { getAddress } from 'ethers/lib/utils'
import fs from 'fs'
import path from 'path'

import { ProjectUpgradeability } from './../../common/ProjectContracts'

type AllKeys<T> = T extends T ? keyof T : never

type MergedUnion<T extends object> = {
  [K in AllKeys<T>]: PickType<T, K>
}

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: T[K] }
  ? T[K]
  : undefined

export class ProjectDiscovery {
  private readonly discovery: ProjectParameters
  constructor(project: string) {
    this.discovery = this.getDiscoveryJson(project)
  }

  private getDiscoveryJson(project: string): ProjectParameters {
    const discoveryFile = fs.readFileSync(
      path.resolve(`../backend/discovery/${project}/discovered.json`),
      'utf-8',
    )

    return JSON.parse(discoveryFile) as ProjectParameters
  }

  getContract(identifier: string): ContractParameters {
    try {
      const address = getAddress(identifier)
      return this.getContractByAddress(address)
    } catch {
      return this.getContractByName(identifier)
    }
  }

  getContractValue<T extends ContractValue>(
    contractIdentifier: string,
    key: string,
  ): T {
    const contract = this.getContract(contractIdentifier)
    const result = contract.values?.[key] as T | undefined
    assert(result, `Value of key ${key} does not exist on searched object`)

    return result
  }

  getContractUpgradeabilityParam<
    K extends AllKeys<ProjectUpgradeability>,
    T extends MergedUnion<ProjectUpgradeability>[K],
  >(contractIdentifier: string, key: K): T {
    const contract = this.getContract(contractIdentifier)
    //@ts-expect-error only 'type' is allowed here, but many more are possible with our error handling
    const result = contract.upgradeability[key] as T | undefined
    assert(result, `Upgradeability param of key ${key} does not exist`)

    return result
  }

  private getContractByAddress(address: string): ContractParameters {
    const contract = this.discovery.contracts.find(
      (contract) => contract.address.toString() === address,
    )
    assert(contract, `No contract of ${address} found`)

    return contract
  }

  private getContractByName(name: string): ContractParameters {
    const contracts = this.discovery.contracts.filter(
      (contract) => contract.name === name,
    )
    assert(
      contracts.length === 1,
      `Found more than 1 contracts or no contract of ${name} name found`,
    )

    return contracts[0]
  }
}
