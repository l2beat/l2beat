import { providers } from 'ethers'

import { ResolvedDelegateProxy } from '../../common/proxies/ResolvedDelegateProxy'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { addresses } from './constants'
import { getCanonicalTransactionChain } from './contracts/getCanonicalTransactionChain'
import { getLibAddressManager } from './contracts/getLibAddressManager'
import { getStateCommitmentChain } from './contracts/getStateCommitmentChain'

export const OPTIMISM_NAME = 'optimism'

export async function getOptimismParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters = {
    name: OPTIMISM_NAME,
    contracts: await Promise.all([
      ResolvedDelegateProxy.getContract(
        provider,
        addresses.l1CrossDomainMessenger,
        'L1CrossDomainMessenger',
      ),
      getStateCommitmentChain(provider),
      getCanonicalTransactionChain(provider),
      getLibAddressManager(provider),
    ]),
  }
  verify(parameters, [
    ['CanonicalTransactionChain.libAddressManager', 'LibAddressManager'],
    ['StateCommitmentChain.libAddressManager', 'LibAddressManager'],
  ])
  return parameters
}

export async function discoverOptimism(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    OPTIMISM_NAME,
    [
      addresses.l1StandardBridge,
      addresses.canonicalTransactionChain,
      addresses.libAddressManager,
      addresses.stateCommitmentChain,
      addresses.bondManager,
      addresses.l1CrossDomainMessenger,
    ],
    {
      skipMethods: {
        '0x5E4e65926BA27467555EB562121fac00D24E9dD2': ['getQueueElement'],
        '0xD16463EF9b0338CE3D73309028ef1714D220c024': ['get'],
        '0xb0ddFf09c4019e31960de11bD845E836078E8EbE': ['get'],
      },
    },
  )
}
