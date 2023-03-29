import {
  assert,
  ContractParameters,
  ContractValue,
  EthereumAddress,
  ProjectParameters,
} from '@l2beat/shared'
import { utils } from 'ethers'
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

export type Filesystem = typeof filesystem
const filesystem = {
  readFileSync: (path: string) => {
    return fs.readFileSync(path, 'utf-8')
  },
}

export class ProjectDiscovery {
  private readonly discovery: ProjectParameters
  constructor(
    private readonly projectName: string,
    private readonly fs: Filesystem = filesystem,
  ) {
    this.discovery = this.getDiscoveryJson(projectName)
  }

  private getDiscoveryJson(project: string): ProjectParameters {
    const discoveryFile = this.fs.readFileSync(
      path.resolve(`../backend/discovery/${project}/discovered.json`),
    )

    return JSON.parse(discoveryFile) as ProjectParameters
  }

  getMainContractDetails(identifier: string) {
    const contract = this.getContract(identifier)
    return {
      name: contract.name,
      address: contract.address,
      upgradeability: contract.upgradeability,
    }
  }

  getContract(identifier: string): ContractParameters {
    try {
      identifier = utils.getAddress(identifier)
    } catch {
      return this.getContractByName(identifier)
    }
    return this.getContractByAddress(identifier)
  }

  getContractValue<T extends ContractValue>(
    contractIdentifier: string,
    key: string,
  ): T {
    const contract = this.getContract(contractIdentifier)
    const result = contract.values?.[key] as T | undefined
    assert(
      result,
      `Value of key ${key} does not exist in ${contractIdentifier} contract (${this.projectName})`,
    )

    return result
  }

  getMultisigStats(contractIdentifier: string) {
    const threshold = this.getContractValue<number>(
      contractIdentifier,
      'getThreshold',
    )
    const size = this.getContractValue<string[]>(
      contractIdentifier,
      'getOwners',
    ).length
    return `${threshold} / ${size}`
  }

  getConstructorArg<T extends ContractValue>(
    contractIdentifier: string,
    index: number,
  ): T {
    return this.getContractValue<T[]>(contractIdentifier, `constructorArgs`)[
      index
    ]
  }

  getContractUpgradeabilityParam<
    K extends keyof MergedUnion<ProjectUpgradeability>,
    T extends MergedUnion<ProjectUpgradeability>[K],
  >(contractIdentifier: string, key: K): NonNullable<T> {
    const contract = this.getContract(contractIdentifier)
    //@ts-expect-error only 'type' is allowed here, but many more are possible with our error handling
    const result = contract.upgradeability[key] as T | undefined
    assert(
      result,
      `Upgradeability param of key ${key} does not exist in ${contract.name} contract (${this.projectName})`,
    )

    return result
  }

  private getContractByAddress(address: string): ContractParameters {
    const contract = this.discovery.contracts.find(
      (contract) => contract.address === EthereumAddress(address),
    )

    assert(
      contract,
      `No contract of ${address} address found (${this.projectName})`,
    )

    return contract
  }

  private getContractByName(name: string): ContractParameters {
    const contracts = this.discovery.contracts.filter(
      (contract) => contract.name === name,
    )
    assert(
      contracts.length === 1,
      `Found more than one contracts or no contract of ${name} name found (${this.projectName})`,
    )

    return contracts[0]
  }
}
