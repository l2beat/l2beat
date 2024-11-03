import { ConfigReader } from '@l2beat/discovery'
import {
  ContractParameters,
  DiscoveryOutput,
  get$Implementations,
} from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { parseFieldValue } from './parseFieldValue'
import { toAddress } from './toAddress'
import {
  AddressFieldValue,
  ApiAddressEntry,
  ApiAddressType,
  ApiProjectChain,
  ApiProjectContract,
  ApiProjectResponse,
  Field,
  FieldValue,
} from './types'

export function getProject(configReader: ConfigReader, project: string) {
  const chains = configReader.readAllChainsForProject(project)
  const data = chains.map((chain) => ({
    chain,
    config: configReader.readConfig(project, chain),
    discovery: configReader.readDiscovery(project, chain),
  }))

  const response: ApiProjectResponse = { chains: [] }
  for (const { chain, config, discovery } of data) {
    const meta = getMeta(discovery)
    const chainInfo = {
      name: chain,
      initialContracts: config.initialAddresses
        .map((x): ApiProjectContract => {
          const discovered = discovery.contracts.find((y) => y.address === x)
          if (!discovered) {
            // NOTE: This shouldn't happen
            return {
              name: undefined,
              type: 'Contract',
              address: toAddress(chain, x),
              referencedBy: [],
              fields: [],
              abis: [],
            }
          }
          return contractFromDiscovery(chain, meta, discovered, discovery.abis)
        })
        .sort(orderAddressEntries),
      discoveredContracts: discovery.contracts
        .filter((x) => !config.initialAddresses.includes(x.address))
        .map((x) => contractFromDiscovery(chain, meta, x, discovery.abis))
        .sort(orderAddressEntries),
      eoas: discovery.eoas
        .filter((x) => x.address !== EthereumAddress.ZERO)
        .map(
          (x): ApiAddressEntry => ({
            name: x.name || undefined,
            type: 'EOA',
            referencedBy: [],
            address: toAddress(chain, x.address),
          }),
        )
        .sort(orderAddressEntries),
    }
    response.chains.push(chainInfo)
  }
  populateReferencedBy(response.chains)
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
  contract: ContractParameters,
  abis: DiscoveryOutput['abis'],
): ApiProjectContract {
  const fields: Field[] = Object.entries(contract.values ?? {}).map(
    ([name, value]) => ({
      name,
      value: fixAddresses(parseFieldValue(value, meta), chain),
    }),
  )
  const implementations = get$Implementations(contract.values)
  return {
    name: contract.name || undefined,
    type: getContractType(contract),
    referencedBy: [],
    address: toAddress(chain, contract.address),
    fields,
    abis: [contract.address, ...implementations].map((address) => ({
      address: toAddress(chain, address),
      entries: abis[address] ?? [],
    })),
  }
}

function fixAddresses(value: FieldValue, chain: string): FieldValue {
  if (value.type === 'object') {
    return {
      type: 'object',
      value: Object.fromEntries(
        Object.entries(value.value).map(([key, value]) => [
          key,
          fixAddresses(value, chain),
        ]),
      ),
    }
  } else if (value.type === 'array') {
    return {
      type: 'array',
      values: value.values.map((value) => fixAddresses(value, chain)),
    }
  } else if (value.type === 'address') {
    return {
      ...value,
      address: toAddress(chain, value.address),
    }
  }
  return value
}

function getMeta(discovery: DiscoveryOutput) {
  const meta: Record<string, { name?: string; type: ApiAddressType }> = {}
  for (const contract of discovery.contracts) {
    const address = contract.address.toString()
    meta[address] = {
      name: contract.name || undefined,
      type: getContractType(contract),
    }
  }
  for (const eoa of discovery.eoas) {
    const address = eoa.address.toString()
    meta[address] = { name: eoa.name || undefined, type: 'EOA' }
  }
  meta[EthereumAddress.ZERO] = { name: 'ZERO', type: 'Unknown' }
  return meta
}

function getContractType(
  contract: ContractParameters,
): ApiAddressEntry['type'] {
  if (contract.unverified) {
    return 'Unverified'
  }
  if (contract.values?.['$members']) {
    return 'Multisig'
  }
  if (
    !!contract.values?.['name'] &&
    !!contract.values?.['symbol'] &&
    !!contract.values?.['decimals']
  ) {
    return 'Token'
  }
  if (contract.values?.['TIMELOCK_ADMIN_ROLE']) {
    return 'Timelock'
  }
  if (Array.isArray(contract.values?.['$implementation'])) {
    return 'Diamond'
  }
  return 'Contract'
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
