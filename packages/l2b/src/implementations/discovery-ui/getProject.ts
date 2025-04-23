import {
  type ConfigReader,
  type ConfigRegistry,
  type DiscoveryOutput,
  type EntryParameters,
  type TemplateService,
  getChainShortName,
  makeEntryColorConfig,
  makeEntryStructureConfig,
} from '@l2beat/discovery'
import { type ContractConfig, get$Implementations } from '@l2beat/discovery'
import type { ColorContract } from '@l2beat/discovery/dist/discovery/config/ColorConfig'
import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { getContractName } from './getContractName'
import { getContractType } from './getContractType'
import { getMeta } from './getMeta'
import { parseFieldValue } from './parseFieldValue'
import { toAddress } from './toAddress'
import type {
  AddressFieldValue,
  ApiAbiEntry,
  ApiAddressEntry,
  ApiAddressType,
  ApiProjectChain,
  ApiProjectContract,
  ApiProjectResponse,
  Field,
  FieldValue,
} from './types'

interface ProjectData {
  chain: string
  config: ConfigRegistry
  discovery: DiscoveryOutput
}

function readProject(
  chain: string,
  project: string,
  configReader: ConfigReader,
): ProjectData[] {
  const discovery = configReader.readDiscovery(project, chain)
  const sharedModules = discovery.sharedModules ?? []

  return [
    {
      chain,
      config: configReader.readConfig(project, chain),
      discovery,
    },
    ...sharedModules.flatMap((sharedModule) =>
      readProject(chain, sharedModule, configReader),
    ),
  ]
}

export function getProject(
  configReader: ConfigReader,
  templateService: TemplateService,
  project: string,
): ApiProjectResponse {
  const chains = configReader.readAllChainsForProject(project)
  const data = chains.flatMap((chain) =>
    readProject(chain, project, configReader),
  )

  const response: ApiProjectResponse = { entries: [] }
  const meta = getMeta(data.map((x) => x.discovery))
  for (const { chain, config, discovery } of data) {
    const contracts = discovery.entries
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

        return contractFromDiscovery(
          chain,
          meta,
          entry,
          contractConfig,
          contractColorConfig,
          discovery.abis,
        )
      })
      .sort(orderAddressEntries)
    const initialAddresses = config.structure.initialAddresses.map(
      (address) => `${getChainShortName(chain)}:${address}`,
    )

    const chainInfo = {
      project: config.name,
      chain: chain,
      initialContracts: contracts.filter((x) =>
        initialAddresses.includes(x.address),
      ),
      discoveredContracts: contracts.filter(
        (x) => !initialAddresses.includes(x.address),
      ),
      eoas: discovery.entries
        .filter((e) => e.type === 'EOA')
        .filter((x) => x.address !== EthereumAddress.ZERO)
        .map(
          (x): ApiAddressEntry => ({
            name: x.name || undefined,
            type: 'EOA',
            description: x.description,
            referencedBy: [],
            address: toAddress(chain, x.address),
          }),
        )
        .sort(orderAddressEntries),
      blockNumber: discovery.blockNumber,
    } satisfies ApiProjectChain
    response.entries.push(chainInfo)
  }
  populateReferencedBy(response.entries)
  return response
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
  chain: string,
  meta: Record<string, { name?: string; type: ApiAddressType }>,
  contract: EntryParameters,
  contractConfig: ContractConfig,
  contractColorConfig: ColorContract,
  abis: DiscoveryOutput['abis'],
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
        value: parseFieldValue(value, meta, chain),
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
    template: contract.template,
    proxyType: contract.proxyType,
    description: contract.description,
    referencedBy: [],
    address: toAddress(chain, contract.address),
    fields,
    abis: [contract.address, ...implementations].map((address) => ({
      address: toAddress(chain, address),
      entries: (abis[address] ?? []).map((e) => abiEntry(e)),
    })),
    sources: [],
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
  const referencedBy = new Map<string, AddressFieldValue[]>()
  for (const chain of chains) {
    for (const contract of [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
    ]) {
      const field: AddressFieldValue = {
        type: 'address',
        name: contract.name,
        address: contract.address,
        addressType: contract.type,
      }
      const relatives = getAddresses(
        contract.fields.map((x) => x.value),
      ).filter((x, i, a) => a.indexOf(x) === i)
      for (const relative of relatives) {
        if (relative === contract.address) {
          continue
        }
        const refs = referencedBy.get(relative)
        if (refs) {
          refs.push(field)
        } else {
          referencedBy.set(relative, [field])
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
      addresses.push(...getAddresses(Object.values(value.value)))
    }
  }
  return addresses
}
