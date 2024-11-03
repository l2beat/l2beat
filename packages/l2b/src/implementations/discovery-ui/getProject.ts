import { ConfigReader } from '@l2beat/discovery'
import { ContractParameters, DiscoveryOutput } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { parseFieldValue } from './parseFieldValue'
import { toAddress } from './toAddress'
import {
  ApiAddressEntry,
  ApiAddressType,
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
    response.chains.push({
      name: chain,
      initialContracts: config.initialAddresses
        .map((x): ApiProjectContract => {
          const discovered = discovery.contracts.find((y) => y.address === x)
          if (!discovered) {
            return {
              name: undefined,
              type: 'Contract',
              address: toAddress(chain, x),
              fields: [],
            }
          }
          return contractFromDiscovery(chain, meta, discovered)
        })
        .sort(orderAddressEntries),
      discoveredContracts: discovery.contracts
        .filter((x) => !config.initialAddresses.includes(x.address))
        .map((x) => contractFromDiscovery(chain, meta, x))
        .sort(orderAddressEntries),
      eoas: discovery.eoas
        .filter((x) => x.address !== EthereumAddress.ZERO)
        .map(
          (x): ApiAddressEntry => ({
            name: x.name,
            type: 'EOA',
            address: toAddress(chain, x.address),
          }),
        )
        .sort(orderAddressEntries),
    })
  }
  return response
}

function orderAddressEntries(a: ApiAddressEntry, b: ApiAddressEntry) {
  if (a.name && b.name) {
    return a.name.localeCompare(b.name)
  }
  if (a.name) {
    return 1
  }
  if (b.name) {
    return -1
  }
  return a.address.localeCompare(b.address)
}

function contractFromDiscovery(
  chain: string,
  meta: Record<string, { name?: string; type: ApiAddressType }>,
  contract: ContractParameters,
): ApiProjectContract {
  const fields: Field[] = Object.entries(contract.values ?? {}).map(
    ([name, value]) => ({
      name,
      value: fixAddresses(parseFieldValue(value, meta), chain),
    }),
  )
  return {
    name: contract.name !== '' ? contract.name : undefined,
    type: getContractType(contract),
    address: toAddress(chain, contract.address),
    fields,
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
    meta[address] = { name: contract.name, type: getContractType(contract) }
  }
  for (const eoa of discovery.eoas) {
    const address = eoa.address.toString()
    meta[address] = { name: eoa.name, type: 'EOA' }
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
