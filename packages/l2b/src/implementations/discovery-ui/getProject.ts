import { ConfigReader } from '@l2beat/discovery'
import { ContractParameters } from '@l2beat/discovery-types'
import { toAddress } from './toAddress'
import { ApiProjectContract, ApiProjectResponse } from './types'

export function getProject(configReader: ConfigReader, project: string) {
  const chains = configReader.readAllChainsForProject(project)
  const data = chains.map((chain) => ({
    chain,
    config: configReader.readConfig(project, chain),
    discovery: configReader.readDiscovery(project, chain),
  }))

  const response: ApiProjectResponse = { chains: [] }
  for (const { chain, config, discovery } of data) {
    response.chains.push({
      name: chain,
      initialContracts: config.initialAddresses.map((x) => {
        const discovered = discovery.contracts.find((y) => y.address === x)
        if (!discovered) {
          return {
            name: undefined,
            type: 'Contract',
            address: toAddress(chain, x),
            values: {},
          }
        }
        return contractFromDiscovery(chain, discovered)
      }),
      discoveredContracts: discovery.contracts
        .filter((x) => !config.initialAddresses.includes(x.address))
        .map((x) => contractFromDiscovery(chain, x)),
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
  contract: ContractParameters,
): ApiProjectContract {
  const isMultisig = !!contract.values?.['$members']
  const isDiamond = Array.isArray(contract.values?.['$implementation'])
  const isTimelock = !!contract.values?.['TIMELOCK_ADMIN_ROLE']

  return {
    name: contract.name,
    // TODO: implement
    type: isMultisig
      ? 'Multisig'
      : isTimelock
        ? 'Timelock'
        : isDiamond
          ? 'Diamond'
          : 'Contract',
    address: toAddress(chain, contract.address),
    // TODO: implement
    values: {},
  }
}
