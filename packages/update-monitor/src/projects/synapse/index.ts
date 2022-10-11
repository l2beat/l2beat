import { providers } from 'ethers'

import { getGnosisSafe } from '../../common/gnosisSafe'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { addresses } from './constants'
import { getSynapseBridge } from './contracts/synapseBridge'

export const SYNAPSE_NAME = 'synapse'

export async function getSynapseParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters: ProjectParameters = {
    name: SYNAPSE_NAME,
    contracts: await Promise.all([
      getSynapseBridge(provider),
      getGnosisSafe(provider, addresses.multisig, 'MultiSig'),
    ]),
  }

  verify(parameters, [['SynapseBridge.', '']])

  return parameters
}

export async function discoverSynapse(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(SYNAPSE_NAME, [addresses.synapseBridge])
}
