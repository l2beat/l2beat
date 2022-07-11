import { providers } from 'ethers'

import { ProjectParameters } from '../types'
import { getGovernance } from './contracts/governance'
import { getPairManager } from './contracts/pairManager'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getVerifier } from './contracts/verifier'
import { getVerifierExit } from './contracts/verifierExit'
import { getZKSeaNFT } from './contracts/zkSeaNFT'
import { getZkSync } from './contracts/zkSync'

export async function getZkSpaceParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: 'ZkSpace',
    contracts: await Promise.all([
      getUpgradeGatekeeper(provider),
      getGovernance(provider),
      getPairManager(provider),
      getVerifier(provider),
      getVerifierExit(provider),
      getZKSeaNFT(provider),
      getZkSync(provider),
    ]),
  }
}
