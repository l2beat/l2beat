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
  await discoveryEngine.discover(DYDX_NAME, [addresses.starkPerpetual])
}
