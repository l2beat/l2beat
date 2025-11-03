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
  type TemplateService,
} from '@l2beat/discovery'
import type { ColorContract } from '@l2beat/discovery/dist/discovery/config/ColorConfig'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
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
): ApiProjectResponse {
  const discoveries = configReader.readDiscoveryWithReferences(project)
  const discovery = discoveries[0]
  const data = discoveries.map((discovery) => ({
    discovery,
    config: configReader.readConfig(discovery.name),
  }))

  const reachableEntries = getReachableEntries(
    data
      .flatMap((x) => x.discovery.entries)
      .filter((e) => e.type !== 'Reference'),
    discovery.entries.map((e) => e.address),
  ).map((x) => x.address)

  const response: ApiProjectResponse = { entries: [] }
  const meta = getMeta(data.map((x) => x.discovery))
  for (const { config, discovery } of data) {
    const contracts = discovery.entries
      .filter((e) => e.type === 'Contract')
      // .filter((e) => referencedEntries.includes(e.address))
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
          reachableEntries,
        )
      })
      .sort(orderAddressEntries)

    const initialAddresses = config.structure.initialAddresses
    const chainInfo = {
      project: config.name,
      initialContracts: contracts.filter((x) =>
        initialAddresses.includes(x.address),
      ),
      discoveredContracts: contracts.filter(
        (x) => !initialAddresses.includes(x.address),
      ),
      eoas: discovery.entries
        .filter((e) => e.type === 'EOA')
        .filter(
          (x) =>
            ChainSpecificAddress.address(x.address) !== EthereumAddress.ZERO,
        )
        .map((x): ApiAddressEntry => {
          const roles = getRoles(x)
          return {
            name: x.name || undefined,
            type: roles.length > 0 ? 'EOAPermissioned' : 'EOA',
            roles: roles,
            description: x.description,
            referencedBy: [],
            address: x.address,
            chain: ChainSpecificAddress.longChain(x.address),
            isReachable: reachableEntries.includes(x.address),
          }
        })
        .sort(orderAddressEntries),
      blockNumbers: discovery.usedBlockNumbers,
    } satisfies ApiProjectChain

    response.entries.push(chainInfo)
  }
  populateReferencedBy(response.entries)
  return response
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
  reachableEntries: ChainSpecificAddress[],
): ApiProjectContract {
  const getFieldInfo = (name: string): Omit<Field, 'name' | 'value'> => {
    const field = contractConfig.fields[name]
    const fieldColor = contractColorConfig.fields[name]
    return {
      description: fieldColor?.description,
      handler: field?.handler,
      ignoreInWatchMode: contractConfig.ignoreInWatchMode?.includes(name),
      ignoreRelatives: contractConfig.ignoreRelatives?.includes(name),
      severity: fieldColor?.severity,
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
    isReachable: reachableEntries.includes(contract.address),
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
