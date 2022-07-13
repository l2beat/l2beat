import { providers } from 'ethers'

import { getGnosisSafe } from '../common/gnosisSafe'
import { getSimpleProxy } from '../common/simpleProxy'
import { DiscoveryEngine } from '../discovery/DiscoveryEngine'
import { ProjectParameters } from '../types'
import { addresses } from './constants'
import { getGovernance } from './contracts/governance'
import { getTokenGovernance } from './contracts/tokenGovernance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getZkSync } from './contracts/zkSync'

export async function getZkSyncParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: 'zkSync',
    contracts: await Promise.all([
      getUpgradeGatekeeper(provider),
      getZkSync(provider),
      getGovernance(provider),
      getSimpleProxy(provider, addresses.verifier, 'Verifier'),
      getTokenGovernance(provider),
      getGnosisSafe(provider, addresses.multisig, 'Multisig'),
    ]),
  }
}

export async function discoverZkSync(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover('zkSync', [addresses.upgradeGatekeeper], {
    skipMethods: {
      '0x7C770595a2Be9A87CF49B35eA9bC534f1a59552D': [
        'tokenURI',
        'getCreatorFingerprint',
        'getSerialId',
        'getContentHash',
        'getCreatorAccountId',
        'getCreatorAddress',
        'tokenByIndex',
        'getApproved',
        'ownerOf',
      ],
    },
  })
}
