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

export const blobStreamEthereum = CELESTIA_BLOBSTREAM({
  chain: 'ethereum',
  technology:
    'Some note about the technology used by the bridge.\n## Markdown supported',
  contracts: {
    addresses: [],
    risks: [],
  },
  permissions: [],
  usedIn: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    exitWindow: DaExitWindowRisk.SecurityCouncil(30 * 24 * 60 * 60),
  },
})
