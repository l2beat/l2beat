import { providers } from 'ethers'

import { getSimpleProxy } from '../../common/simpleProxy'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getGovernance } from './contracts/governance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getZkSync } from './contracts/zkSync'

export const ZK_SWAP_1_NAME = 'zkSwap1'

export async function getZkSwap1Parameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: ZK_SWAP_1_NAME,
    contracts: await Promise.all([
      getUpgradeGatekeeper(provider),
      getZkSync(provider),
      getGovernance(provider),
      getSimpleProxy(provider, addresses.verifier, 'Verifier'),
      getSimpleProxy(provider, addresses.verifierExit, 'VerifierExit'),
      getSimpleProxy(provider, addresses.pairManager, 'PairManager'),
    ]),
  }
}

export async function discoverZkSwap1(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(ZK_SWAP_1_NAME, [addresses.upgradeGatekeeper])
}
