import { providers } from 'ethers'

import { getGnosisSafe } from '../../common/gnosisSafe'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getProxyAdmin } from './contracts/proxyAdmin'
import { getSynapseBridge } from './contracts/synapseBridge'
import { getTimelock } from './contracts/timelock'

export const SYNAPSE_NAME = 'synapse'

export async function getSynapseParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: SYNAPSE_NAME,
    contracts: await Promise.all([
      getSynapseBridge(provider),
      getGnosisSafe(provider, addresses.multisig, 'MultiSig'),
      getProxyAdmin(provider),
      getTimelock(provider),
    ]),
  }

  return parameters
}

export async function discoverSynapse(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(SYNAPSE_NAME, [
    addresses.synapseBridge,
    addresses.proxyAdmin,
    addresses.timelock,
  ])
}
