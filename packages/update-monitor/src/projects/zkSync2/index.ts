import { providers } from 'ethers'

import { Eip1967Proxy } from '../../common/proxies/Eip1967Proxy'
import { GnosisSafe } from '../../common/proxies/GnosisSafe'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { addresses } from './constants'
import { getGovernance } from './contracts/governance'
import { getTokenGovernance } from './contracts/tokenGovernance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getZkSync } from './contracts/zkSync'

export const ZK_SYNC2_NAME = 'zkSync2'

export async function getZkSync2Parameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: ZK_SYNC_NAME,
    contracts: await Promise.all([
      getUpgradeGatekeeper(provider),
      getZkSync(provider),
      getGovernance(provider),
      Eip1967Proxy.getContract(provider, addresses.verifier, 'Verifier'),
      getTokenGovernance(provider),
      GnosisSafe.getContract(provider, addresses.multisig, 'Multisig'),
    ]),
  }
  verify(parameters, [
    ['UpgradeGatekeeper.managedContracts[0]', 'Governance'],
    ['UpgradeGatekeeper.managedContracts[1]', 'Verifier'],
    ['UpgradeGatekeeper.managedContracts[2]', 'zkSync'],
    ['UpgradeGatekeeper.mainContract', 'zkSync'],
    ['UpgradeGatekeeper.master', 'Multisig'],
    ['Governance.upgradeability.admin', 'UpgradeGatekeeper'],
    ['Verifier.upgradeability.admin', 'UpgradeGatekeeper'],
    ['zkSync.upgradeability.admin', 'UpgradeGatekeeper'],
    ['Governance.networkGovernor', 'Multisig'],
    ['Governance.tokenGovernance', 'TokenGovernance'],
  ])
  return parameters
}

export async function discoverZkSync2(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    ZK_SYNC2_NAME,
    [addresses.zkSync, addresses.bridge],
    {
      skipMethods: {
        '0x324000e0c256b806548b307af600afff3d000324': [
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
    },
  )
}
