import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'

export const OMG_NETWORK_NAME = 'omgNetwork'

export async function getOmgNetworkParameters(
  _provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: OMG_NETWORK_NAME,
    contracts: await Promise.all([]),
  }
  return parameters
}

export async function discoverOmgNetwork(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    OMG_NETWORK_NAME,
    [
      '0x0D4C1222f5e839a911e2053860e45F18921D72ac',
      '0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      '0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0',
      '0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B',
    ],
    {
      skipMethods: {
        '0x0D4C1222f5e839a911e2053860e45F18921D72ac': [
          'vaults',
          'protocols',
          'blocks',
          'exitGames',
        ],
      },
    },
  )
}
