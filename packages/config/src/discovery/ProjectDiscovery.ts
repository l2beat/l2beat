import {
  ConfigReader,
  InvertedAddresses,
  calculateInversion,
} from '@l2beat/discovery'
import type {
  ContractParameters,
  ContractValue,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  UnixTime,
  gatherAddressesFromUpgradeability,
  notUndefined,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { isArray, isString } from 'lodash'

import { join } from 'path'
import {
  ScalingProjectEscrow,
  ScalingProjectPermission,
  ScalingProjectPermissionedAccount,
  ScalingProjectReference,
} from '../common'
import {
  ScalingProjectContractSingleAddress,
  ScalingProjectUpgradeability,
} from '../common/ScalingProjectContracts'
import { delayDescriptionFromSeconds } from '../utils/delayDescription'
import {
  OP_STACK_CONTRACT_DESCRIPTION,
  OP_STACK_PERMISSION_TEMPLATES,
  OpStackContractName,
} from './OpStackTypes'
import {
  ORBIT_STACK_CONTRACT_DESCRIPTION,
  ORBIT_STACK_PERMISSION_TEMPLATES,
  OrbitStackContractTemplate,
} from './OrbitStackTypes'
import { PermissionedContract } from './PermissionedContract'
import {
  StackPermissionTemplate,
  StackPermissionsTag,
} from './StackTemplateTypes'
import { findRoleMatchingTemplate } from './values/templateUtils'

type AllKeys<T> = T extends T ? keyof T : never

type MergedUnion<T extends object> = {
  [K in AllKeys<T>]: PickType<T, K>
}

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: T[K] }
  ? T[K]
  : undefined

export class ProjectDiscovery {
  private readonly discoveries: DiscoveryOutput[]
  constructor(
    public readonly projectName: string,
    public readonly chain: string = 'ethereum',
    configReader = new ConfigReader(join(process.cwd(), '../backend')),
  ) {
    const config = configReader.readConfig(projectName, chain)
    this.discoveries = [
      configReader.readDiscovery(projectName, chain),
      ...config.sharedModules.map((module) =>
        configReader.readDiscovery(module, chain),
      ),
    ]
  }

  getContractDetails(
    identifier: string,
    descriptionOrOptions?:
      | string
      | Partial<ScalingProjectContractSingleAddress>,
  ): ScalingProjectContractSingleAddress {
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
      chain: this.chain,
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
    isUpcoming,
    includeInTotal,
  }: {
    address: EthereumAddress
    name?: string
    description?: string
    sinceTimestamp?: UnixTime
    tokens: string[] | '*'
    upgradableBy?: string[]
    upgradeDelay?: string
    isUpcoming?: boolean
    includeInTotal?: boolean
  }): ScalingProjectEscrow {
    const contractRaw = this.getContract(address.toString())
    const timestamp = sinceTimestamp?.toNumber() ?? contractRaw.sinceTimestamp
    assert(
      timestamp,
      'No timestamp was found for an escrow. Possible solutions:\n1. Run discovery for that address to capture the sinceTimestamp.\n2. Provide your own sinceTimestamp that will override the value from discovery.',
    )

    const options: Partial<ScalingProjectContractSingleAddress> = {
      name,
      description,
      upgradableBy,
      upgradeDelay,
    }

    const contract = this.getContractDetails(address.toString(), options)

    return {
      address,
      newVersion: true,
      sinceTimestamp: new UnixTime(timestamp),
      tokens,
      contract,
      isUpcoming,
      chain: this.chain,
      includeInTotal:
        includeInTotal ?? this.chain === 'ethereum' ? true : includeInTotal,
    }
  }

  isEOA(address: EthereumAddress): boolean {
    const eoas = this.discoveries.flatMap((discovery) => discovery.eoas)
    return eoas.includes(address)
  }

  getInversion(): InvertedAddresses {
    return calculateInversion(this.discoveries[0])
  }

  transformToPermissions(resolved: Record<string, PermissionedContract>) {
    return Object.values(resolved)
      .map((contract) => {
        const description = contract.generateDescription()
        if (description !== '') {
          return {
            name: contract.name,
            accounts: [this.formatPermissionedAccount(contract.address)],
            description,
            chain: this.chain,
          }
        }
      })
      .filter(notUndefined)
  }

  getOpStackPermissions(
    overrides?: Record<string, string>,
    contractOverrides?: Record<string, string>,
  ): ScalingProjectPermission[] {
    const resolved = this.computeStackContractPermissions(
      OP_STACK_PERMISSION_TEMPLATES,
      overrides,
      contractOverrides,
    )
    return this.transformToPermissions(resolved)
  }

  resolveOrbitStackTemplates(
    overrides?: Record<string, string>,
    contractOverrides?: Record<string, string>,
  ): {
    permissions: ScalingProjectPermission[]
    contracts: ScalingProjectContractSingleAddress[]
  } {
    return this.resolveStackTemplates(
      ORBIT_STACK_PERMISSION_TEMPLATES,
      ORBIT_STACK_CONTRACT_DESCRIPTION,
      overrides,
      contractOverrides,
    )
  }

  invertByTag(
    resolved: Record<string, PermissionedContract>,
    tag: StackPermissionsTag,
  ): Record<string, string> {
    const result: Record<string, string> = {}

    for (const [contractName, contract] of Object.entries(resolved)) {
      const tagged = contract.getByTag(tag)
      for (const contractTag of tagged) {
        result[contractTag] = contractName
      }
    }

    return result
  }

  resolveStackTemplates(
    permissionTemplates: StackPermissionTemplate[],
    contractTemplates: OrbitStackContractTemplate[],
    overrides?: Record<string, string>,
    contractOverrides?: Record<string, string>,
  ): {
    permissions: ScalingProjectPermission[]
    contracts: ScalingProjectContractSingleAddress[]
  } {
    const resolved = this.computeStackContractPermissions(
      permissionTemplates,
      overrides,
      contractOverrides,
    )

    const adminOf = this.invertByTag(resolved, 'admin')

    const contracts = contractTemplates.map((d) =>
      this.getContractDetails(overrides?.[d.name] ?? d.name, {
        description: stringFormat(
          d.coreDescription,
          overrides?.[d.name] ?? d.name,
        ),
        ...(adminOf[d.name] && {
          upgradableBy: [adminOf[d.name]],
          upgradeDelay: 'No delay',
        }),
      }),
    )

    return {
      permissions: this.transformToPermissions(resolved),
      contracts,
    }
  }

  computeStackContractPermissions(
    templates: StackPermissionTemplate[],
    overrides?: Record<string, string>,
    contractOverrides?: Record<string, string>,
  ): Record<string, PermissionedContract> {
    const inversion = this.getInversion()

    const contracts: Record<string, PermissionedContract> = {}
    const getContract = (name: string, address: EthereumAddress) => {
      contracts[name] ??= new PermissionedContract(name, address)
      return contracts[name]
    }

    for (const template of templates) {
      for (const invertedContract of inversion.values()) {
        const role = findRoleMatchingTemplate(
          invertedContract,
          template,
          contractOverrides,
        )
        if (!role) {
          continue
        }

        const contractKey =
          overrides?.[role.name] ?? invertedContract.name ?? role.name

        const contractAddress = EthereumAddress(invertedContract.address)
        const contract = getContract(contractKey, contractAddress)
        const referenced = getContract(role.atName, role.atAddress)

        if (template.description !== undefined) {
          contract.addDescription(
            stringFormat(template.description, role.atName),
          )
        }

        if (template.tags !== undefined) {
          for (const tag of template.tags) {
            contract.addTag(tag, role.atName)
            referenced.addTagReference(tag, contractKey)
          }
        }
      }
    }

    return contracts
  }

  getMultisigPermission(
    identifier: string,
    description: string,
    references?: ScalingProjectReference[],
  ): ScalingProjectPermission[] {
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
        chain: this.chain,
        references,
        participants: this.getPermissionedAccounts(identifier, 'getOwners'),
      },
    ]
  }

  getAccessControlRolePermission(
    contractIdentifier: string,
    role: string,
  ): ScalingProjectPermissionedAccount[] {
    const { members } = this.getAccessControlField(contractIdentifier, role)
    return members.map((member) => this.formatPermissionedAccount(member))
  }

  getContract(identifier: string): ContractParameters {
    try {
      identifier = utils.getAddress(identifier)
    } catch {
      const contracts = this.getContractByName(identifier)

      assert(
        !(contracts.length > 1),
        `Found more than one contracts of ${identifier} name (${this.projectName})`,
      )
      assert(
        contracts.length === 1,
        `Found no contract of ${identifier} name (${this.projectName})`,
      )

      return contracts[0]
    }

    const contract = this.getContractByAddress(identifier)
    assert(
      contract,
      `No contract of ${identifier} address found (${this.projectName})`,
    )

    return contract
  }

  hasContract(identifier: string): boolean {
    try {
      identifier = utils.getAddress(identifier)
    } catch {
      const contracts = this.getContractByName(identifier)
      return contracts.length === 1
    }

    const contract = this.getContractByAddress(identifier)
    return contract !== undefined
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
  ): ScalingProjectPermissionedAccount {
    assert(
      isString(account) && EthereumAddress.check(account),
      `Values must be Ethereum addresses`,
    )
    const address = EthereumAddress(account)
    const isEOA = this.isEOA(address)
    const contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    const contract = contracts.find((contract) => contract.address === address)
    const isMultisig = contract?.upgradeability.type === 'gnosis safe'

    const type = isEOA ? 'EOA' : isMultisig ? 'MultiSig' : 'Contract'

    return { address: address, type }
  }

  getPermissionedAccount(
    contractIdentifier: string,
    key: string,
  ): ScalingProjectPermissionedAccount {
    const value = this.getContractValue(contractIdentifier, key)
    return this.formatPermissionedAccount(value)
  }

  getPermissionedAccounts(
    contractIdentifier: string,
    key: string,
    index?: number,
  ): ScalingProjectPermissionedAccount[] {
    let value = this.getContractValue(contractIdentifier, key)
    assert(isArray(value), `Value of ${key} must be an array`)

    if (index !== undefined) {
      value = (value as ContractValue[])[index]
      assert(isArray(value), `Value of ${key}[${index}] must be an array`)
    }

    return value.map(this.formatPermissionedAccount.bind(this))
  }

  getContractFromValue(
    contractIdentifier: string,
    key: string,
    descriptionOrOptions?:
      | string
      | Partial<ScalingProjectContractSingleAddress>,
  ): ScalingProjectContractSingleAddress {
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
      chain: this.chain,
      ...descriptionOrOptions,
    }
  }

  getContractFromUpgradeability<
    K extends keyof MergedUnion<ScalingProjectUpgradeability>,
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
    K extends keyof MergedUnion<ScalingProjectUpgradeability>,
  >(contractIdentifier: string, key: K): string {
    const delay = this.getContractUpgradeabilityParam(contractIdentifier, key)
    assert(typeof delay === 'number', `Value of ${key} must be a number`)
    return delayDescriptionFromSeconds(delay)
  }

  contractAsPermissioned(
    contract: ContractParameters,
    description: string,
  ): ScalingProjectPermission {
    return {
      name: contract.name,
      accounts: [
        {
          address: contract.address,
          type: 'Contract',
        },
      ],
      chain: this.chain,
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
    K extends keyof MergedUnion<ScalingProjectUpgradeability>,
    T extends MergedUnion<ScalingProjectUpgradeability>[K],
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

  getAccessControlField(
    contractIdentifier: string,
    roleName: string,
  ): {
    adminRole: EthereumAddress[]
    members: EthereumAddress[]
  } {
    const accessControl = this.getContractValue<
      Partial<
        Record<
          string,
          {
            adminRole: string
            members: string[]
          }
        >
      >
    >(contractIdentifier, 'accessControl')
    const role = accessControl && accessControl[roleName]
    assert(role, `Role ${roleName} does not exist`)
    const adminRole = accessControl[role.adminRole]
    assert(adminRole, `Admin role ${role.adminRole} does not exist`)

    assert(
      [...adminRole.members, ...role.members].every((address) =>
        EthereumAddress.check(address),
      ),
      `Role ${roleName}/${role.adminRole} has invalid addresses`,
    )

    return {
      adminRole: adminRole.members.map((m) => EthereumAddress(m)),
      members: role.members.map(EthereumAddress),
    }
  }

  getAllContractAddresses(): EthereumAddress[] {
    const contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    const addressesWithinUpgradeability = contracts.flatMap((contract) =>
      gatherAddressesFromUpgradeability(contract.upgradeability),
    )

    return addressesWithinUpgradeability.filter((addr) => !this.isEOA(addr))
  }

  getContractByAddress(address: string): ContractParameters | undefined {
    const contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    return contracts.find(
      (contract) => contract.address === EthereumAddress(address),
    )
  }

  getOpStackContractDetails(
    upgradesProxy: Partial<ScalingProjectContractSingleAddress>,
    overrides?: Partial<Record<OpStackContractName, string>>,
  ): ScalingProjectContractSingleAddress[] {
    return OP_STACK_CONTRACT_DESCRIPTION.filter((d) =>
      this.hasContract(overrides?.[d.name] ?? d.name),
    ).map((d) =>
      this.getContractDetails(overrides?.[d.name] ?? d.name, {
        description: stringFormat(
          d.coreDescription,
          overrides?.[d.name] ?? d.name,
        ),
        ...upgradesProxy,
      }),
    )
  }

  private getContractByName(name: string): ContractParameters[] {
    const contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    return contracts.filter((contract) => contract.name === name)
  }
}

function isNonNullable<T>(
  value: T | undefined | null,
): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function stringFormat(str: string, ...val: string[]) {
  for (let index = 0; index < val.length; index++) {
    str = str.replaceAll(`{${index}}`, val[index])
  }
  return str
}
