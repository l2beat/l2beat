import type {
  ContractValue,
  DiscoveryOutput,
  EntryParameters,
  ReceivedPermission,
  ResolvedImpactPrincipal,
  ResolvedImpactScenario,
  ResolvedImpactSource,
  ResolvedImpactStep,
  ResolvedImpactTrace,
  ResolvedPermissionGroup,
  ResolvedPermissionPath,
} from '@l2beat/discovery'
import {
  ConfigReader,
  getDiscoveryPaths,
  getReachableEntries,
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
import { EXPLORER_URLS } from '../common/explorerUrls'
import type {
  ProjectContract,
  ProjectContractUpgradeability,
  ProjectEscrow,
  ProjectPermission,
  ProjectPermissionedAccount,
  ProjectPermissionImpactScenario,
  ProjectPermissionImpactTrace,
  ProjectPermissionOrigin,
  ProjectPermissions,
  ProjectUpgradeableActor,
  ReferenceLink,
  SharedEscrow,
} from '../types'
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

interface ProjectDiscoveryOptions {
  reachableEntries?: {
    use: boolean
    maxDepth?: number
  }
}

export class ProjectDiscovery {
  private readonly discoveries: DiscoveryOutput[]
  private readonly reachableEntries: EntryParameters[]
  private eoaIDMap: Record<string, string> = {}
  private permissionRegistry: PermissionRegistry

  constructor(
    public readonly projectName: string,
    public readonly configReader = new ConfigReader(paths.discovery),
    public readonly options?: ProjectDiscoveryOptions,
  ) {
    // TODO: Legacy behavior - we blindly create new ProjectDiscovery instances in tests
    try {
      this.discoveries = structuredClone(
        configReader.readDiscoveryWithReferences(projectName),
      )
    } catch {
      this.discoveries = []
    }

    applyExternalPermissions(this.discoveries)

    // always the base discovery
    const entrypoints = [...(this.discoveries.at(0)?.entries ?? [])].map(
      (e) => e.address,
    )

    // Removing Reference entries because otherwise we get duplicates
    // and incomplete data.
    // TODO: refactor this whole logic around depenent projects and
    // references to entrypoints to make it cleaner
    this.discoveries.forEach((d) => removeReferences(d))

    // TODO: Uncomment me once cross-chain permissions are implemented
    this.reachableEntries = this.options?.reachableEntries?.use
      ? getReachableEntries(
          this.discoveries.flatMap((discovery) => discovery.entries),
          entrypoints,
          this.options.reachableEntries.maxDepth,
        )
      : this.discoveries.flatMap((discovery) => discovery.entries)

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

    // Tree-quorum multisigs (e.g. ManyChainMultiSig) wire $threshold/$members
    // through as a lower bound only — the real access-control rule is encoded
    // in the per-group tree. The flat "M/N threshold" prefix is misleading
    // here, so skip it and let the entry's own description carry the semantics.
    if (
      contract.values?.minSigs !== undefined &&
      contract.values?.memberCount !== undefined
    ) {
      return fullModulesDescription === '' ? [] : [fullModulesDescription]
    }

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

  withPermissionedAccountDisplayNames(
    accounts: ProjectPermissionedAccount[],
    displayNames: string[],
  ): ProjectPermissionedAccount[] {
    assert(
      accounts.length === displayNames.length,
      `Every permissioned account must have a display name. Found ${accounts.length} accounts and ${displayNames.length} display names.`,
    )

    return accounts.map((account, index) => ({
      ...account,
      displayName: displayNames[index],
    }))
  }

  getPermissionDetails(
    name: string,
    accounts: ProjectPermissionedAccount[],
    description: string,
    opts?: {
      references?: ReferenceLink[]
      accountDisplayNames?: string[]
    },
  ): ProjectPermission {
    const accountsWithDisplayNames = opts?.accountDisplayNames
      ? this.withPermissionedAccountDisplayNames(
          accounts,
          opts.accountDisplayNames,
        )
      : accounts

    let chain = 'ethereum'
    if (accountsWithDisplayNames.length > 0) {
      const chains = accountsWithDisplayNames.map((a) =>
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
      accounts: accountsWithDisplayNames,
      description,
      chain,
      ...(opts?.references ? { references: opts.references } : {}),
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
    excludePermission?: (permission: ReceivedPermission) => boolean,
  ): string {
    return [
      contractOrEoa.description,
      this.describeGnosisSafeMembership(contractOrEoa),
      this.permissionRegistry.describePermissions(
        contractOrEoa,
        describeRoles,
        excludePermission,
      ),
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

  getEoaActors(
    excludedAddresses: ReadonlySet<string> = new Set(),
    scenariosByPrincipal: ReadonlyMap<
      string,
      ResolvedImpactScenario[]
    > = new Map(),
  ) {
    const permissionedEoas = this.permissionRegistry
      .getPermissionedEoas()
      .map((address) => this.getEOAByAddress(address))
      .filter(notUndefined)
      .filter((entry) => !excludedAddresses.has(entry.address.toLowerCase()))
      .filter((entry) => this.isProjectScopedPermissionActor(entry.address))
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
      const principalKeys = [addressImpactPrincipalKey(eoa.address)]
      const description = this.describeContractOrEoa(
        eoa,
        false,
        this.getImpactPermissionFilter(principalKeys, scenariosByPrincipal),
      )
      const permissionOrigins = this.getPermissionOriginsForTargets(
        (eoa.receivedPermissions ?? []).map((permission) => permission.from),
      )
      const groupingKey = JSON.stringify([
        this.describeContractOrEoa(eoa, false),
        description,
        permissionOrigins,
      ])
      const name = eoa.name ?? this.getEOAName(eoa.address)
      return {
        id: name,
        name: name,
        accounts: this.withPermissionedAccountDisplayNames(
          this.formatPermissionedAccounts([eoa.address]),
          [name],
        ),
        chain: ChainSpecificAddress.longChain(eoa.address),
        description,
        permissionOrigins,
        groupingKey,
      }
    })

    const groupedByDescription = groupBy(
      eoaPermissions,
      (eoa) => eoa.groupingKey,
    )

    const createGroupId = (eoas: ProjectPermission[]) =>
      concatName(eoas.map((eoa) => eoa.name)).replaceAll(' ', '-')

    const linkableEoas: ProjectPermission[] = eoaPermissions.map(
      ({ groupingKey, ...eoa }) => {
        const group = groupedByDescription[groupingKey]

        if (!group) {
          return eoa
        }

        return {
          ...eoa,
          id: createGroupId(group),
        }
      },
    )

    const groupedActors: ProjectPermission[] = []

    for (const eoas of Object.values(groupedByDescription)) {
      const byChain = groupBy(eoas, (eoa) => eoa.chain)

      for (const [chain, chainEoas] of Object.entries(byChain)) {
        groupedActors.push({
          id: createGroupId(chainEoas),
          name: concatName(chainEoas.map((eoa) => eoa.name)),
          accounts: chainEoas.flatMap((eoa) => eoa.accounts),
          chain: chain,
          description: chainEoas[0]?.description ?? '',
          permissionOrigins: uniqueBy(
            chainEoas.flatMap((eoa) => eoa.permissionOrigins),
            permissionOriginKey,
          ).sort(comparePermissionOrigins),
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
    const impactScenarios = this.getImpactScenariosByPrincipal()
    const permissionGroups = this.getProjectPermissionGroups()
    const groupedMembers = new Set(
      permissionGroups.flatMap((group) =>
        group.members.map((member) => member.toLowerCase()),
      ),
    )
    const permissionedContracts = this.permissionRegistry
      .getPermissionedContracts()
      .map((address) => this.getContractByAddress(address))
      .filter(notUndefined)
      .filter((entry) => !groupedMembers.has(entry.address.toLowerCase()))
      .filter((entry) => this.isProjectScopedPermissionActor(entry.address))
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })
    const permissionedEoas = this.getEoaActors(groupedMembers, impactScenarios)

    const contractActors: ProjectPermission[] = []
    for (const contract of permissionedContracts) {
      const principalKeys = [addressImpactPrincipalKey(contract.address)]
      const description = this.describeContractOrEoa(
        contract,
        false,
        this.getImpactPermissionFilter(principalKeys, impactScenarios),
      )
      let actor: ProjectPermission
      if (isMultisigLike(contract)) {
        actor = this.getMultisigPermission(
          contract.address.toString(),
          description,
          [],
        )
      } else {
        actor = this.contractAsPermissioned(contract, description)
      }
      actor = this.withPermissionOrigins(
        actor,
        this.getPermissionOriginsForTargets(
          (contract.receivedPermissions ?? []).map(
            (permission) => permission.from,
          ),
        ),
      )
      contractActors.push(
        this.withImpactScenarios(actor, principalKeys, impactScenarios),
      )
    }

    const groupActors = permissionGroups.map((group) => {
      const principalKey = groupImpactPrincipalKey(group)
      return this.withImpactScenarios(
        this.permissionGroupAsActor(group, !impactScenarios.has(principalKey)),
        [principalKey],
        impactScenarios,
      )
    })
    const eoaActors = permissionedEoas.grouped.map((actor) =>
      this.withImpactScenarios(
        actor,
        actor.accounts.map((account) =>
          addressImpactPrincipalKey(account.address),
        ),
        impactScenarios,
      ),
    )
    const representedPrincipals = new Set([
      ...contractActors.flatMap((actor) =>
        actor.accounts.map((account) =>
          addressImpactPrincipalKey(account.address),
        ),
      ),
      ...permissionGroups.map((group) => groupImpactPrincipalKey(group)),
      ...eoaActors.flatMap((actor) =>
        actor.accounts.map((account) =>
          addressImpactPrincipalKey(account.address),
        ),
      ),
    ])
    const blackBoxActors = this.getBlackBoxImpactActors(
      representedPrincipals,
      impactScenarios,
    )
    const allActors = [
      ...contractActors,
      ...groupActors,
      ...blackBoxActors,
      ...eoaActors,
    ]

    // NOTE(radomski): Checking for assumptions made about discovery driven actors
    assert(
      allUnique(
        [...contractActors, ...permissionedEoas.grouped].map(
          (actor) => actor.accounts[0].address,
        ),
      ),
    )
    assert(
      [...contractActors, ...permissionedEoas.linkable].every(
        (actor) => actor.accounts.length === 1,
      ),
    )
    // assert(allUnique(allActors.map((actor) => actor.accounts[0].name))) // TODO(radomski): Between chains

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

    const actorsGrouped = groupBy(
      allActors.map((p) => ({
        ...p,
        discoveryDrivenData: true,
      })),
      (p) => p.chain,
    )

    const allChains = new Set(Object.keys(actorsGrouped))

    const result = Object.fromEntries(
      Array.from(allChains).map((chain) => [
        chain,
        {
          roles: [],
          actors: actorsGrouped[chain] || [],
        },
      ]),
    )
    for (const chainToRemove of chainsToIgnore) {
      delete result[chainToRemove]
    }
    return result
  }

  private isProjectScopedPermissionActor(
    address: ChainSpecificAddress,
  ): boolean {
    const rootDiscovery = this.discoveries.at(0)
    const externalPermissions = rootDiscovery?.externalPermissions
    if (rootDiscovery === undefined) {
      return true
    }

    const isInRootDiscovery = rootDiscovery.entries.some(
      (entry) => entry.type !== 'Reference' && entry.address === address,
    )
    if (isInRootDiscovery) {
      return true
    }

    const isImpactPrincipal = rootDiscovery.impactScenarios?.some((scenario) =>
      scenario.principals.some(
        (principal) =>
          principal.type === 'address' &&
          principal.address.toLowerCase() === address.toLowerCase(),
      ),
    )
    if (isImpactPrincipal) {
      return true
    }

    if (externalPermissions === undefined) {
      return rootDiscovery.impactScenarios === undefined
    }

    return Object.entries(externalPermissions).some(
      ([externalAddress, permissions]) =>
        externalAddress.toLowerCase() === address.toLowerCase() &&
        (permissions.receivedPermissions?.length ?? 0) > 0,
    )
  }

  private getProjectPermissionGroups(): ResolvedPermissionGroup[] {
    const rootDiscovery = this.discoveries.at(0)
    return [
      ...(rootDiscovery?.permissionGroups ?? []),
      ...(rootDiscovery?.externalPermissionGroups ?? []),
    ]
  }

  private permissionGroupAsActor(
    group: ResolvedPermissionGroup,
    includeCapability: boolean,
  ): ProjectPermission {
    const targetName = this.getName(group.permission.from)
    const groupName = `${targetName} ${group.name}`
    const thresholdDescription =
      group.threshold === 1
        ? 'Any one member can exercise this capability.'
        : `${group.threshold} members must cooperate to exercise this capability.`
    const administration =
      group.admin === undefined
        ? 'This permission does not let members change the group membership.'
        : `${this.getName(group.admin)} can replace the members; members cannot change the group membership through this permission.`
    const permissionDescription =
      includeCapability && group.permission.description
        ? `\n* Can interact with ${targetName}\n  * ${trimTrailingDots(group.permission.description)}`
        : ''
    const accounts = this.withPermissionedAccountDisplayNames(
      this.formatPermissionedAccounts(group.members),
      group.members.map((_, index) => `${group.memberName} ${index + 1}`),
    )

    return {
      id: `${targetName}-${group.id}`,
      name: groupName,
      displayName: groupName,
      accounts,
      chain: ChainSpecificAddress.longChain(group.permission.from),
      references: [],
      description: `A ${group.threshold}/${group.members.length} permissioned ${group.memberName.toLowerCase()} group. ${thresholdDescription} ${administration}${permissionDescription}`,
      permissionOrigins: this.getPermissionOriginsForTargets([
        group.permission.from,
      ]),
    }
  }

  private getImpactScenariosByPrincipal(): Map<
    string,
    ResolvedImpactScenario[]
  > {
    const result = new Map<string, ResolvedImpactScenario[]>()
    for (const scenario of this.discoveries.at(0)?.impactScenarios ?? []) {
      for (const principal of scenario.principals) {
        const key = impactPrincipalKey(principal)
        const existing = result.get(key) ?? []
        existing.push(scenario)
        result.set(key, existing)
      }
    }
    return result
  }

  private getImpactPermissionFilter(
    principalKeys: string[],
    scenariosByPrincipal: ReadonlyMap<string, ResolvedImpactScenario[]>,
  ): ((permission: ReceivedPermission) => boolean) | undefined {
    const principalSet = new Set(principalKeys)
    const capabilityKeys = new Set(
      uniqueBy(
        principalKeys.flatMap((key) => scenariosByPrincipal.get(key) ?? []),
        (scenario) => scenario.id,
      ).flatMap((scenario) =>
        scenario.sources.flatMap((source) =>
          principalSet.has(source.principal) && source.capability !== undefined
            ? [impactCapabilityKey(source.contract, source.capability)]
            : [],
        ),
      ),
    )
    if (capabilityKeys.size === 0) {
      return undefined
    }

    return (permission) =>
      permission.permission === 'interact' &&
      permission.description !== undefined &&
      capabilityKeys.has(
        impactCapabilityKey(permission.from, permission.description),
      )
  }

  private getPermissionOriginsForTargets(
    targets: ChainSpecificAddress[],
  ): ProjectPermissionOrigin[] {
    const origins = targets.flatMap((target) => {
      const owners = this.discoveries.flatMap((discovery, index) =>
        discovery.entries.some(
          (entry) => entry.address.toLowerCase() === target.toLowerCase(),
        )
          ? [{ discovery, index }]
          : [],
      )
      assert(
        owners.length > 0,
        `Cannot determine the permission origin of ${target.toString()} in ${this.projectName}`,
      )
      return owners.map(
        ({ discovery, index }): ProjectPermissionOrigin =>
          index === 0
            ? { type: 'project' }
            : {
                type: 'dependency',
                name: discovery.name,
                projectId: discovery.name,
              },
      )
    })

    return uniqueBy(origins, permissionOriginKey).sort(comparePermissionOrigins)
  }

  private getPermissionOriginsForSource(
    source: ResolvedImpactSource,
  ): ProjectPermissionOrigin[] {
    if (source.dependencyName !== undefined) {
      return [{ type: 'dependency', name: source.dependencyName }]
    }
    return this.getPermissionOriginsForTargets([source.contract])
  }

  private withPermissionOrigins(
    actor: ProjectPermission,
    origins: ProjectPermissionOrigin[],
  ): ProjectPermission {
    const permissionOrigins = uniqueBy(
      [...(actor.permissionOrigins ?? []), ...origins],
      permissionOriginKey,
    ).sort(comparePermissionOrigins)
    return permissionOrigins.length === 0
      ? actor
      : { ...actor, permissionOrigins }
  }

  private withImpactScenarios(
    actor: ProjectPermission,
    principalKeys: string[],
    scenariosByPrincipal: ReadonlyMap<string, ResolvedImpactScenario[]>,
  ): ProjectPermission {
    const scenarios = uniqueBy(
      principalKeys.flatMap((key) => scenariosByPrincipal.get(key) ?? []),
      (scenario) => scenario.id,
    )
    if (scenarios.length === 0) {
      return actor
    }
    const actorPrincipalKeys = new Set(principalKeys)
    const actorWithOrigins = this.withPermissionOrigins(
      actor,
      uniqueBy(
        scenarios.flatMap((scenario) =>
          scenario.sources
            .filter((source) => actorPrincipalKeys.has(source.principal))
            .flatMap((source) => this.getPermissionOriginsForSource(source)),
        ),
        permissionOriginKey,
      ),
    )
    return {
      ...actorWithOrigins,
      impactScenarios: this.projectImpactScenarios(
        scenarios,
        actorPrincipalKeys,
      ),
    }
  }

  private projectImpactScenarios(
    scenarios: ResolvedImpactScenario[],
    actorPrincipalKeys: ReadonlySet<string>,
  ): ProjectPermissionImpactScenario[] {
    const byCapability = groupBy(scenarios, (scenario) =>
      unique(scenario.sources.map((source) => source.capabilityId))
        .sort()
        .join('|'),
    )

    return Object.values(byCapability)
      .map((group): ProjectPermissionImpactScenario => {
        const sources = uniqueBy(
          group.flatMap((scenario) => scenario.sources),
          (source) => source.id,
        )
        const steps = uniqueBy(
          group.flatMap((scenario) => scenario.steps),
          (step) => step.ruleId,
        )
        const sourcesById = new Map(
          sources.map((source) => [source.id, source]),
        )
        const stepsById = new Map(steps.map((step) => [step.ruleId, step]))
        const traces = uniqueBy(
          group.flatMap((scenario) => scenario.paths.map((path) => path.trace)),
          impactTraceKey,
        )
        const terminalRuleIds = new Set(
          traces.flatMap((trace) =>
            trace.type === 'rule' ? [trace.ruleId] : [],
          ),
        )
        const capabilities = Object.values(
          groupBy(sources, (source) => source.capabilityId),
        ).map((capabilitySources) => {
          const source = capabilitySources[0]
          assert(source !== undefined, 'Impact capability has no sources')
          const principal = group
            .flatMap((scenario) => scenario.principals)
            .find(
              (candidate) => impactPrincipalKey(candidate) === source.principal,
            )
          assert(principal !== undefined, 'Impact source principal not found')
          return {
            actor: this.getImpactPrincipalName(principal, group),
            component: this.getImpactComponentName(
              source.contract,
              source.dependencyName,
            ),
            descriptions: unique(
              capabilitySources
                .map((candidate) => candidate.capability)
                .filter(notUndefined),
            ),
          }
        })
        const requires = unique(
          group.flatMap((scenario) =>
            scenario.principals
              .filter(
                (principal) =>
                  !actorPrincipalKeys.has(impactPrincipalKey(principal)),
              )
              .map((principal) =>
                this.getImpactPrincipalName(principal, group),
              ),
          ),
        )

        const id = group.map((scenario) => scenario.id).sort()[0]
        assert(id !== undefined, 'Impact scenario group is empty')
        const impactStepGroups = Object.values(
          groupBy(
            steps.filter(
              (step): step is typeof step & { impact: string } =>
                step.impact !== undefined,
            ),
            outcomeStepGroupKey,
          ),
        )
        const protectionStepGroups = Object.values(
          groupBy(
            steps.filter(
              (step): step is typeof step & { protection: string } =>
                step.impact === undefined &&
                step.protection !== undefined &&
                terminalRuleIds.has(step.ruleId),
            ),
            outcomeStepGroupKey,
          ),
        )

        return {
          id,
          requires: requires.length === 0 ? undefined : requires,
          capabilities,
          impacts: impactStepGroups.map((impactSteps) => {
            const first = impactSteps[0]
            assert(first !== undefined, 'Impact step group is empty')
            return {
              id: impactOutcomeId(first),
              components: unique(
                impactSteps.map((step) =>
                  this.getImpactComponentName(step.contract),
                ),
              ),
              description: first.impact,
              categories: first.categories ?? [],
              ...(first.limitation !== undefined
                ? { limitation: first.limitation }
                : {}),
              paths: uniqueBy(
                impactSteps.flatMap((step) =>
                  traces.flatMap((trace) =>
                    findImpactRuleTraces(trace, step.ruleId),
                  ),
                ),
                impactTraceKey,
              ).map((trace) =>
                this.projectImpactTrace(trace, sourcesById, stepsById),
              ),
            }
          }),
          protections: protectionStepGroups.map((protectionSteps) => {
            const first = protectionSteps[0]
            assert(first !== undefined, 'Protection step group is empty')
            return {
              id: impactOutcomeId(first),
              components: unique(
                protectionSteps.map((step) =>
                  this.getImpactComponentName(step.contract),
                ),
              ),
              description: first.protection,
              paths: uniqueBy(
                protectionSteps.flatMap((step) =>
                  traces.flatMap((trace) =>
                    findImpactRuleTraces(trace, step.ruleId),
                  ),
                ),
                impactTraceKey,
              ).map((trace) =>
                this.projectImpactTrace(trace, sourcesById, stepsById),
              ),
            }
          }),
        }
      })
      .sort((a, b) => {
        const aName = a.capabilities[0]?.component ?? ''
        const bName = b.capabilities[0]?.component ?? ''
        return aName.localeCompare(bName) || a.id.localeCompare(b.id)
      })
  }

  private projectImpactTrace(
    trace: ResolvedImpactTrace,
    sources: ReadonlyMap<string, ResolvedImpactSource>,
    steps: ReadonlyMap<string, ResolvedImpactStep>,
  ): ProjectPermissionImpactTrace {
    if (trace.type === 'source') {
      const source = sources.get(trace.sourceId)
      assert(source !== undefined, `Impact source ${trace.sourceId} not found`)
      return {
        component: this.getImpactComponentName(
          source.contract,
          source.dependencyName,
        ),
        effect: source.effect,
        description: source.description,
        ...(source.limitation !== undefined
          ? { limitation: source.limitation }
          : {}),
        inputs: [],
      }
    }

    const step = steps.get(trace.ruleId)
    assert(step !== undefined, `Impact step ${trace.ruleId} not found`)
    return {
      component: this.getImpactComponentName(step.contract),
      effect: step.output,
      description: step.description,
      ...(step.limitation !== undefined ? { limitation: step.limitation } : {}),
      inputs: trace.inputs.map((input) =>
        this.projectImpactTrace(input, sources, steps),
      ),
    }
  }

  private getImpactPrincipalName(
    principal: ResolvedImpactPrincipal,
    scenarios: ResolvedImpactScenario[],
  ): string {
    if (principal.type === 'group') {
      return `${this.getName(principal.from)} ${principal.name}`
    }
    const entryName = this.getEntryByAddress(principal.address)?.name
    if (entryName !== undefined) {
      return entryName
    }
    const dependencyName = scenarios
      .flatMap((scenario) => scenario.sources)
      .find(
        (source) =>
          source.principal === addressImpactPrincipalKey(principal.address) &&
          source.dependencyName !== undefined,
      )?.dependencyName
    return dependencyName ?? shortenAddress(principal.address)
  }

  private getImpactComponentName(
    address: ChainSpecificAddress,
    fallback?: string,
  ): string {
    return (
      this.getEntryByAddress(address)?.name ??
      fallback ??
      shortenAddress(address)
    )
  }

  private getBlackBoxImpactActors(
    representedPrincipals: ReadonlySet<string>,
    scenariosByPrincipal: ReadonlyMap<string, ResolvedImpactScenario[]>,
  ): ProjectPermission[] {
    const result: ProjectPermission[] = []
    for (const [key, scenarios] of scenariosByPrincipal) {
      const principal = scenarios[0]?.principals.find(
        (candidate) => impactPrincipalKey(candidate) === key,
      )
      if (
        representedPrincipals.has(key) ||
        principal === undefined ||
        principal.type !== 'address'
      ) {
        continue
      }
      const name = this.getImpactPrincipalName(principal, scenarios)
      const raw = ChainSpecificAddress.address(principal.address)
      const chain = ChainSpecificAddress.longChain(principal.address)
      const explorerUrl = EXPLORER_URLS[chain]
      assert(
        isNonNullable(explorerUrl),
        `Failed to find explorer url for chain [${chain}]`,
      )
      result.push(
        this.withImpactScenarios(
          {
            id: name,
            name,
            accounts: [
              {
                address: principal.address,
                type: 'Reference',
                isVerified: false,
                name: shortenAddress(principal.address),
                url: `${explorerUrl}/address/${raw}`,
              },
            ],
            chain,
            references: [],
            description:
              'This dependency has no discovery model. Its possible failures are modeled as a black box at each consuming contract boundary.',
          },
          [key],
          scenariosByPrincipal,
        ),
      )
    }
    return result.sort((a, b) => a.name.localeCompare(b.name))
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
      if (upgradableBy.unreachable === true) {
        return upgradableBy
      }
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

  hasEoaWithUpgradePermissions(): boolean {
    return this.reachableEntries.some(
      (entry) => entry.eoaWithUpgradePermissions === true,
    )
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

function applyExternalPermissions(discoveries: DiscoveryOutput[]) {
  const rootDiscovery = discoveries.at(0)
  const externalPermissions = rootDiscovery?.externalPermissions
  if (externalPermissions === undefined) {
    return
  }

  const externalEntries = discoveries
    .slice(1)
    .flatMap((discovery) => discovery.entries)
  for (const [address, permissions] of Object.entries(externalPermissions)) {
    const target = externalEntries.find(
      (entry) =>
        entry.type !== 'Reference' &&
        entry.address.toLowerCase() === address.toLowerCase(),
    )
    if (target === undefined) {
      continue
    }

    target.receivedPermissions = permissions.receivedPermissions
    target.directlyReceivedPermissions = permissions.directlyReceivedPermissions
    target.eoaWithUpgradePermissions = permissions.eoaWithUpgradePermissions
  }
}

function allUnique(arr: string[]): boolean {
  return new Set(arr).size === arr.length
}

function impactPrincipalKey(principal: ResolvedImpactPrincipal): string {
  return principal.type === 'group'
    ? principal.key
    : addressImpactPrincipalKey(principal.address)
}

function addressImpactPrincipalKey(address: ChainSpecificAddress): string {
  return `address:${address.toLowerCase()}`
}

function impactCapabilityKey(
  contract: ChainSpecificAddress,
  capability: string,
): string {
  return JSON.stringify([contract.toLowerCase(), capability])
}

function permissionOriginKey(origin: ProjectPermissionOrigin): string {
  return origin.type === 'project'
    ? origin.type
    : `${origin.type}:${origin.name}`
}

function comparePermissionOrigins(
  a: ProjectPermissionOrigin,
  b: ProjectPermissionOrigin,
): number {
  if (a.type !== b.type) {
    return a.type === 'project' ? -1 : 1
  }
  if (a.type === 'dependency' && b.type === 'dependency') {
    return a.name.localeCompare(b.name)
  }
  return 0
}

function outcomeStepGroupKey(step: ResolvedImpactStep): string {
  const definitionScope = step.ruleDefinition.template
    ? ['template', step.ruleDefinition.template]
    : ['contract', step.contract.toLowerCase()]

  return JSON.stringify([
    definitionScope,
    step.ruleDefinition.id,
    step.output,
    step.description ?? null,
    step.impact ?? null,
    step.categories ?? null,
    step.limitation ?? null,
    step.protection ?? null,
  ])
}

function impactOutcomeId(step: ResolvedImpactStep): string {
  return utils.id(outcomeStepGroupKey(step))
}

function findImpactRuleTraces(
  trace: ResolvedImpactTrace,
  ruleId: string,
): ResolvedImpactTrace[] {
  if (trace.type === 'source') {
    return []
  }
  if (trace.ruleId === ruleId) {
    return [trace]
  }
  return trace.inputs.flatMap((input) => findImpactRuleTraces(input, ruleId))
}

function impactTraceKey(trace: ResolvedImpactTrace): string {
  return JSON.stringify(trace)
}

function groupImpactPrincipalKey(group: ResolvedPermissionGroup): string {
  return `group:${group.permission.from.toLowerCase()}:${group.id}`
}

function shortenAddress(address: ChainSpecificAddress): string {
  const raw = ChainSpecificAddress.address(address).toString()
  return `${raw.slice(0, 6)}…${raw.slice(-4)}`
}

function uniqueBy<T>(values: T[], key: (value: T) => string): T[] {
  const seen = new Set<string>()
  return values.filter((value) => {
    const id = key(value)
    if (seen.has(id)) {
      return false
    }
    seen.add(id)
    return true
  })
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
