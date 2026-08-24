import {
  type ConfigReader,
  type ContractConfig,
  type DiscoveryOutput,
  type EntryParameters,
  get$Implementations,
  getReachableEntries,
  getShapeFromOutputEntry,
  makeEntryColorConfig,
  makeEntryStructureConfig,
  mergeReferencedPermissions,
  type TemplateService,
} from '@l2beat/discovery'
import type { ColorContract } from '@l2beat/discovery/dist/discovery/config/ColorConfig'
import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { getContractName } from './getContractName'
import { getContractType } from './getContractType'
import { getMeta } from './getMeta'
import { parseFieldValue } from './parseFieldValue'
import type {
  ApiAbiEntry,
  ApiAddressEntry,
  ApiAddressReference,
  ApiAddressType,
  ApiProjectChain,
  ApiProjectContract,
  ApiProjectResponse,
  Field,
  FieldValue,
} from './types'

export function getProject(
  configReader: ConfigReader,
  templateService: TemplateService,
  project: string,
  maxDepth?: number,
): ApiProjectResponse {
  const discoveries = configReader.readDiscoveryWithReferences(project)
  const discovery = discoveries[0]
  const data = discoveries.map((discovery) => ({
    discovery,
    config: configReader.readConfig(discovery.name),
  }))

  // Same as ProjectDiscovery: permissions modelled across an entrypoint
  // boundary live on the consuming project and are joined back here.
  mergeReferencedPermissions(discoveries)

  const ownedEntries = resolveEntryOwnership(discoveries)

  const allEntries = data
    .flatMap((x) => x.discovery.entries)
    .filter((e) => e.type !== 'Reference')
  const entrypoints = discovery.entries.map((e) => e.address)

  const reachableAddresses = toAddressSet(
    getReachableEntries(allEntries, entrypoints),
  )
  // maxDepth only dims entries in the UI; filtering by it would drop nodes
  // from the response and the autosaved layout would forget their positions.
  const withinDepthAddresses =
    maxDepth === undefined
      ? reachableAddresses
      : toAddressSet(getReachableEntries(allEntries, entrypoints, maxDepth))

  const response: ApiProjectResponse = { entries: [] }
  const meta = getMeta([...ownedEntries.values()].flat())
  for (const { config, discovery } of data) {
    // Match ProjectDiscovery: contracts and permissions come from reachable
    // entries only, so the UI must not show what the site drops.
    const entries = (ownedEntries.get(discovery.name) ?? []).filter((e) =>
      reachableAddresses.has(e.address),
    )
    const contracts = entries
      .filter((e) => e.type === 'Contract')
      .map((entry) => {
        const contractConfig = makeEntryStructureConfig(
          config.structure,
          entry.address,
        )

        if (entry.template !== undefined) {
          const templateValues = templateService.loadContractTemplate(
            entry.template,
          )
          contractConfig.pushValues(templateValues)
        }

        const contractColorConfig = makeEntryColorConfig(
          config.color,
          entry.address,
          templateService.loadContractTemplateColor(entry.template),
        )

        const template = getTemplate(templateService, entry)

        return contractFromDiscovery(
          meta,
          entry,
          contractConfig,
          contractColorConfig,
          discovery.abis,
          template,
          withinDepthAddresses,
        )
      })
      .sort(orderAddressEntries)

    const eoas = entries
      .filter((e) => e.type === 'EOA')
      .filter(
        (x) => ChainSpecificAddress.address(x.address) !== EthereumAddress.ZERO,
      )
      .map((x) => eoaFromDiscovery(x, withinDepthAddresses))
      .sort(orderAddressEntries)

    if (contracts.length === 0 && eoas.length === 0) {
      continue
    }

    const initialAddresses = config.structure.initialAddresses
    const chainInfo = {
      project: config.name,
      initialContracts: contracts.filter((x) =>
        initialAddresses.includes(x.address),
      ),
      discoveredContracts: contracts.filter(
        (x) => !initialAddresses.includes(x.address),
      ),
      eoas,
      blockNumbers: blockNumbersOfPopulatedChains(discovery.usedBlockNumbers, [
        ...contracts,
        ...eoas,
      ]),
    } satisfies ApiProjectChain

    response.entries.push(chainInfo)
  }
  populateReferencedBy(response.entries)
  return response
}

// A contract belongs to one project, because a shared module lists it as an
// entrypoint and its dependents then reference it instead of discovering it.
// EOAs are deliberately not entrypoints, since an EOA like a multisig signer
// belongs to no project and making it one would chain unrelated discoveries
// together. So the same EOA is discovered in full by every project that reaches
// it. The UI keys every node by address, so the response may name an address
// once: the first project to claim it wins, and `discoveries` starts with the
// project itself, which puts shared EOAs in the project's scope rather than the
// shared module's.
function resolveEntryOwnership(
  discoveries: DiscoveryOutput[],
): Map<string, EntryParameters[]> {
  const owned = new Map<string, EntryParameters[]>()
  const claimed = new Set<ChainSpecificAddress>()

  for (const discovery of discoveries) {
    assert(!owned.has(discovery.name), 'Duplicate discovery')
    const entries = discovery.entries
      .filter((e) => e.type !== 'Reference')
      .filter((e) => !claimed.has(e.address))

    for (const { address } of entries) {
      claimed.add(address)
    }
    owned.set(discovery.name, entries)
  }

  return owned
}

function toAddressSet(
  entries: EntryParameters[],
): ReadonlySet<ChainSpecificAddress> {
  return new Set(entries.map((entry) => entry.address))
}

function eoaFromDiscovery(
  entry: EntryParameters,
  withinDepthAddresses: ReadonlySet<ChainSpecificAddress>,
): ApiAddressEntry {
  const roles = getRoles(entry)
  return {
    name: entry.name || undefined,
    type: roles.length > 0 ? 'EOAPermissioned' : 'EOA',
    roles: roles,
    description: entry.description,
    referencedBy: [],
    address: entry.address,
    chain: ChainSpecificAddress.longChain(entry.address),
    isReachable: withinDepthAddresses.has(entry.address),
  }
}

function blockNumbersOfPopulatedChains(
  usedBlockNumbers: Record<string, number>,
  entries: ApiAddressEntry[],
): Record<string, number> {
  const chains = new Set(entries.map((entry) => entry.chain))
  return Object.fromEntries(
    Object.entries(usedBlockNumbers).filter(([chain]) => chains.has(chain)),
  )
}

function getRoles(entry: EntryParameters): string[] {
  const roles = entry.receivedPermissions?.map((p) => p.permission)
  const notRoles = ['member', 'act', 'interact']

  return [...new Set(roles ?? [])].filter((role) => !notRoles.includes(role))
}

function getTemplate(
  templateService: TemplateService,
  contract: EntryParameters,
): ApiProjectContract['template'] {
  if (!contract.template) {
    return
  }

  const shape = getShapeFromOutputEntry(templateService, contract)

  if (!shape) {
    return {
      id: contract.template,
    }
  }

  return {
    id: contract.template,
    shape: {
      name: shape.name,
      hasCriteria: shape.criteria !== undefined,
    },
  }
}

function orderAddressEntries(a: ApiAddressEntry, b: ApiAddressEntry) {
  if (a.name && b.name) {
    return a.name.localeCompare(b.name)
  }
  if (a.name) {
    return -1
  }
  if (b.name) {
    return 1
  }
  return a.address.localeCompare(b.address)
}

function contractFromDiscovery(
  meta: Record<string, { name?: string; type: ApiAddressType }>,
  contract: EntryParameters,
  contractConfig: ContractConfig,
  contractColorConfig: ColorContract,
  abis: DiscoveryOutput['abis'],
  template: ApiProjectContract['template'],
  withinDepthAddresses: ReadonlySet<ChainSpecificAddress>,
): ApiProjectContract {
  const getFieldInfo = (name: string): Omit<Field, 'name' | 'value'> => {
    const field = contractConfig.fields[name]
    const fieldColor = contractColorConfig.fields[name]
    return {
      description: fieldColor?.description,
      handler: field?.handler,
    }
  }

  const fields: Field[] = Object.entries(contract.values ?? {})
    .map(
      ([name, value]): Field => ({
        name,
        value: parseFieldValue(value, meta),
        ...getFieldInfo(name),
      }),
    )
    .concat(
      Object.entries(contract.errors ?? {}).map(
        ([name, error]): Field => ({
          name,
          value: { type: 'error', error },
          ...getFieldInfo(name),
        }),
      ),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
  const implementations = get$Implementations(contract.values)

  return {
    name: getContractName(contract),
    type: getContractType(contract),
    roles: getRoles(contract),
    template: template,
    proxyType: contract.proxyType,
    description: contract.description,
    referencedBy: [],
    address: contract.address,
    chain: ChainSpecificAddress.longChain(contract.address),
    fields,
    abis: [contract.address, ...implementations].map((address) => ({
      address: address,
      entries: (abis[address] ?? []).map((e) => abiEntry(e)),
    })),
    implementationNames: contract.implementationNames,
    isReachable: withinDepthAddresses.has(contract.address),
  }
}

function abiEntry(entry: string): ApiAbiEntry {
  if (entry.startsWith('constructor')) {
    return { value: entry }
  }

  const iface = new utils.Interface([entry])
  return {
    value: entry,
    topic: entry.startsWith('event')
      ? iface.getEventTopic(entry.slice(6))
      : undefined,
    signature: entry.startsWith('function')
      ? iface.getSighash(entry.slice(9))
      : undefined,
  }
}

function populateReferencedBy(chains: ApiProjectChain[]) {
  const referencedBy = new Map<string, ApiAddressReference[]>()
  for (const chain of chains) {
    for (const contract of [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
    ]) {
      for (const field of contract.fields) {
        const addresses = getAddresses([field.value])
        for (const address of addresses) {
          if (address === contract.address) {
            continue
          }

          const ref: ApiAddressReference = {
            type: 'address',
            name: contract.name,
            address: contract.address,
            addressType: contract.type,
            fieldNames: [field.name],
          }

          const existingRef = referencedBy
            .get(address)
            ?.find((r) => r.address === contract.address)

          if (existingRef) {
            if (!existingRef.fieldNames.includes(field.name)) {
              existingRef.fieldNames.push(field.name)
            }
          } else {
            const refs = referencedBy.get(address) || []
            refs.push(ref)
            referencedBy.set(address, refs)
          }
        }
      }
    }
  }
  for (const chain of chains) {
    for (const entry of [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ]) {
      const refs = referencedBy.get(entry.address)
      entry.referencedBy = refs ?? []
    }
  }
}

function getAddresses(values: FieldValue[]) {
  const addresses: string[] = []
  for (const value of values) {
    if (value.type === 'address') {
      addresses.push(value.address)
    } else if (value.type === 'array') {
      addresses.push(...getAddresses(value.values))
    } else if (value.type === 'object') {
      addresses.push(...getAddresses(value.values.map(([_, value]) => value)))
    }
  }
  return addresses
}
