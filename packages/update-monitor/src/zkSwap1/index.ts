import { providers } from 'ethers'

import { getSimpleProxy } from '../common/simpleProxy'
import { ProjectParameters } from '../types'
import { addresses } from './constants'
import { getGovernance } from './contracts/governance'
import { getUpgradeGatekeeper } from './contracts/upgradeGatekeeper'
import { getZkSync } from './contracts/zkSync'

export async function getZkSwap1Parameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  return {
    name: 'zkSwap1',
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
