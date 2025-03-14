import type {
  ContractValue,
  DiscoveryOutput,
  EntryParameters,
  ResolvedPermissionPath,
} from '@l2beat/discovery'
import {
  ConfigReader,
  RolePermissionEntries,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import {
  assert,
  EthereumAddress,
  type TokenBridgedUsing,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { isString, uniq } from 'lodash'
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
import type { PermissionRegistry } from './PermissionRegistry'
import { PermissionsFromDiscovery } from './PermissionsFromDiscovery'
import { PermissionsFromModel } from './PermissionsFromModel'
import { RoleDescriptions } from './descriptions'
import { get$Admins, get$Implementations, toAddressArray } from './extractors'
import {
  formatPermissionCondition,
  formatPermissionDelay,
  isMultisigLike,
  trimTrailingDots,
} from './utils'

const paths = getDiscoveryPaths()

export class ProjectDiscovery {
  private readonly discoveries: DiscoveryOutput[]
  private eoaIDMap: Record<string, string> = {}
  private permissionRegistry: PermissionRegistry

  constructor(
    public readonly projectName: string,
    public readonly chain: string = 'ethereum',
    public readonly configReader = new ConfigReader(paths.discovery),
  ) {
    const discovery = configReader.readDiscovery(projectName, chain)
    this.discoveries = [
      discovery,
      ...(discovery.sharedModules ?? []).map((module) =>
        configReader.readDiscovery(module, chain),
      ),
    ]
    this.permissionRegistry =
      configReader.getDisplayMode(projectName) === 'fromModel'
        ? new PermissionsFromModel(this)
        : new PermissionsFromDiscovery(this)
  }

  getEOAName(address: EthereumAddress): string {
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
      chain: this.chain,
      references: contract.references?.map((x) => ({
        title: x.text,
        url: x.href,
      })),
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
    upgradableBy?: ProjectUpgradeableActor[]
    isUpcoming?: boolean
    includeInTotal?: boolean
    source?: ProjectEscrow['source']
    bridgedUsing?: TokenBridgedUsing
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

    const contract = this.getContractDetails(address.toString(), options)

    return {
      address,
      sinceTimestamp: UnixTime(timestamp),
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
    useBulletPoints: boolean = false,
  ): ProjectPermission {
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
      ...(contract.references ?? []).map((x) => ({
        title: x.text,
        url: x.href,
      })),
    ]

    return {
      name: contract.name ?? contract.address,
      description: descriptionWithContractNames,
      accounts: this.formatPermissionedAccounts([contract.address]),
      chain: this.chain,
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
      identifier = utils.getAddress(identifier)
    } catch {
      const contracts = this.getContractByName(identifier)

      assert(
        !(contracts.length > 1),
        `Found more than one contracts of ${identifier} name (${this.projectName})`,
      )
      assert(
        contracts.length === 1,
        `Found no contract of ${identifier} name (${this.projectName}) on ${this.chain}`,
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
  ): EthereumAddress {
    const address = this.getContractValue(contractIdentifier, key)

    assert(
      isString(address) && EthereumAddress.check(address),
      `Value of ${key} must be an Ethereum address`,
    )

    return EthereumAddress(address)
  }

  formatPermissionedAccounts(
    accounts: (ContractValue | EthereumAddress)[],
  ): ProjectPermissionedAccount[] {
    const result: ProjectPermissionedAccount[] = []

    for (const account of accounts) {
      assert(
        isString(account) && EthereumAddress.check(account),
        `Values must be Ethereum addresses`,
      )
      const address = EthereumAddress(account)
      const isEOA = this.isEOA(address)
      const type = isEOA ? 'EOA' : 'Contract'
      const entry = this.getEntryByAddress(address)
      assert(isNonNullable(entry), `Could not find ${address} in discovery`)
      const isVerified = isEntryVerified(entry)

      const name = `${address.slice(0, 6)}…${address.slice(38, 42)}`
      const explorerUrl = EXPLORER_URLS[this.chain]
      assert(
        isNonNullable(explorerUrl),
        `Failed to find explorer url for chain [${this.chain}]`,
      )
      const url = `${explorerUrl}/address/${address}`

      result.push({ address: address, type, isVerified, name, url })
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
    return {
      name,
      accounts,
      description,
      chain: this.chain,
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
      isString(address) && EthereumAddress.check(address),
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
      chain: this.chain,
      ...descriptionOrOptions,
    }
  }

  contractAsPermissioned(
    contract: EntryParameters,
    description: string,
  ): ProjectPermission {
    return {
      name: contract.name ?? contract.address,
      accounts: this.formatPermissionedAccounts([contract.address]),
      chain: this.chain,
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
      name: eoa.name ?? eoa.address,
      accounts: this.formatPermissionedAccounts([eoa.address]),
      chain: this.chain,
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
    const contracts = this.getContracts()
    const addressesWithinUpgradeability = contracts.flatMap((contract) =>
      get$Implementations(contract.values),
    )

    return addressesWithinUpgradeability.filter((addr) => !this.isEOA(addr))
  }

  getContractByAddress(
    address: string | EthereumAddress,
  ): EntryParameters | undefined {
    const contracts = this.getContracts()
    return contracts.find(
      (contract) => contract.address === EthereumAddress(address.toString()),
    )
  }

  getEOAByAddress(
    address: string | EthereumAddress,
  ): EntryParameters | undefined {
    const eoas = this.discoveries
      .flatMap((discovery) => discovery.entries)
      .filter((e) => e.type === 'EOA')
    return eoas.find(
      (contract) => contract.address === EthereumAddress(address.toString()),
    )
  }

  getEntryByAddress(
    address: string | EthereumAddress,
  ): EntryParameters | undefined {
    const entries = this.discoveries.flatMap((discovery) => discovery.entries)
    return entries.find(
      (entry) => entry.address === EthereumAddress(address.toString()),
    )
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

  getContracts(): EntryParameters[] {
    return this.discoveries
      .flatMap((discovery) => discovery.entries)
      .filter((e) => e.type === 'Contract')
  }

  getEoas(): EntryParameters[] {
    return this.discoveries
      .flatMap((discovery) => discovery.entries)
      .filter((e) => e.type === 'EOA')
  }

  getContractsAndEoas(): EntryParameters[] {
    return [...this.getContracts(), ...this.getEoas()]
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

  describeGnosisSafeMembership(contractOrEoa: EntryParameters): string[] {
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
      ? []
      : ['Member of ' + safesWithThisMember.join(', ') + '.']
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

      result.push({
        ...RoleDescriptions[role],
        description: finalDescription.join('\n'),
        accounts: this.formatPermissionedAccounts(addresses),
        chain: this.chain,
      })
    }
    return result
  }

  formatViaPath(
    path: ResolvedPermissionPath,
    skipName: boolean = false,
  ): string {
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
    includeDirectPermissions: boolean = true,
  ): string[] {
    return [
      contractOrEoa.description,
      ...this.describeGnosisSafeMembership(contractOrEoa),
      ...this.permissionRegistry.describePermissions(
        contractOrEoa,
        includeDirectPermissions,
      ),
    ].filter(notUndefined)
  }

  replaceAddressesWithNames(s: string): string {
    const ethereumAddressRegex = /\b0x[a-fA-F0-9]{40}\b/g
    const addresses = s.match(ethereumAddressRegex) ?? []

    for (const address of addresses) {
      const contract = this.getContractByAddress(address)
      if (contract !== undefined && contract.name !== undefined) {
        s = s.replace(address, contract.name)
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

  getDiscoveredPermissions(): ProjectPermissions {
    const permissionedContracts = this.permissionRegistry
      .getPermissionedContracts()
      .map((address) => this.getContractByAddress(address))
      .filter(notUndefined)
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })
    const permissionedEoas = this.permissionRegistry
      .getPermissionedEoas()
      .map((address) => this.getEOAByAddress(address))
      .filter(notUndefined)
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })

    const allActors: ProjectPermission[] = []
    for (const contract of permissionedContracts) {
      const descriptions = this.describeContractOrEoa(contract, true)
      if (isMultisigLike(contract)) {
        allActors.push(
          this.getMultisigPermission(
            contract.address.toString(),
            descriptions,
            [],
            true,
          ),
        )
      } else {
        allActors.push(
          this.contractAsPermissioned(
            contract,
            formatAsBulletPoints(descriptions),
          ),
        )
      }
    }

    for (const eoa of permissionedEoas) {
      const description = formatAsBulletPoints(
        this.describeContractOrEoa(eoa, false),
      )
      allActors.push({
        name: eoa.name ?? this.getEOAName(eoa.address),
        accounts: this.formatPermissionedAccounts([eoa.address]),
        chain: this.chain,
        description,
      })
    }

    // NOTE(radomski): Checking for assumptions made about discovery driven actors
    assert(allActors.every((actor) => actor.accounts.length === 1))
    assert(allUnique(allActors.map((actor) => actor.accounts[0].address)))
    assert(allUnique(allActors.map((actor) => actor.accounts[0].name)))

    const roles = this.describeRolePermissions([
      ...permissionedContracts,
      ...permissionedEoas,
    ])

    // NOTE(radomski): There are two groups of "permissions" we show. Roles and
    // actors.
    //
    // Roles are grouping of actors that have the ability to do _something_.
    // Actors are entities which have some power in the system.
    //
    // To minimize the amount of redundant information we choose to show an
    // actor only if:
    //
    // - it's a contract
    // - it's an EOA with permissions to interact with parts of the system
    // - it's an EOA that's shared between projects[1]
    //
    // We can remove EOAs that have only role permissions since their
    // involvement in the system has already been taken into account when
    // listing accounts with a given role.
    //
    // [1] that's currently not possible to achieve. With the config refactor
    // moving forward when we reach a point where the config will be able to
    // introspect itself (reach into the configs of other projects) this point
    // will be true. As for now we don't know if such a occurrence has taken
    // place.
    const actors = allActors.filter((actor) => {
      const account = actor.accounts[0]
      const isEOA = account.type === 'EOA'
      if (!isEOA) {
        return true
      }

      const eoa = permissionedEoas.find(
        (eoa) => eoa.address === account.address,
      )
      assert(eoa?.receivedPermissions !== undefined)
      const hasOnlyRole = eoa.receivedPermissions.every((p) =>
        RolePermissionEntries.map((x) => x.toString()).includes(p.permission),
      )

      return !hasOnlyRole
    })

    actors.forEach((permission) => {
      permission.description = this.replaceAddressesWithNames(
        permission.description,
      )
      if (permission.participants !== undefined) {
        permission.participants = this.linkupActorsIntoAccounts(
          permission.participants,
          actors,
        )
      }
    })

    roles.forEach((permission) => {
      permission.description = this.replaceAddressesWithNames(
        permission.description,
      )
      permission.accounts = this.linkupActorsIntoAccounts(
        permission.accounts,
        actors,
      )
    })

    return {
      roles: roles.map((p) => ({ ...p, discoveryDrivenData: true })),
      actors: actors.map((p) => ({ ...p, discoveryDrivenData: true })),
    }
  }

  linkupActorsIntoAccounts(
    accountsToLink: ProjectPermissionedAccount[],
    actors: ProjectPermission[],
  ): ProjectPermissionedAccount[] {
    const result: ProjectPermissionedAccount[] = []
    const actorNameLUT: Record<string, string> = {}
    for (const actor of actors) {
      assert(actor.accounts.length === 1)
      actorNameLUT[actor.accounts[0].address] = actor.name
    }

    for (const account of accountsToLink) {
      const entry = structuredClone(account)

      const discoveryName = this.getEntryByAddress(account.address)?.name
      if (discoveryName !== undefined) {
        entry.name = discoveryName
      }

      const actorName = actorNameLUT[account.address]
      if (actorName !== undefined) {
        entry.name = actorName
        entry.url = `#${actorName}`
      }

      result.push(entry)
    }
    return result
  }

  getDiscoveredContracts(): ProjectContract[] {
    const contracts = this.discoveries
      .flatMap((discovery) =>
        discovery.entries.filter((e) => e.type === 'Contract'),
      )
      .filter((contract) => contract.category?.priority !== -1)
      .sort((a, b) => {
        return (b.category?.priority ?? 0) - (a.category?.priority ?? 0)
      })

    const gnosisModules = contracts.flatMap((contract) =>
      toAddressArray(contract.values?.GnosisSafe_modules),
    )
    const result = contracts
      .filter((contract) => !gnosisModules.includes(contract.address))
      .filter((contract) => contract.receivedPermissions === undefined)
      .filter((contract) => !isMultisigLike(contract))
      .map((contract) => {
        const upgradableBy = this.permissionRegistry.getUpgradableBy(contract)

        return this.getContractDetails(contract.address.toString(), {
          description: formatAsBulletPoints(
            this.describeContractOrEoa(contract, true),
          ),
          ...(upgradableBy.length > 0 ? { upgradableBy } : {}),
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

function isNonNullable<T>(
  value: T | undefined | null,
): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function formatAsBulletPoints(description: string[]): string {
  return description.length > 1
    ? description.map((s) => `* ${s}\n`).join('')
    : description.join(' ')
}

function isEntryVerified(entry: EntryParameters): boolean {
  if ('unverified' in entry) {
    return entry.unverified !== true
  }

  return true
}

function allUnique(arr: string[]): boolean {
  return new Set(arr).size === arr.length
}
