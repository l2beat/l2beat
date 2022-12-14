import { providers } from 'ethers'

import { ResolvedDelegateProxy } from '../../common/proxies/ResolvedDelegateProxy'
import { DiscoveryEngine } from '../../discovery/DiscoveryEngine'
import { ProjectParameters } from '../../types'
import { verify } from '../../verify/verify'
import { addresses } from './constants'
import { getBondManager } from './contracts/getBondManager'
import { getCanonicalTransactionChain } from './contracts/getCanonicalTransactionChain'
import { getLibAddressManager } from './contracts/getLibAddressManager'
import { getStateCommitmentChain } from './contracts/getStateCommitmentChain'

export const METIS_NAME = 'metis'

export async function getMetisParameters(
  provider: providers.JsonRpcProvider,
): Promise<ProjectParameters> {
  const parameters = {
    name: METIS_NAME,
    contracts: await Promise.all([
      ResolvedDelegateProxy.getContract(
        provider,
        addresses.l1CrossDomainMessenger,
        'L1CrossDomainMessenger',
      ),
      getStateCommitmentChain(provider),
      getCanonicalTransactionChain(provider),
      getLibAddressManager(provider),
      getBondManager(provider),
    ]),
  }
  verify(parameters, [
    ['CanonicalTransactionChain.libAddressManager', 'LibAddressManager'],
    ['StateCommitmentChain.libAddressManager', 'LibAddressManager'],
    ['BondManager.libAddressManager', 'LibAddressManager'],
  ])
  return parameters
}

export async function discoverMetis(discoveryEngine: DiscoveryEngine) {
  await discoveryEngine.discover(
    METIS_NAME,
    [
      addresses.l1StandardBridge,
      addresses.canonicalTransactionChain,
      addresses.mvmCanonicalTransactionChain,
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
        '0xf209815E595Cdf3ed0aAF9665b1772e608AB9380': [
          'getTotalBatchesByChainId',
          'getLastSequencerTimestampByChainId',
          'getTotalElementsByChainId',
        ],
        '0x10739F09f6e62689c0aA8A1878816de9e166d6f9': [
          'get',
          'lengthByChainId',
          'getGlobalMetadataByChainId',
        ],
        '0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9': [
          'lengthBatchByChainId',
          'getBatchGlobalMetadataByChainId',
          'getNumPendingQueueElementsByChainId',
          'getLastTimestampByChainId',
          'getLastBlockNumberByChainId',
          'getTotalBatchesByChainId',
          'getTotalElementsByChainId',
          'getQueueElement',
          'getQueueLengthByChainId',
          'getNextQueueIndexByChainId',
        ],
        '0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57': [
          'getGlobalMetadataByChainId',
          'lengthByChainId',
        ],
        '0x38473Feb3A6366757A249dB2cA4fBB2C663416B7': [
          'get',
          'lengthByChainId',
          'getGlobalMetadataByChainId',
        ],
      },
    },
  )
}
