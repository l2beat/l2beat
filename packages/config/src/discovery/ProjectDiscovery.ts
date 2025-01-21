import {
  ConfigReader,
  InvertedAddresses,
  RolePermissionEntries,
  calculateInversion,
} from '@l2beat/discovery'
import {
  type ContractParameters,
  type ContractValue,
  type DiscoveryOutput,
  EoaParameters,
  PermissionType,
  ReceivedPermission,
  ResolvedPermissionPath,
  get$Admins,
  get$Implementations,
  toAddressArray,
} from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  TokenBridgedUsing,
  UnixTime,
  formatSeconds,
  notUndefined,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { groupBy, isArray, isString, sum, uniq } from 'lodash'

import { join } from 'path'
import {
  ScalingProjectContract,
  ScalingProjectUpgradeability,
} from '../common/ScalingProjectContracts'
import {
  ScalingProjectEscrow,
  SharedEscrow,
} from '../common/ScalingProjectEscrow'
import {
  ScalingProjectPermission,
  ScalingProjectPermissionedAccount,
} from '../common/ScalingProjectPermission'
import { ScalingProjectReference } from '../common/ScalingProjectReference'
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

export class ProjectDiscovery {
  private readonly discoveries: DiscoveryOutput[]
  private eoaIDMap: Record<string, string> = {}
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

  getEOAName(address: EthereumAddress): string {
    if (!(address in this.eoaIDMap)) {
      this.eoaIDMap[address] = `EOA ${Object.keys(this.eoaIDMap).length + 1}`
    }

    return this.eoaIDMap[address]
  }

  getContractDetails(
    identifier: string,
    descriptionOrOptions?: string | Partial<ScalingProjectContract>,
  ): ScalingProjectContract {
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
      isVerified: contract.unverified !== true,
      address: contract.address,
      upgradeability: getUpgradeability(contract),
      chain: this.chain,
      references: contract.references,
      ...descriptionOrOptions,
    }
  }

  getEscrowDetails({
    address,
    name,
    description,
    sinceTimestamp,
    tokens,
    excludedTokens,
    premintedTokens,
    upgradableBy,
    upgradeDelay,
    isUpcoming,
    includeInTotal,
    source,
    bridgedUsing,
    isHistorical,
    untilTimestamp,
    sharedEscrow,
  }: {
    address: EthereumAddress
    name?: string
    description?: string
    sinceTimestamp?: UnixTime
    /**
     * For chains without multicall, please avoid using the wildcard '*'
     */
    tokens: string[] | '*'
    excludedTokens?: string[]
    premintedTokens?: string[]
    upgradableBy?: string[]
    upgradeDelay?: string
    isUpcoming?: boolean
    includeInTotal?: boolean
    source?: ScalingProjectEscrow['source']
    bridgedUsing?: TokenBridgedUsing
    isHistorical?: boolean
    untilTimestamp?: UnixTime
    sharedEscrow?: SharedEscrow
  }): ScalingProjectEscrow {
    const contractRaw = this.getContract(address.toString())
    const timestamp = sinceTimestamp?.toNumber() ?? contractRaw.sinceTimestamp
    assert(
      timestamp,
      'No timestamp was found for an escrow. Possible solutions:\n1. Run discovery for that address to capture the sinceTimestamp.\n2. Provide your own sinceTimestamp that will override the value from discovery.',
    )

    const options: Partial<ScalingProjectContract> = {
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
      excludedTokens,
      premintedTokens,
      contract,
      isUpcoming,
      chain: this.chain,
      includeInTotal:
        (includeInTotal ?? this.chain === 'ethereum') ? true : includeInTotal,
      source,
      bridgedUsing,
      isHistorical,
      untilTimestamp,
      sharedEscrow,
    }
  }

  isEOA(address: EthereumAddress): boolean {
    const eoas = this.discoveries.flatMap((discovery) => discovery.eoas)
    return (
      eoas.find((x) => x.address.toString() === address.toString()) !==
      undefined
    )
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
    contracts: ScalingProjectContract[]
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
    contracts: ScalingProjectContract[]
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

  getMultisigDescription(identifier: string): string[] {
    const contract = this.getContract(identifier)
    assert(
      isMultisigLike(contract),
      `Contract ${contract.name} is not a Gnosis Safe (${this.projectName})`,
    )

    const modules = toAddressArray(contract.values?.GnosisSafe_modules)
    const modulesDescriptions = modules
      .map((m) => this.getContractByAddress(m))
      .filter(notUndefined)
      .map((contract) => ({
        name: contract.name,
        description: trimTrailingDots(contract.description ?? ''),
      }))
      .map(
        ({ name, description }) =>
          name + (description.length !== 0 ? ` (${description})` : ''),
      )

    const fullModulesDescription =
      modulesDescriptions.length === 0
        ? ''
        : `It uses the following modules: ${modulesDescriptions.join(', ')}.`

    return [
      `A Gnosis Safe with ${this.getMultisigStats(identifier)} threshold. ` +
        fullModulesDescription,
    ]
  }

  getMultisigPermission(
    identifier: string,
    description: string | string[],
    userReferences?: ScalingProjectReference[],
    useBulletPoints: boolean = false,
  ): ScalingProjectPermission[] {
    const contract = this.getContract(identifier)

    const passedDescription = Array.isArray(description)
      ? description
      : [description]

    const multisigDesc = this.getMultisigDescription(identifier)

    const combinedDescriptions = [...multisigDesc, ...passedDescription]

    const formattedDesc = useBulletPoints
      ? formatAsBulletPoints(combinedDescriptions)
      : combinedDescriptions.join(' ')

    const descriptionWithContractNames =
      this.replaceAddressesWithNames(formattedDesc)

    const references = [
      ...(userReferences ?? []),
      ...(contract.references ?? []),
    ]

    return [
      {
        name: contract.name,
        description: descriptionWithContractNames,
        accounts: [
          {
            address: contract.address,
            type: 'MultiSig',
          },
        ],
        chain: this.chain,
        references,
        participants: this.getPermissionedAccounts(identifier, '$members'),
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

  getContractValueOrUndefined<T extends ContractValue>(
    contractIdentifier: string,
    key: string,
  ): T | undefined {
    const contract = this.getContract(contractIdentifier)
    return contract.values?.[key] as T | undefined
  }

  getContractValue<T extends ContractValue>(
    contractIdentifier: string,
    key: string,
  ): T {
    const result = this.getContractValueOrUndefined<T>(contractIdentifier, key)
    assert(
      isNonNullable(result),
      `Value of key ${key} does not exist in ${contractIdentifier} contract (${this.projectName})`,
    )

    return result
  }

  getContractValueBigInt(contractIdentifier: string, key: string): bigint {
    const result = this.getContractValueOrUndefined(contractIdentifier, key)
    assert(
      isNonNullable(result),
      `Value of key ${key} does not exist in ${contractIdentifier} contract (${this.projectName})`,
    )

    assert(typeof result === 'string' || typeof result === 'number')

    return BigInt(result)
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
    const isMultisig = isMultisigLike(contract)

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
    descriptionOrOptions?: string | Partial<ScalingProjectContract>,
  ): ScalingProjectContract {
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
      isVerified: contract.unverified !== true,
      name: contract.name,
      upgradeability: getUpgradeability(contract),
      chain: this.chain,
      ...descriptionOrOptions,
    }
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
      references: contract.references,
      description,
    }
  }

  getMultisigStats(contractIdentifier: string) {
    const threshold = this.getContractValue<number>(
      contractIdentifier,
      '$threshold',
    )
    const size = this.getContractValue<string[]>(
      contractIdentifier,
      '$members',
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

  get$Admins(contractIdentifier: string) {
    const contract = this.getContract(contractIdentifier)
    return get$Admins(contract.values)
  }

  get$Implementations(contractIdentifier: string) {
    const contract = this.getContract(contractIdentifier)
    return get$Implementations(contract.values)
  }

  getAccessControlField(
    contractIdentifier: string,
    roleName: string,
  ): {
    adminRole: EthereumAddress[]
    members: EthereumAddress[]
  } {
    const accessControl = this.getContractValue<
      Partial<Record<string, { adminRole: string; members: string[] }>>
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
      get$Implementations(contract.values),
    )

    return addressesWithinUpgradeability.filter((addr) => !this.isEOA(addr))
  }

  getContractByAddress(
    address: string | EthereumAddress,
  ): ContractParameters | undefined {
    const contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    return contracts.find(
      (contract) => contract.address === EthereumAddress(address.toString()),
    )
  }

  getEntryByAddress(
    address: string | EthereumAddress,
  ): EoaParameters | ContractParameters | undefined {
    const entries = this.discoveries.flatMap((discovery) => {
      return [...discovery.contracts, ...discovery.eoas]
    })
    return entries.find(
      (entry) => entry.address === EthereumAddress(address.toString()),
    )
  }

  getOpStackContractDetails(
    upgradesProxy: Partial<ScalingProjectContract>,
    overrides?: Partial<Record<OpStackContractName, string>>,
  ): ScalingProjectContract[] {
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

  getContractsAndEoas(): (ContractParameters | EoaParameters)[] {
    const contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    const eoas = this.discoveries.flatMap((discovery) => discovery.eoas)
    return [...contracts, ...eoas]
  }

  getPermissionsByRole(
    role: (typeof RolePermissionEntries)[number],
  ): ScalingProjectPermissionedAccount[] {
    return this.getContractsAndEoas()
      .filter((x) =>
        (x.receivedPermissions ?? []).find((p) => p.permission === role),
      )
      .map((x) => this.formatPermissionedAccount(x.address))
  }

  describeGnosisSafeMembership(
    contractOrEoa: ContractParameters | EoaParameters,
  ): string[] {
    const safesWithThisMember = this.discoveries
      .flatMap((discovery) => discovery.contracts)
      .filter((contract) => isMultisigLike(contract))
      .filter((contract) =>
        toAddressArray(contract.values?.$members).includes(
          contractOrEoa.address,
        ),
      )
      .map((contract) => contract.name)
    return safesWithThisMember.length === 0
      ? []
      : ['Member of ' + safesWithThisMember.join(', ') + '.']
  }

  describeRolePermissions(
    relevantContracts: (ContractParameters | EoaParameters)[],
  ): ScalingProjectPermission[] {
    const result: ScalingProjectPermission[] = []
    for (const role of RolePermissionEntries) {
      const matching = relevantContracts.filter(
        (c) =>
          (c.receivedPermissions ?? []).find((p) => p.permission === role) !==
          undefined,
      )

      if (matching.length === 0) {
        continue
      }

      const addresses = matching.map((c) => c.address)
      const descriptions = uniq(
        matching
          .flatMap((c) =>
            (c.receivedPermissions ?? []).filter((p) => p.permission === role),
          )
          .map((p) => p.description)
          .filter((d) => d !== undefined),
      )
      assert(
        descriptions.length <= 1,
        `Conflicting descriptions found ${descriptions}`,
      )

      const accounts = addresses.map((a) => this.formatPermissionedAccount(a))
      result.push({
        ...roleDescriptions[role],
        description: descriptions[0] ?? roleDescriptions[role].description,
        accounts,
        fromRole: true,
      })
    }
    return result
  }

  formatViaPath(path: ResolvedPermissionPath): string {
    const name =
      this.getContractByAddress(path.address)?.name ?? path.address.toString()

    let result = name
    if (path.delay) {
      result += ` with ${formatSeconds(path.delay)} delay`
    }

    return result
  }

  describeUltimatelyReceivedPermissions(
    contractOrEoa: ContractParameters | EoaParameters,
  ): string[] {
    const ultimatePermissionToPrefix: {
      [key in PermissionType]: string | undefined
    } = {
      configure: 'Can change the configuration of',
      upgrade: 'Can upgrade the implementation of',
      act: undefined,
      guard: 'A Guardian',
      challenge: 'A Challenger',
      propose: 'A Proposer',
      sequence: 'A Sequencer',
      validate: 'A Validator',
      operateLinea: 'An Operator',
      fastconfirm: 'A FastConfirmer',
      validateZkStack: 'A Validator',
    }

    const formatVia = (via: ResolvedPermissionPath[]) =>
      ` (acting via ${via.map((p) => this.formatViaPath(p)).join(', ')})`

    return Object.entries(
      groupBy(
        contractOrEoa.receivedPermissions ?? [],
        (value: ReceivedPermission) => {
          return [
            value.permission,
            value.via !== undefined ? formatVia(value.via) : '',
            value.description ?? '',
          ].join(':')
        },
      ),
    ).map(([key, entries]) => {
      const permission = key.split(':')[0] as PermissionType
      const via = key.split(':')[1] ?? ''
      const description = key.split(':', 3)[2] ?? ''
      const prefix = ultimatePermissionToPrefix[permission]
      if (prefix === undefined) {
        return ''
      }

      const showTargets = ['configure', 'upgrade', 'act'].includes(permission)
      const addressesString = showTargets
        ? entries
            .map((entry) => this.getContract(entry.from.toString()).name)
            .join(', ')
        : ''

      const detailsString =
        addressesString + via + formatPermissionDescription(description)
      return `${[
        ultimatePermissionToPrefix[permission as PermissionType],
        detailsString,
      ]
        .join(' ')
        .trim()}.`
    })
  }

  describeDirectlyReceivedPermissions(
    contractOrEoa: ContractParameters | EoaParameters,
  ): string[] {
    const directPermissionToPrefix: {
      [key in PermissionType]: string | undefined
    } = {
      configure: 'Can be used to configure',
      upgrade: 'Can be used to upgrade implementation of',
      act: 'Can act on behalf of',
      guard: 'Can act as a Guardian',
      challenge: 'Can act as a Challenger',
      propose: 'Can act as a Proposer',
      sequence: 'Can act as a Sequencer',
      validate: 'Can act as a Validator',
      operateLinea: 'Can act as an Operator',
      fastconfirm: 'Can act as a FastConfirmer',
      validateZkStack: 'Can act as a Validator',
    }

    return Object.entries(
      groupBy(
        contractOrEoa.directlyReceivedPermissions ?? [],
        (value: ReceivedPermission) =>
          value.permission + ':' + (value.description ?? ''),
      ),
    ).map(([key, entries]) => {
      const permission = key.split(':')[0] as PermissionType
      const description = key.split(':', 2)[1] ?? ''
      const showTargets = ['configure', 'upgrade', 'act'].includes(permission)
      const addressesString = showTargets
        ? entries
            .map((entry) => this.getContract(entry.from.toString()).name)
            .join(', ')
        : ''

      return `${[
        directPermissionToPrefix[permission],
        addressesString,
        formatPermissionDescription(description),
      ]
        .join(' ')
        .trim()}.`
    })
  }

  describeContractOrEoa(
    contractOrEoa: ContractParameters | EoaParameters,
    includeDirectPermissions: boolean = true,
  ): string[] {
    return [
      ...this.describeGnosisSafeMembership(contractOrEoa),
      ...(includeDirectPermissions
        ? this.describeDirectlyReceivedPermissions(contractOrEoa)
        : []),
      ...this.describeUltimatelyReceivedPermissions(contractOrEoa),
      contractOrEoa.description,
    ].filter(notUndefined)
  }

  replaceAddressesWithNames(s: string): string {
    const ethereumAddressRegex = /\b0x[a-fA-F0-9]{40}\b/g
    const addresses = s.match(ethereumAddressRegex) ?? []

    for (const address of addresses) {
      const contract = this.getContractByAddress(address)
      if (contract !== undefined) {
        s = s.replace(address, contract.name)
      }
    }
    return s
  }

  getDiscoveredPermissions(): ScalingProjectPermission[] {
    const contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    const result: ScalingProjectPermission[] = []

    const relevantContracts = [
      ...contracts.filter(
        (contract) => contract.receivedPermissions !== undefined,
      ),
      // We show multisigs even without ultimate permissions,
      // because they can be members of msigs with permissions.
      // We can also assume that msigs are always permissioned.
      // But we show them last.
      ...contracts.filter(
        (contract) =>
          contract.receivedPermissions === undefined &&
          isMultisigLike(contract),
      ),
    ]
    const eoas = this.discoveries.flatMap((discovery) => discovery.eoas)

    result.push(...this.describeRolePermissions(relevantContracts))
    result.push(...this.describeRolePermissions(eoas))

    for (const contract of relevantContracts) {
      const descriptions = this.describeContractOrEoa(contract, true)
      if (isMultisigLike(contract)) {
        result.push(
          ...this.getMultisigPermission(
            contract.address.toString(),
            descriptions,
            [],
            true,
          ),
        )
      } else {
        result.push(
          this.contractAsPermissioned(
            contract,
            formatAsBulletPoints(descriptions),
          ),
        )
      }
    }

    for (const eoa of eoas) {
      if (eoa.receivedPermissions === undefined) {
        continue
      }
      const description = formatAsBulletPoints(
        this.describeContractOrEoa(eoa, false),
      )
      result.push({
        name: eoa.name ?? this.getEOAName(eoa.address),
        accounts: [this.formatPermissionedAccount(eoa.address)],
        chain: this.chain,
        description,
      })
    }

    result.forEach((permission) => {
      permission.description = this.replaceAddressesWithNames(
        permission.description,
      )
    })
    return result.map((p) => ({ ...p, discoveryDrivenData: true }))
  }

  getDiscoveredContracts(): ScalingProjectContract[] {
    const contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    const gnosisModules = contracts.flatMap((contract) =>
      toAddressArray(contract.values?.GnosisSafe_modules),
    )
    const result = contracts
      .filter((contract) => !gnosisModules.includes(contract.address))
      .filter((contract) => contract.receivedPermissions === undefined)
      .filter((contract) => !isMultisigLike(contract))
      .map((contract) => {
        const upgradersWithDelay: Record<string, number> = Object.fromEntries(
          contract.issuedPermissions
            ?.filter((p) => p.permission === 'upgrade')
            .map((p) => {
              const entry = this.getEntryByAddress(p.to)
              const address =
                entry?.name ??
                (this.isEOA(p.to) ? this.getEOAName(p.to) : p.to.toString())
              const delay =
                (p.delay ?? 0) + sum(p.via?.map((v) => v.delay ?? 0) ?? [])
              return [address, delay]
            }) ?? [],
        )

        const upgraders = Object.keys(upgradersWithDelay)
        const minDelay = Math.min(...Object.values(upgradersWithDelay))
        const upgradableBy =
          upgraders.length === 0
            ? {}
            : {
                upgradableBy: upgraders,
                upgradeDelay:
                  minDelay === 0 ? 'No delay' : formatSeconds(minDelay),
              }

        return this.getContractDetails(contract.address.toString(), {
          description: formatAsBulletPoints(
            this.describeContractOrEoa(contract, true),
          ),
          ...upgradableBy,
          discoveryDrivenData: true,
        })
      })

    result.forEach((contract) => {
      if (contract.description !== undefined) {
        contract.description = this.replaceAddressesWithNames(
          contract.description,
        )
      }
    })

    return result
  }
}

function getUpgradeability(
  contract: ContractParameters,
): ScalingProjectUpgradeability | undefined {
  if (!contract.proxyType) {
    return undefined
  }
  const upgradeability: ScalingProjectUpgradeability = {
    proxyType: contract.proxyType,
    admins: get$Admins(contract.values),
    implementations: get$Implementations(contract.values),
  }
  if (contract.values?.$immutable !== undefined) {
    upgradeability.immutable = !!contract.values.$immutable
  }
  return upgradeability
}

function isNonNullable<T>(
  value: T | undefined | null,
): value is NonNullable<T> {
  return value !== null && value !== undefined
}

function stringFormat(str: string, ...val: string[]) {
  for (let index = 0; index < val.length; index++) {
    str = str.replaceAll(`{${index}}`, val[index])
  }
  return str
}

const roleDescriptions: {
  [key in (typeof RolePermissionEntries)[number]]: {
    name: string
    description: string
  }
} = {
  sequence: {
    name: 'Sequencer',
    description:
      'Sequencer is an actor allowed to commit transactions from the current layer to the host chain.',
  },
  propose: {
    name: 'Proposer',
    description:
      'Proposer is an actor allowed to post new state roots of the current layer to the host chain.',
  },
  challenge: {
    name: 'Challenger',
    description:
      'Challenger is an actor allowed to challenge or delete state roots proposed by a Proposer.',
  },
  guard: {
    name: 'Guardian',
    description:
      'Guardian is an actor allowed to pause deposits and withdrawals.',
  },
  validate: {
    // ORBIT specific
    name: 'Validator/Proposer',
    description:
      'Can propose new state roots (called nodes) and challenge state roots on the host chain.',
  },
  operateLinea: {
    // LINEA specific
    name: 'Operator',
    description:
      'Allowed to prove blocks and post the corresponding transaction data.',
  },
  fastconfirm: {
    name: 'AnyTrust FastConfirmer',
    description:
      'Can finalize a state root before the challenge period has passed. This allows withdrawing from the bridge based on the state root.',
  },
  validateZkStack: {
    // ZK stack specific
    name: 'Validator',
    description:
      'Actors permissioned to call the functions to commit, prove, execute and revert L2 batches through the ValidatorTimelock in the main Diamond contract.',
  },
}

export function formatAsBulletPoints(description: string[]): string {
  return description.length > 1
    ? description.map((s) => `* ${s}\n`).join('')
    : description.join(' ')
}

export function trimTrailingDots(s: string): string {
  return s.replace(/\.*$/, '')
}

function formatPermissionDescription(description: string): string {
  return description !== '' ? ` - ${trimTrailingDots(description)}` : ''
}

function isMultisigLike(contract: ContractParameters | undefined): boolean {
  if (contract === undefined) {
    return false
  }

  const hasMembers = contract.values?.['$members'] !== undefined
  const hasThreshold = contract.values?.['$threshold'] !== undefined

  return hasMembers && hasThreshold
}
