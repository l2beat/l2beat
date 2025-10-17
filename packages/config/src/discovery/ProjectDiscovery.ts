import type {
  ContractValue,
  DiscoveryOutput,
  EntryParameters,
  ResolvedPermissionPath,
} from '@l2beat/discovery'
import {
  ConfigReader,
  getDiscoveryPaths,
  RolePermissionEntries,
} from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  type LegacyTokenBridgedUsing,
  notUndefined,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import groupBy from 'lodash/groupBy'
import isString from 'lodash/isString'
import uniq from 'lodash/uniq'
import { EXPLORER_URLS } from '../common/explorerUrls'
import type {
  ProjectContract,
  ProjectContractUpgradeability,
  ProjectEscrow,
  ProjectPermission,
  ProjectPermissionedAccount,
  ProjectPermissions,
  ProjectUpgradeableActor,
  ReferenceLink,
  SharedEscrow,
} from '../types'
import { RoleDescriptions } from './descriptions'
import { get$Admins, get$Implementations, toAddressArray } from './extractors'
import { pastUpgradesSchema } from './models'
import type { PermissionRegistry } from './PermissionRegistry'
import { PermissionsFromDiscovery } from './PermissionsFromDiscovery'
import {
  formatPermissionCondition,
  formatPermissionDelay,
  isMultisigLike,
  trimTrailingDots,
} from './utils'

const paths = getDiscoveryPaths()

export class ProjectDiscovery {
  private readonly discoveries: DiscoveryOutput[]
  private readonly reachableEntries: EntryParameters[]
  private eoaIDMap: Record<string, string> = {}
  private permissionRegistry: PermissionRegistry

  constructor(
    public readonly projectName: string,
    public readonly configReader = new ConfigReader(paths.discovery),
  ) {
    // TODO: Legacy behavior - we blindly create new ProjectDiscovery instances in tests
    try {
      this.discoveries = configReader.readDiscoveryWithReferences(projectName)
    } catch {
      this.discoveries = []
    }

    // always the base discovery
    // TODO: Uncomment me once cross-chain permissions are implemented
    // const entrypoints = [...(this.discoveries.at(0)?.entries ?? [])].map(
    //   (e) => e.address,
    // )

    // Removing Reference entries because otherwise we get duplicates
    // and incomplete data.
    // TODO: refactor this whole logic around depenent projects and
    // references to entrypoints to make it cleaner
    this.discoveries.forEach((d) => removeReferences(d))

    // TODO: Uncomment me once cross-chain permissions are implemented
    // this.reachableEntries = getReachableEntries(
    //   this.discoveries.flatMap((discovery) => discovery.entries),
    //   entrypoints,
    // )
    this.reachableEntries = this.discoveries.flatMap(
      (discovery) => discovery.entries,
    )

    this.permissionRegistry = new PermissionsFromDiscovery(this)
  }

  get maxTimestamp(): number {
    return Math.max(...this.discoveries.map((d) => d.timestamp))
  }

  getName(address: ChainSpecificAddress): string {
    return (
      this.getEntryByAddress(address)?.name ??
      (this.isEOA(address) ? this.getEOAName(address) : address.toString())
    )
  }

  getEOAName(address: ChainSpecificAddress): string {
    if (!(address in this.eoaIDMap)) {
      this.eoaIDMap[address] = `EOA ${Object.keys(this.eoaIDMap).length + 1}`
    }

    return this.eoaIDMap[address]
  }

  getContractDetails(
    identifier: string,
    descriptionOrOptions?: string | Partial<ProjectContract>,
  ): ProjectContract {
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
      name: contract.name ?? contract.address,
      isVerified: isEntryVerified(contract),
      address: contract.address,
      upgradeability: getUpgradeability(contract),
      chain: ChainSpecificAddress.longChain(contract.address),
      references: contract.references?.map((x) => ({
        title: x.text,
        url: x.href,
      })),
      pastUpgrades: getPastUpgrades(contract),
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
    isUpcoming,
    includeInTotal,
    source,
    bridgedUsing,
    isHistorical,
    untilTimestamp,
    sharedEscrow,
  }: {
    address: ChainSpecificAddress
    name?: string
    description?: string
    sinceTimestamp?: UnixTime
    /**
     * For chains without multicall, please avoid using the wildcard '*'
     */
    tokens: string[] | '*'
    excludedTokens?: string[]
    premintedTokens?: string[]
    upgradableBy?: ProjectUpgradeableActor[]
    isUpcoming?: boolean
    includeInTotal?: boolean
    source?: ProjectEscrow['source']
    bridgedUsing?: LegacyTokenBridgedUsing
    isHistorical?: boolean
    untilTimestamp?: UnixTime
    sharedEscrow?: SharedEscrow
  }): ProjectEscrow {
    const contractRaw = this.getContract(address.toString())
    const timestamp = sinceTimestamp ?? contractRaw.sinceTimestamp
    assert(
      timestamp !== undefined,
      'No timestamp was found for an escrow. Possible solutions:\n1. Run discovery for that address to capture the sinceTimestamp.\n2. Provide your own sinceTimestamp that will override the value from discovery.',
    )

    const options: Partial<ProjectContract> = {
      name,
      description,
      upgradableBy,
    }

    const contract = this.getContractDetails(address, options)

    const chain = ChainSpecificAddress.longChain(address)
    return {
      address: ChainSpecificAddress.address(address),
      sinceTimestamp: UnixTime(timestamp),
      tokens,
      excludedTokens,
      premintedTokens,
      contract,
      isUpcoming,
      chain,
      includeInTotal:
        (includeInTotal ?? chain === 'ethereum') ? true : includeInTotal,
      source,
      bridgedUsing,
      isHistorical,
      untilTimestamp,
      sharedEscrow,
    }
  }

  isEOA(address: ChainSpecificAddress): boolean {
    const eoas = this.discoveries.flatMap((discovery) => discovery.entries)
    const entry = eoas.find((x) => x.address.toString() === address.toString())
    return entry?.type === 'EOA'
  }

  getMultisigDescription(identifier: string): string[] {
    const contract = this.getContract(identifier)
    assert(
      isMultisigLike(contract),
      `Contract ${contract.name} is not a Multisig (${this.projectName})`,
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
      `A Multisig with ${this.getMultisigStats(identifier)} threshold. ` +
        fullModulesDescription,
    ]
  }

  getMultisigPermission(
    identifier: string,
    description: string | string[],
    userReferences?: ReferenceLink[],
  ): ProjectPermission {
    const contract = this.getContract(identifier)

    const passedDescription = Array.isArray(description)
      ? description
      : [description]

    const multisigDesc = this.getMultisigDescription(identifier)

    const combinedDescriptions = [...multisigDesc, ...passedDescription].filter(
      (s) => s !== undefined && s !== '',
    )

    const references = [
      ...(userReferences ?? []),
      ...(contract.references ?? []).map((x) => ({
        title: x.text,
        url: x.href,
      })),
    ]

    return {
      id: contract.name ?? contract.address,
      name: contract.name ?? contract.address,
      description: combinedDescriptions.join('\n'),
      accounts: this.formatPermissionedAccounts([contract.address]),
      chain: ChainSpecificAddress.longChain(contract.address),
      references,
      participants: this.getPermissionedAccounts(identifier, '$members'),
    }
  }

  getAccessControlRolePermission(
    contractIdentifier: string,
    role: string,
  ): ProjectPermissionedAccount[] {
    const { members } = this.getAccessControlField(contractIdentifier, role)
    return this.formatPermissionedAccounts(members)
  }

  getContract(identifier: string): EntryParameters {
    try {
      identifier = identifier.includes(':')
        ? identifier
        : utils.getAddress(identifier)
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

    const contract = this.getContractByAddress(ChainSpecificAddress(identifier))
    assert(
      contract,
      `No contract of ${identifier} address found (${this.projectName})`,
    )

    return contract
  }

  isReachable(address: ChainSpecificAddress): boolean {
    return this.reachableEntries.some((e) => e.address === address)
  }

  hasContract(identifier: string): boolean {
    try {
      identifier = utils.getAddress(identifier)
    } catch {
      const contracts = this.getContractByName(identifier)
      return contracts.length === 1
    }

    const contract = this.getContractByAddress(ChainSpecificAddress(identifier))
    return contract !== undefined
  }

  getEOA(identifier: string): EntryParameters {
    try {
      identifier = utils.getAddress(identifier)
    } catch {
      const eoas = this.getEOAByName(identifier)

      assert(
        !(eoas.length > 1),
        `Found more than one eoas of ${identifier} name (${this.projectName})`,
      )
      assert(
        eoas.length === 1,
        `Found no eoa of ${identifier} name (${this.projectName})`,
      )

      return eoas[0]
    }

    const eoa = this.getEOAByAddress(identifier)
    assert(eoa, `No eoa of ${identifier} address found (${this.projectName})`)

    return eoa
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
  ): ChainSpecificAddress {
    const address = this.getContractValue(contractIdentifier, key)

    assert(
      isString(address) && ChainSpecificAddress.check(address),
      `Value of ${key} must be an Ethereum address`,
    )

    return ChainSpecificAddress(address)
  }

  formatPermissionedAccounts(
    accounts: (ContractValue | ChainSpecificAddress)[],
  ): ProjectPermissionedAccount[] {
    const result: ProjectPermissionedAccount[] = []

    for (const account of accounts) {
      assert(
        isString(account) && ChainSpecificAddress.check(account),
        'Values must be Ethereum addresses',
      )
      const address = ChainSpecificAddress(account)
      const entry = this.getEntryByAddress(address)
      assert(isNonNullable(entry), `Could not find ${address} in discovery`)
      const type = entry.type
      const isVerified = isEntryVerified(entry)

      const raw = ChainSpecificAddress.address(address)
      const chain = ChainSpecificAddress.longChain(address)
      const name = `${raw.slice(0, 6)}…${raw.slice(38, 42)}`
      const explorerUrl = EXPLORER_URLS[chain]
      assert(
        isNonNullable(explorerUrl),
        `Failed to find explorer url for chain [${chain}]`,
      )
      const url = `${explorerUrl}/address/${raw}`

      result.push({ address, type, isVerified, name, url })
    }

    return result
  }

  getPermissionedAccounts(
    contractIdentifier: string,
    key: string,
  ): ProjectPermissionedAccount[] {
    const value = this.getContractValue(contractIdentifier, key)
    const addresses: ContractValue[] = []
    if (Array.isArray(value)) {
      addresses.push(...value)
    } else {
      addresses.push(value)
    }

    return this.formatPermissionedAccounts(addresses)
  }

  getPermissionDetails(
    name: string,
    accounts: ProjectPermissionedAccount[],
    description: string,
    opts?: {
      references?: ReferenceLink[]
    },
  ): ProjectPermission {
    let chain = 'ethereum'
    if (accounts.length > 0) {
      const chains = accounts.map((a) =>
        ChainSpecificAddress.longChain(a.address),
      )
      const uniqueChains = unique(chains)
      assert(
        uniqueChains.length === 1,
        `All accounts must be on the same chain. Found ${uniqueChains.join(
          ', ',
        )}`,
      )
      chain = uniqueChains[0]
    }

    return {
      id: name,
      name,
      accounts,
      description,
      chain,
      ...(opts ?? {}),
    }
  }

  getContractFromValue(
    contractIdentifier: string,
    key: string,
    descriptionOrOptions?: string | Partial<ProjectContract>,
  ): ProjectContract {
    const address = this.getContractValue(contractIdentifier, key)
    assert(
      isString(address) && ChainSpecificAddress.check(address),
      `Value of ${key} must be an Ethereum address`,
    )
    const contract = this.getContract(address)
    if (typeof descriptionOrOptions === 'string') {
      descriptionOrOptions = { description: descriptionOrOptions }
    }
    return {
      address: contract.address,
      isVerified: isEntryVerified(contract),
      name: contract.name ?? contract.address,
      upgradeability: getUpgradeability(contract),
      chain: ChainSpecificAddress.longChain(contract.address),
      ...descriptionOrOptions,
    }
  }

  contractAsPermissioned(
    contract: EntryParameters,
    description: string,
  ): ProjectPermission {
    return {
      id: contract.name ?? contract.address,
      name: contract.name ?? contract.address,
      accounts: this.formatPermissionedAccounts([contract.address]),
      chain: ChainSpecificAddress.longChain(contract.address),
      references: contract.references?.map((x) => ({
        title: x.text,
        url: x.href,
      })),
      description,
    }
  }

  eoaAsPermissioned(
    eoa: EntryParameters,
    description: string,
  ): ProjectPermission {
    return {
      id: eoa.name ?? eoa.address,
      name: eoa.name ?? eoa.address,
      accounts: this.formatPermissionedAccounts([eoa.address]),
      chain: ChainSpecificAddress.longChain(eoa.address),
      references: eoa.references?.map((x) => ({
        title: x.text,
        url: x.href,
      })),
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
    return `${threshold}/${size}`
  }

  getConstructorArg<T extends ContractValue>(
    contractIdentifier: string,
    index: number,
  ): T {
    return this.getContractValue<T[]>(contractIdentifier, 'constructorArgs')[
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

  get$TokenData() {
    return this.getContracts()
      .flatMap((contract) => contract.values?.$tokenData)
      .filter(notUndefined)
  }

  getAccessControlField(
    contractIdentifier: string,
    roleName: string,
  ): {
    adminRole: ChainSpecificAddress[]
    members: ChainSpecificAddress[]
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
        ChainSpecificAddress.check(address),
      ),
      `Role ${roleName}/${role.adminRole} has invalid addresses`,
    )

    return {
      adminRole: adminRole.members.map((m) => ChainSpecificAddress(m)),
      members: role.members.map(ChainSpecificAddress),
    }
  }

  getContractByAddress(
    address: ChainSpecificAddress,
  ): EntryParameters | undefined {
    const contracts = this.getContracts()
    return contracts.find((contract) => contract.address === address)
  }

  getEOAByAddress(
    address: string | ChainSpecificAddress,
  ): EntryParameters | undefined {
    const eoas = this.discoveries
      .flatMap((discovery) => discovery.entries)
      .filter((e) => e.type === 'EOA')
    return eoas.find(
      (contract) =>
        contract.address === ChainSpecificAddress(address.toString()),
    )
  }

  getEntryByAddress(
    address: ChainSpecificAddress,
  ): EntryParameters | undefined {
    return this.discoveries
      .flatMap((discovery) => discovery.entries)
      .find((entry) => entry.address === address)
  }

  private getContractByName(name: string): EntryParameters[] {
    const contracts = this.discoveries.flatMap((discovery) =>
      discovery.entries.filter((e) => e.type === 'Contract'),
    )
    return contracts.filter((contract) => contract.name === name)
  }

  private getEOAByName(name: string): EntryParameters[] {
    const eoas = this.discoveries
      .flatMap((discovery) => discovery.entries)
      .filter((e) => e.type === 'EOA')

    return eoas.filter((eoa) => eoa.name === name)
  }

  getEntries(): EntryParameters[] {
    return this.discoveries.flatMap((discovery) => discovery.entries)
  }

  getReachableEntries(): EntryParameters[] {
    return this.reachableEntries
  }

  getPrefixedContracts(): {
    [chainSpecificAddress: string]: EntryParameters
  } {
    const result: { [chainSpecificAddress: string]: EntryParameters } = {}

    this.discoveries.forEach((discovery) => {
      discovery.entries.forEach((e) => {
        if (e.type === 'Contract') {
          const chainSpecificAddress = e.address
          if (result[chainSpecificAddress] !== undefined) {
            throw new Error(
              `Duplicate contract address entry: ${chainSpecificAddress}`,
            )
          }
          result[chainSpecificAddress] = e
        }
      })
    })
    return result
  }

  getContracts(): EntryParameters[] {
    return this.discoveries
      .flatMap((discovery) => discovery.entries)
      .filter((e) => e.type === 'Contract')
  }

  getReachableContracts(): EntryParameters[] {
    return this.reachableEntries.filter((e) => e.type === 'Contract')
  }

  getEoas(): EntryParameters[] {
    return this.discoveries
      .flatMap((discovery) => discovery.entries)
      .filter((e) => e.type === 'EOA')
  }

  getReachableEoas(): EntryParameters[] {
    return this.reachableEntries.filter((e) => e.type === 'EOA')
  }

  getContractsAndEoas(): EntryParameters[] {
    return [...this.getContracts(), ...this.getEoas()]
  }

  getTopLevelAddresses(): ChainSpecificAddress[] {
    const contracts = this.getContracts()
    const implementations = contracts.flatMap((contract) =>
      get$Implementations(contract.values),
    )

    const contractsAddresses = contracts.map((e) => e.address)
    const eoasAddresses = this.getEoas().map((e) => e.address)
    return [...contractsAddresses, ...implementations, ...eoasAddresses]
  }

  getPermissionsByRole(
    role: (typeof RolePermissionEntries)[number],
  ): ProjectPermissionedAccount[] {
    const addresses = this.getContractsAndEoas()
      .filter((x) =>
        (x.receivedPermissions ?? []).find((p) => p.permission === role),
      )
      .map((x) => x.address)

    return this.formatPermissionedAccounts(addresses)
  }

  describeGnosisSafeMembership(
    contractOrEoa: EntryParameters,
  ): string | undefined {
    const safesWithThisMember = this.discoveries
      .flatMap((discovery) => discovery.entries)
      .filter((contract) => isMultisigLike(contract))
      .filter((contract) =>
        toAddressArray(contract.values?.$members).includes(
          contractOrEoa.address,
        ),
      )
      .map((contract) => contract.name)
    return safesWithThisMember.length === 0
      ? undefined
      : `Member of ${safesWithThisMember.join(', ')}.`
  }

  describeRolePermissions(
    relevantContracts: EntryParameters[],
  ): ProjectPermission[] {
    const result: ProjectPermission[] = []
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

      const finalDescription = [
        descriptions[0] ?? RoleDescriptions[role].description,
      ]

      for (const c of matching) {
        const initialConditions = (c.receivedPermissions ?? [])
          .filter((p) => p.permission === role)
          .map((p) =>
            this.formatViaPath(
              {
                address: c.address,
                condition: p.condition,
                delay: p.delay,
              },
              true,
            ),
          )
          .filter((p) => p !== '')
        const pathConditions = (c.receivedPermissions ?? [])
          .filter((p) => p.permission === role)
          .flatMap((p) => p.via?.map((v) => this.formatViaPath(v, true)))
          .filter((p) => p !== '')
        const conditions = uniq([
          ...initialConditions,
          ...pathConditions,
        ]).filter(notUndefined)

        if (conditions.length > 0) {
          finalDescription.push(
            `* ${c.name} has the role ${conditions.join(', ')}`,
          )
        }
      }

      const allAccounts = this.formatPermissionedAccounts(addresses)
      const uniqueChains = unique(
        allAccounts.map((a) => ChainSpecificAddress.longChain(a.address)),
      )
      for (const uniqueChain of uniqueChains) {
        const accounts = allAccounts.filter(
          (a) => ChainSpecificAddress.longChain(a.address) === uniqueChain,
        )
        const r = RoleDescriptions[role]
        result.push({
          id: r.name,
          ...r,
          description: finalDescription.join('\n'),
          accounts,
          chain: uniqueChain,
        })
      }
    }
    return result
  }

  formatViaPath(path: ResolvedPermissionPath, skipName = false): string {
    const name =
      this.getContractByAddress(path.address)?.name ?? path.address.toString()

    const result = skipName ? [] : [name]
    if (path.delay) {
      result.push(formatPermissionDelay(path.delay))
    }
    if (path.condition) {
      result.push(formatPermissionCondition(path.condition))
    }

    return result.join(' ')
  }

  describeContractOrEoa(
    contractOrEoa: EntryParameters,
    describeRoles = true,
  ): string {
    return [
      contractOrEoa.description,
      this.describeGnosisSafeMembership(contractOrEoa),
      this.permissionRegistry.describePermissions(contractOrEoa, describeRoles),
    ]
      .filter(notUndefined)
      .join('\n')
  }

  replaceAddressesWithNames(s: string): string {
    const ethereumAddressRegex = /\b(?:[a-zA-Z0-9]+:)?0x[a-fA-F0-9]{40}\b/g
    const addressStrings = s.match(ethereumAddressRegex) ?? []
    const addresses = addressStrings.map((a) => ChainSpecificAddress(a))

    for (const address of addresses) {
      const contract = this.getContractByAddress(address)
      if (contract !== undefined && contract.name !== undefined) {
        s = s.replace(address, contract.name)
      } else {
        s = s.replace(address, ChainSpecificAddress.address(address))
      }
    }
    return s
  }

  getPermissionPriority(entry: EntryParameters): number {
    if (entry.receivedPermissions === undefined) {
      return 0
    }

    const permissions = entry.receivedPermissions.map((p) => p.from)
    const priority = permissions.reduce((acc, permission) => {
      return acc + (this.getEntryByAddress(permission)?.category?.priority ?? 0)
    }, 0)

    return priority
  }

  getEoaActors() {
    const permissionedEoas = this.permissionRegistry
      .getPermissionedEoas()
      .map((address) => this.getEOAByAddress(address))
      .filter(notUndefined)
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })

    if (permissionedEoas.length === 0) {
      return {
        raw: [],
        linkable: [],
        grouped: [],
      }
    }

    const eoaPermissions = permissionedEoas.map((eoa) => {
      const description = this.describeContractOrEoa(eoa, false)
      const name = eoa.name ?? this.getEOAName(eoa.address)
      return {
        id: name,
        name: name,
        accounts: this.formatPermissionedAccounts([eoa.address]),
        chain: ChainSpecificAddress.longChain(eoa.address),
        description,
      }
    })

    const groupedByDescription = groupBy(
      eoaPermissions,
      (eoa) => eoa.description,
    )

    const createGroupId = (eoas: ProjectPermission[]) =>
      concatName(eoas.map((eoa) => eoa.name)).replaceAll(' ', '-')

    const linkableEoas: ProjectPermission[] = eoaPermissions.map((eoa) => {
      const group = groupedByDescription[eoa.description]

      if (!group) {
        return eoa
      }

      return {
        ...eoa,
        id: createGroupId(group),
      }
    })

    const groupedActors: ProjectPermission[] = []

    for (const [description, eoas] of Object.entries(groupedByDescription)) {
      const byChain = groupBy(eoas, (eoa) => eoa.chain)

      for (const [chain, chainEoas] of Object.entries(byChain)) {
        groupedActors.push({
          id: createGroupId(chainEoas),
          name: concatName(chainEoas.map((eoa) => eoa.name)),
          accounts: chainEoas.flatMap((eoa) => eoa.accounts),
          chain: chain,
          description: description,
        })
      }
    }

    return {
      raw: permissionedEoas,
      linkable: linkableEoas,
      grouped: groupedActors,
    }
  }

  getDiscoveredPermissions(
    chainsToIgnore: string[] = [],
  ): Record<string, ProjectPermissions> {
    const permissionedContracts = this.permissionRegistry
      .getPermissionedContracts()
      .map((address) => this.getContractByAddress(address))
      .filter(notUndefined)
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })
    const permissionedEoas = this.getEoaActors()

    const contractActors: ProjectPermission[] = []
    for (const contract of permissionedContracts) {
      const descriptions = this.describeContractOrEoa(contract, false)
      if (isMultisigLike(contract)) {
        contractActors.push(
          this.getMultisigPermission(
            contract.address.toString(),
            descriptions,
            [],
          ),
        )
      } else {
        contractActors.push(this.contractAsPermissioned(contract, descriptions))
      }
    }

    const allActors = [...contractActors, ...permissionedEoas.grouped]

    // NOTE(radomski): Checking for assumptions made about discovery driven actors
    assert(allUnique(allActors.map((actor) => actor.accounts[0].address)))
    assert(
      [...contractActors, ...permissionedEoas.linkable].every(
        (actor) => actor.accounts.length === 1,
      ),
    )
    // assert(allUnique(allActors.map((actor) => actor.accounts[0].name))) // TODO(radomski): Between chains

    const roles = this.describeRolePermissions([
      ...permissionedContracts,
      ...permissionedEoas.raw,
    ])

    allActors.forEach((permission) => {
      permission.description = this.replaceAddressesWithNames(
        permission.description,
      )
      if (permission.participants !== undefined) {
        permission.participants = this.linkupActorsIntoAccounts(
          permission.participants,
          [...contractActors, ...permissionedEoas.linkable],
        )
      }
    })

    roles.forEach((permission) => {
      permission.description = this.replaceAddressesWithNames(
        permission.description,
      )
      permission.accounts = this.linkupActorsIntoAccounts(permission.accounts, [
        ...contractActors,
        ...permissionedEoas.linkable,
      ])
    })

    const rolesGrouped = groupBy(
      roles.map((p) => ({ ...p, discoveryDrivenData: true })),
      (p) => p.chain,
    )
    const actorsGrouped = groupBy(
      allActors.map((p) => ({
        ...p,
        discoveryDrivenData: true,
      })),
      (p) => p.chain,
    )

    const allChains = new Set([
      ...Object.keys(rolesGrouped),
      ...Object.keys(actorsGrouped),
    ])

    const result = Object.fromEntries(
      Array.from(allChains).map((chain) => [
        chain,
        {
          roles: rolesGrouped[chain] || [],
          actors: actorsGrouped[chain] || [],
        },
      ]),
    )
    for (const chainToRemove of chainsToIgnore) {
      delete result[chainToRemove]
    }
    return result
  }

  linkupActorsIntoAccounts(
    accountsToLink: ProjectPermissionedAccount[],
    actors: ProjectPermission[],
  ): ProjectPermissionedAccount[] {
    const result: ProjectPermissionedAccount[] = []
    const actorLUT: Record<string, ProjectPermission> = {}
    for (const actor of actors) {
      assert(actor.accounts.length === 1, 'Actor must have exactly one account')
      actorLUT[actor.accounts[0].address] = actor
    }

    for (const account of accountsToLink) {
      const entry = structuredClone(account)

      const discoveryName = this.getEntryByAddress(account.address)?.name
      if (discoveryName !== undefined) {
        entry.name = discoveryName
      }

      const actor = actorLUT[account.address]

      if (actor !== undefined) {
        entry.name = actor.name
        entry.url = `#${actor.id}`
      }

      result.push(entry)
    }
    return result
  }

  linkupUpgradableBy(
    upgradableBy: ProjectUpgradeableActor[],
    eoaActors: ProjectPermission[],
  ): ProjectUpgradeableActor[] {
    return upgradableBy.map((upgradableBy) => {
      const eoaActor = eoaActors.find((e) => e.name === upgradableBy.name)
      if (eoaActor) {
        return {
          id: eoaActor.id,
          ...upgradableBy,
        }
      }
      return upgradableBy
    })
  }

  getDiscoveredContracts(
    chainsToIgnore: string[] = [],
  ): Record<string, ProjectContract[]> {
    const eoaActors = this.getEoaActors()

    const contracts = this.reachableEntries
      .filter((entry) => entry.type === 'Contract')
      .filter((contract) => contract.category?.priority !== -1)
      .sort((a, b) => {
        return (b.category?.priority ?? 0) - (a.category?.priority ?? 0)
      })

    const all = contracts
      .filter((contract) => contract.receivedPermissions === undefined)
      .filter((contract) => !isMultisigLike(contract))
      .map((contract) => {
        const upgradableBy = this.permissionRegistry.getUpgradableBy(contract)
        const linkedUpgradableBy = this.linkupUpgradableBy(
          upgradableBy,
          eoaActors.linkable,
        )

        return this.getContractDetails(contract.address.toString(), {
          description: this.describeContractOrEoa(contract, true),
          ...(linkedUpgradableBy.length > 0
            ? { upgradableBy: linkedUpgradableBy }
            : {}),
          discoveryDrivenData: true,
        })
      })

    all.forEach((contract) => {
      if (contract.description !== undefined) {
        contract.description = this.replaceAddressesWithNames(
          contract.description,
        )
      }
    })

    const result = groupBy(all, (contract) => contract.chain)
    for (const chainToRemove of chainsToIgnore) {
      delete result[chainToRemove]
    }
    return result
  }
}

function getUpgradeability(
  contract: EntryParameters,
): ProjectContractUpgradeability | undefined {
  if (!contract.proxyType) {
    return undefined
  }
  const upgradeability: ProjectContractUpgradeability = {
    proxyType: contract.proxyType,
    admins: get$Admins(contract.values),
    implementations: get$Implementations(contract.values),
  }
  if (contract.values?.$immutable !== undefined) {
    upgradeability.immutable = !!contract.values.$immutable
  }
  return upgradeability
}

function getPastUpgrades(
  contract: EntryParameters,
): ProjectContract['pastUpgrades'] | undefined {
  const pastUpgrades = pastUpgradesSchema.safeValidate(
    contract.values?.$pastUpgrades,
  )
  if (!pastUpgrades.success) return

  return pastUpgrades.data.map(([date, txHash, implementations]) => {
    return {
      timestamp: UnixTime.fromDate(new Date(date)),
      transactionHash: txHash,
      implementations: implementations.map((y) => ChainSpecificAddress(y)),
    }
  })
}

function isNonNullable<T>(
  value: T | undefined | null,
): value is NonNullable<T> {
  return value !== null && value !== undefined
}

function isEntryVerified(entry: EntryParameters): boolean {
  if ('unverified' in entry) {
    return entry.unverified !== true
  }

  return true
}

function removeReferences(discovery: DiscoveryOutput) {
  discovery.entries = discovery.entries.filter((e) => e.type !== 'Reference')
}

function allUnique(arr: string[]): boolean {
  return new Set(arr).size === arr.length
}

function concatName(names: string[]): string {
  if (names.length === 1) {
    return names[0]
  }

  if (names.length === 2) {
    return names.join(' and ')
  }

  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]
}
