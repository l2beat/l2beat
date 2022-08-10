import { providers } from 'ethers'

import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getRollup } from './contracts/rollup'

export const NOVA_NAME = 'nova'

export async function getNovaParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: NOVA_NAME,
    contracts: await Promise.all([getRollup(provider)]),
  }
}

export async function discoverNova(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(NOVA_NAME, [addresses.rollup])
}
