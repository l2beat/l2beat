import { providers } from 'ethers'

import { getGnosisSafe } from '../common/gnosisSafe'
import { getSimpleProxy } from '../common/simpleProxy'
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
