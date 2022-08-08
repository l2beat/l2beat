import { providers } from 'ethers'

import { getSimpleEip1967Proxy } from '../../common/getSimpleEip1967Proxy'
import { getGnosisSafe } from '../../common/gnosisSafe'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { addresses } from './constants'
import { getGovernance } from './contracts/governance'
import { getTokenGovernance } from './contracts/tokenGovernance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getZkSync } from './contracts/zkSync'

export const ZK_SYNC_NAME = 'zkSync'

export async function getZkSyncParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: ZK_SYNC_NAME,
    contracts: await Promise.all([
      getUpgradeGatekeeper(provider),
      getZkSync(provider),
      getGovernance(provider),
      getSimpleEip1967Proxy(provider, addresses.verifier, 'Verifier'),
      getTokenGovernance(provider),
      getGnosisSafe(provider, addresses.multisig, 'Multisig'),
    ]),
  }
  verify(parameters, [
    ['UpgradeGatekeeper.managedContracts[0]', 'Governance'],
    ['UpgradeGatekeeper.managedContracts[1]', 'Verifier'],
    ['UpgradeGatekeeper.managedContracts[2]', 'zkSync'],
    ['UpgradeGatekeeper.mainContract', 'zkSync'],
    ['UpgradeGatekeeper.master', 'Multisig'],
    ['Governance.admin', 'UpgradeGatekeeper'],
    ['Verifier.admin', 'UpgradeGatekeeper'],
    ['zkSync.admin', 'UpgradeGatekeeper'],
    ['Governance.networkGovernor', 'Multisig'],
    ['Governance.tokenGovernance', 'TokenGovernance'],
  ])
  return parameters
}

export async function discoverZkSync(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(ZK_SYNC_NAME, [addresses.upgradeGatekeeper], {
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
