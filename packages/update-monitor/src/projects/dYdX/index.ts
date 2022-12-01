import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getStarkPerpetual } from './contracts/StarkPerpetual'

export const DYDX_NAME = 'dydx'

export async function getDydxParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: DYDX_NAME,
    contracts: await Promise.all([getStarkPerpetual(provider)]),
  }
  return parameters
}

export async function discoverDydx(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    DYDX_NAME,
    [addresses.starkPerpetual, '0xC8c212f11f6ACca77A7afeB7282dEBa5530eb46C'],
    {
      skipMethods: {
        '0xD54f502e184B6B739d7D27a6410a67dc462D69c8': [
          'configurationHash',
          'isQuantum',
          'getQuantum',
          'isAssetRegistered',
        ],
      },
    },
  )
}
