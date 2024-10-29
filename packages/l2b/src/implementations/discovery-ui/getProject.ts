import { ConfigReader } from '@l2beat/discovery'
import { ContractParameters, DiscoveryOutput } from '@l2beat/discovery-types'
import { parseFieldValue } from './parseFieldValue'
import { toAddress } from './toAddress'
import {
  ApiAddressEntry,
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
    const names = getNames(discovery)
    response.chains.push({
      name: chain,
      initialContracts: config.initialAddresses.map((x) => {
        const discovered = discovery.contracts.find((y) => y.address === x)
        if (!discovered) {
          return {
            name: undefined,
            type: 'Contract',
            address: toAddress(chain, x),
            fields: [],
          }
        }
        return contractFromDiscovery(chain, names, discovered)
      }),
      discoveredContracts: discovery.contracts
        .filter((x) => !config.initialAddresses.includes(x.address))
        .map((x) => contractFromDiscovery(chain, names, x)),
      // TODO: implement
      ignoredContracts: [],
      eoas: discovery.eoas
        .filter(
          (x) => x.address !== '0x0000000000000000000000000000000000000000',
        )
        .map((x) => ({
          name: x.name,
          type: 'EOA',
          address: toAddress(chain, x.address),
        })),
    })
  }
  return response
}

function contractFromDiscovery(
  chain: string,
  names: Record<string, string>,
  contract: ContractParameters,
): ApiProjectContract {
  const fields: Field[] = Object.entries(contract.values ?? {}).map(
    ([name, value]) => ({
      name,
      value: fixAddresses(parseFieldValue(value, names), chain),
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
        Object.entries(value).map(([key, value]) => [
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
      type: 'address',
      name: value.name,
      address: toAddress(chain, value.address),
    }
  }
  return value
}

function getNames(discovery: DiscoveryOutput) {
  const names: Record<string, string> = {}
  for (const contract of discovery.contracts) {
    names[contract.address.toString()] = contract.name
  }
  return names
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
