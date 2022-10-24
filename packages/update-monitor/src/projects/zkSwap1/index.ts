import { providers } from 'ethers'

import { Eip1967Proxy } from '../../common/proxies/Eip1967Proxy'
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
      Eip1967Proxy.getContract(provider, addresses.verifier, 'Verifier'),
      Eip1967Proxy.getContract(
        provider,
        addresses.verifierExit,
        'VerifierExit',
      ),
      Eip1967Proxy.getContract(provider, addresses.pairManager, 'PairManager'),
    ]),
  }
}

export async function discoverZkSwap1(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(ZK_SWAP_1_NAME, [addresses.upgradeGatekeeper])
}
