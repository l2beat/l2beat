import { calculateInversion, InvertedAddresses } from '@l2beat/discovery'
import type {
  ContractParameters,
  ContractValue,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  gatherAddressesFromUpgradeability,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import fs from 'fs'
import { isArray, isString } from 'lodash'
import path from 'path'

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
  OrbitStackContractName,
} from './OrbitStackTypes'
import {
  StackPermissionsTag,
  StackPermissionsTagDescription,
  StackPermissionTemplate,
} from './StackTemplateTypes'

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
    public readonly chain: string = 'ethereum',
    private readonly fs: Filesystem = filesystem,
  ) {
    this.discovery = this.getDiscoveryJson(projectName)
  }

  private getDiscoveryJson(project: string): DiscoveryOutput {
    const discoveryFile = this.fs.readFileSync(
      path.resolve(
        `../backend/discovery/${project}/${this.chain}/discovered.json`,
      ),
    )

    return JSON.parse(discoveryFile) as DiscoveryOutput
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
    isLayer3,
  }: {
    address: EthereumAddress
    name?: string
    description?: string
    sinceTimestamp?: UnixTime
    tokens: string[] | '*'
    upgradableBy?: string[]
    upgradeDelay?: string
    isUpcoming?: boolean
    isLayer3?: boolean
  }): ScalingProjectEscrow {
    const contractRaw = this.getContractByAddress(address.toString())
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
      isLayer3,
    }
  }

  getInversion(): InvertedAddresses {
    return calculateInversion(this.discovery)
  }

  getOpStackPermissions(
    overrides?: Record<string, string>,
    contractOverrides?: Record<string, string>,
  ): ScalingProjectPermission[] {
    return this.getStackTemplatePermissions(
      OP_STACK_PERMISSION_TEMPLATES,
      overrides,
      contractOverrides,
    )
  }

  getOrbitStackPermissions(
    overrides?: Record<string, string>,
    contractOverrides?: Record<string, string>,
  ): ScalingProjectPermission[] {
    return this.getStackTemplatePermissions(
      ORBIT_STACK_PERMISSION_TEMPLATES,
      overrides,
      contractOverrides,
    )
  }

  getStackTemplatePermissions(
    templates: StackPermissionTemplate[],
    overrides?: Record<string, string>,
    contractOverrides?: Record<string, string>,
  ): ScalingProjectPermission[] {
    const inversion = this.getInversion()

    const result: Record<
      string,
      {
        name: string
        addresses: EthereumAddress[]
        contractDescription: Record<string, string[]>
        taggedNames: Record<string, string[]>
      }
    > = {}

    const roleNameMatches = (
      templateName: string,
      roleName: string,
    ): boolean => {
      function isNumeric(str: string): boolean {
        if (str === '') return false
        return !isNaN(+str)
      }

      // I really don't want to use regexes
      const matchesExact = templateName === roleName
      if (!matchesExact && roleName.startsWith(templateName)) {
        const suffix = roleName.slice(templateName.length)
        return suffix.startsWith('.') && isNumeric(suffix.slice(1))
      }

      return matchesExact
    }

    for (const template of templates) {
      for (const contract of inversion.values()) {
        const role = contract.roles.find(
          (r) =>
            roleNameMatches(template.role.value, r.name) &&
            r.atName ===
              (contractOverrides?.[template.role.contract] ??
                template.role.contract),
        )
        if (!role) {
          continue
        }

        const contractKey = overrides?.[role.name] ?? contract.name ?? role.name

        result[contractKey] ??= {
          name: contractKey,
          addresses: [EthereumAddress(contract.address)],
          contractDescription: {},
          taggedNames: {},
        }
        const entry = result[contractKey]

        if (template.description !== undefined) {
          entry.contractDescription[role.name] ??= []
          entry.contractDescription[role.name].push(
            stringFormat(template.description, role.atName),
          )
        }

        if (template.tags !== undefined) {
          for (const tag of template.tags) {
            entry.taggedNames[tag] ??= []
            entry.taggedNames[tag].push(role.atName)
          }
        }
      }
    }

    return Object.values(result).map((entry) => ({
      name: entry.name,
      accounts: entry.addresses.map((a) => this.formatPermissionedAccount(a)),
      description: Object.values(entry.contractDescription)
        .flat()
        .concat(
          Object.entries(entry.taggedNames).map(([tag, contracts]) =>
            stringFormat(
              StackPermissionsTagDescription[tag as StackPermissionsTag],
              contracts.join(', '),
            ),
          ),
        )
        .join(' '),
      chain: this.chain,
    }))
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
      },
      {
        name: `${identifier} participants`,
        description: `Those are the participants of the ${identifier}.`,
        accounts: this.getPermissionedAccounts(identifier, 'getOwners'),
        references,
        chain: this.chain,
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
  ): ScalingProjectPermissionedAccount {
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

  getAllContractAddresses(): EthereumAddress[] {
    const addressesWithinUpgradeability = this.discovery.contracts.flatMap(
      (contract) => gatherAddressesFromUpgradeability(contract.upgradeability),
    )

    return addressesWithinUpgradeability.filter(
      (addr) => !this.discovery.eoas.includes(addr),
    )
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

  getOpStackContractDetails(
    upgradesProxy: Partial<ScalingProjectContractSingleAddress>,
    overrides?: Partial<Record<OpStackContractName, string>>,
  ): ScalingProjectContractSingleAddress[] {
    return OP_STACK_CONTRACT_DESCRIPTION.map((d) =>
      this.getContractDetails(overrides?.[d.name] ?? d.name, {
        description: stringFormat(
          d.coreDescription,
          overrides?.[d.name] ?? d.name,
        ),
        ...upgradesProxy,
      }),
    )
  }

  getOrbitStackContractDetails(
    overrides?: Partial<Record<OrbitStackContractName, string>>,
  ): ScalingProjectContractSingleAddress[] {
    return ORBIT_STACK_CONTRACT_DESCRIPTION.map((d) =>
      this.getContractDetails(overrides?.[d.name] ?? d.name, {
        description: stringFormat(
          d.coreDescription,
          overrides?.[d.name] ?? d.name,
        ),
      }),
    )
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

export function stringFormat(str: string, ...val: string[]) {
  for (let index = 0; index < val.length; index++) {
    str = str.replaceAll(`{${index}}`, val[index])
  }
  return str
}
