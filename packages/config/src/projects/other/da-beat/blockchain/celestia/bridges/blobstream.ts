import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { DaAccessibilityRisk } from '../../../types/DaAccessibilityRisk'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge, DaBridgeKind } from '../../../types/DaBridge'
import { DaExitWindowRisk } from '../../../types/DaExitWindowRisk'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const blobstream = {
  id: 'blobstream',
  kind: DaBridgeKind.OnChainBridge,
  display: {
    name: 'Blobstream',
    slug: 'blobstream',
    description: 'Celestia with Blobstream bridge on Ethereum.',
  },
  chain: ChainId.ETHEREUM,
  usedIn: [],
  contracts: {
    name: 'BlobstreamBridge',
    address: EthereumAddress('0x7Cf3876F681Dbb6EdA8f6FfC45D66B996Df08fAe'),
  },
  permissions: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    exitWindow: DaExitWindowRisk.SecurityCouncil(30 * 24 * 60 * 60),
    accessibility: DaAccessibilityRisk.NotEnshrined,
  },
} satisfies DaBridge
