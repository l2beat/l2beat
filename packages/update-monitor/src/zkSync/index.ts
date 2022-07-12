import { providers } from 'ethers'

import { ProjectParameters } from '../types'
import { getGovernance } from './contracts/governance'
import { getMultisig } from './contracts/multisig'
import { getTokenGovernance } from './contracts/tokenGovernance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getVerifier } from './contracts/verifier'
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
      getVerifier(provider),
      getTokenGovernance(provider),
      getMultisig(provider),
    ]),
  }
}
