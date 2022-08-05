import { providers } from 'ethers'

import { getSimpleEip1967Proxy } from '../../common/getSimpleEip1967Proxy'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getGovernance } from './contracts/governance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getZKSeaNFT } from './contracts/zkSeaNFT'
import { getZkSync } from './contracts/zkSync'

export const ZK_SPACE_NAME = 'zkSpace'

export async function getZkSpaceParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: ZK_SPACE_NAME,
    contracts: await Promise.all([
      getUpgradeGatekeeper(provider),
      getZkSync(provider),
      getGovernance(provider),
      getSimpleEip1967Proxy(provider, addresses.verifier, 'Verifier'),
      getSimpleEip1967Proxy(provider, addresses.verifierExit, 'VerifierExit'),
      getSimpleEip1967Proxy(provider, addresses.pairManager, 'PairManager'),
      getZKSeaNFT(provider),
    ]),
  }
}

export async function discoverZkSpace(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(ZK_SPACE_NAME, [addresses.upgradeGatekeeper], {
    skipMethods: {
      '0xc632347cc96A4400653E3514eA148630455295b5': [
        'tokenByIndex',
        'getApproved',
        'tokenURI',
        'externSeqIdMap',
        'ownerOf',
        'infoMapL1',
        'firstPendingWithdrawal',
        'pendingWithdrawals',
        'getContentHash',
      ],
      '0xD06986022EFE62A5BC8258299e4495Bb27567BE0': [
        'tokenByIndex',
        'getApproved',
        'tokenURI',
        'externSeqIdMap',
        'ownerOf',
        'infoMapL1',
        'firstPendingWithdrawal',
        'pendingWithdrawals',
        'getContentHash',
      ],
    },
  })
}
