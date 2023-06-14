import {
  assert,
  ContractParameters,
  ContractValue,
  DiscoveryOutput,
  EthereumAddress,
  gatherAddressesFromUpgradeability,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import fs from 'fs'
import { isArray, isString } from 'lodash'
import path from 'path'

import {
  ProjectEscrow,
  ProjectPermission,
  ProjectPermissionedAccount,
  ProjectReference,
} from '../common'
import {
  ProjectContractSingleAddress,
  ProjectUpgradeability,
} from '../common/ProjectContracts'
import { delayDescriptionFromSeconds } from '../utils/delayDescription'

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
  private readonly discovery: DiscoveryOutput
  constructor(
    public readonly projectName: string,
    private readonly fs: Filesystem = filesystem,
  ) {
    this.discovery = this.getDiscoveryJson(projectName)
  }

  private getDiscoveryJson(project: string): DiscoveryOutput {
    const discoveryFile = this.fs.readFileSync(
      path.resolve(`../backend/discovery/${project}/discovered.json`),
    )

    return JSON.parse(discoveryFile) as DiscoveryOutput
  }

  getContractDetails(
    identifier: string,
    descriptionOrOptions?: string | Partial<ProjectContractSingleAddress>,
  ): ProjectContractSingleAddress {
    const contract = this.getContract(identifier)
    if (typeof descriptionOrOptions === 'string') {
      descriptionOrOptions = { description: descriptionOrOptions }
    } else if (descriptionOrOptions?.pausable !== undefined) {
      const descriptions = [
        descriptionOrOptions.description,
        `The contract is pausable by ${descriptionOrOptions.pausable.pausableBy.join(
          ', ',
        )}.`,
      ]
      if (descriptionOrOptions.pausable.paused) {
        descriptions.push('The contract is currently paused.')
      }
      descriptionOrOptions.description = descriptions.filter(isString).join(' ')
    }
    return {
      name: contract.name,
      address: contract.address,
      upgradeability: contract.upgradeability,
      ...descriptionOrOptions,
    }
  }

  getEscrowDetails({
    address,
    name,
    description,
    sinceTimestamp,
    tokens,
    upgradableBy,
    upgradeDelay,
  }: {
    address: EthereumAddress
    name?: string
    description?: string
    sinceTimestamp: UnixTime
    tokens: string[] | '*'
    upgradableBy?: string[]
    upgradeDelay?: string
  }): ProjectEscrow {
    const contract = this.getContractByAddress(address.toString())

    return {
      address,
      newVersion: true,
      sinceTimestamp,
      tokens,
      contract: {
        name: name ?? contract.name,
        description,
        upgradeability: contract.upgradeability,
        upgradableBy,
        upgradeDelay,
      },
    }
  }

  getMultisigPermission(
    identifier: string,
    description: string,
    references?: ProjectReference[],
  ): ProjectPermission[] {
    const contract = this.getContract(identifier)
    assert(
      contract.upgradeability.type === 'gnosis safe',
      `Contract ${contract.name} is not a Gnosis Safe (${this.projectName})`,
    )

    return [
      {
        name: identifier,
        description: `${description} This is a Gnosis Safe with ${this.getMultisigStats(
          identifier,
        )} threshold.`,
        accounts: [
          {
            address: contract.address,
            type: 'MultiSig',
          },
        ],
      },
      {
        name: `${identifier} participants`,
        description: `Those are the participants of the ${identifier}.`,
        accounts: this.getPermissionedAccounts(identifier, 'getOwners'),
        references,
      },
    ]
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
      isNonNullable(result),
      `Value of key ${key} does not exist in ${contractIdentifier} contract (${this.projectName})`,
    )

    return result
  }

  getAddressFromValue(
    contractIdentifier: string,
    key: string,
  ): EthereumAddress {
    const address = this.getContractValue(contractIdentifier, key)

    assert(
      isString(address) && EthereumAddress.check(address),
      `Value of ${key} must be an Ethereum address`,
    )

    return EthereumAddress(address)
  }

  formatPermissionedAccount(
    account: ContractValue | EthereumAddress,
  ): ProjectPermissionedAccount {
    assert(
      isString(account) && EthereumAddress.check(account),
      `Values must be Ethereum addresses`,
    )
    const address = EthereumAddress(account)
    const isEOA = this.discovery.eoas.includes(address)
    const contract = this.discovery.contracts.find(
      (contract) => contract.address === address,
    )
    const isMultisig = contract?.upgradeability.type === 'gnosis safe'

    const type = isEOA ? 'EOA' : isMultisig ? 'MultiSig' : 'Contract'

    return { address: address, type }
  }

  getPermissionedAccount(
    contractIdentifier: string,
    key: string,
  ): ProjectPermissionedAccount {
    const value = this.getContractValue(contractIdentifier, key)
    return this.formatPermissionedAccount(value)
  }

  getPermissionedAccounts(
    contractIdentifier: string,
    key: string,
  ): ProjectPermissionedAccount[] {
    const value = this.getContractValue(contractIdentifier, key)

    assert(isArray(value), `Value of ${key} must be an array`)

    return value.map(this.formatPermissionedAccount.bind(this))
  }

  getContractFromValue(
    contractIdentifier: string,
    key: string,
    descriptionOrOptions?: string | Partial<ProjectContractSingleAddress>,
  ): ProjectContractSingleAddress {
    const address = this.getContractValue(contractIdentifier, key)
    assert(
      isString(address) && EthereumAddress.check(address),
      `Value of ${key} must be an Ethereum address`,
    )
    const contract = this.getContract(address)
    if (typeof descriptionOrOptions === 'string') {
      descriptionOrOptions = { description: descriptionOrOptions }
    }

    return {
      address: contract.address,
      name: contract.name,
      upgradeability: contract.upgradeability,
      ...descriptionOrOptions,
    }
  }

  getContractFromUpgradeability<
    K extends keyof MergedUnion<ProjectUpgradeability>,
  >(contractIdentifier: string, key: K): ContractParameters {
    const address = this.getContractUpgradeabilityParam(contractIdentifier, key)
    assert(
      isString(address) && EthereumAddress.check(address),
      `Value of ${key} must be an Ethereum address`,
    )
    const contract = this.getContract(address)

    return {
      address: contract.address,
      name: contract.name,
      upgradeability: contract.upgradeability,
    }
  }

  getDelayStringFromUpgradeability<
    K extends keyof MergedUnion<ProjectUpgradeability>,
  >(contractIdentifier: string, key: K): string {
    const delay = this.getContractUpgradeabilityParam(contractIdentifier, key)
    assert(typeof delay === 'number', `Value of ${key} must be a number`)
    return delayDescriptionFromSeconds(delay)
  }

  contractAsPermissioned(
    contract: ContractParameters,
    description: string,
  ): ProjectPermission {
    return {
      name: contract.name,
      accounts: [
        {
          address: contract.address,
          type: 'Contract',
        },
      ],
      description,
    }
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
      isNonNullable(result),
      `Upgradeability param of key ${key} does not exist in ${contract.name} contract (${this.projectName})`,
    )

    return result
  }

  getAllContractAddresses(): EthereumAddress[] {
    return this.discovery.contracts.flatMap((contract) => [
      contract.address,
      ...gatherAddressesFromUpgradeability(contract.upgradeability),
    ])
  }

  getContractByAddress(address: string): ContractParameters {
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
      !(contracts.length > 1),
      `Found more than one contracts of ${name} name (${this.projectName})`,
    )
    assert(
      contracts.length === 1,
      `Found no contract of ${name} name (${this.projectName})`,
    )

    return contracts[0]
  }
}

function isNonNullable<T>(
  value: T | undefined | null,
): value is NonNullable<T> {
  return value !== null && value !== undefined
}
