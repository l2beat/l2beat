import { EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../../../discovery/ProjectDiscovery'
import { DaAttestationSecurityRisk } from '../../../../types/DaAttestationSecurityRisk'
import { DaExitWindowRisk } from '../../../../types/DaExitWindowRisk'
import { CELESTIA_BLOBSTREAM } from './template'

const discovery = new ProjectDiscovery('blobstream')

// Example
const _maxDataCommitment = discovery.getContractValue(
  'BlobstreamX',
  'DATA_COMMITMENT_MAX',
)

export const blobstreamEthereum = CELESTIA_BLOBSTREAM({
  chain: 'ethereum',
  contracts: [
    {
      name: 'BlobStreamBridge',
      address: EthereumAddress('0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe'),
    },
  ],
  permissions: [
    ...discovery.getMultisigPermission(
      'BlobstreamXMultisig',
      'This multisig is the admin of the BlobstreamX contract. It holds the power to change the contract state and upgrade the bridge.',
    ),
  ],
  usedIn: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    exitWindow: DaExitWindowRisk.SecurityCouncil(0), // TIMELOCK_ROLE is multisig
  },
})
