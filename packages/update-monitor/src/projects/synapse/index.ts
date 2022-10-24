import { providers } from 'ethers'

import { GnosisSafe } from '../../common/proxies/GnosisSafe'
import { getProxyAdmin } from '../../common/proxyAdmin'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { addresses } from './constants'
import { getSynapseBridge } from './contracts/synapseBridge'
import { getTimelock } from './contracts/timelock'

export const SYNAPSE_NAME = 'synapseBridge'

export async function getSynapseParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: SYNAPSE_NAME,
    contracts: await Promise.all([
      getSynapseBridge(provider),
      GnosisSafe.getContract(provider, addresses.multisig, 'MultiSig'),
      getProxyAdmin(provider, addresses.proxyAdmin, 'ProxyAdmin'),
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
