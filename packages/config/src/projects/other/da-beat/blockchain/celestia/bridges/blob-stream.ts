import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { DaAccessibilityRisk } from '../../../types/DaAccessibilityRisk'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge, DaBridgeKind } from '../../../types/DaBridge'
import { DaExitWindowRisk } from '../../../types/DaExitWindowRisk'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const blobStream = {
  id: 'blob-stream',
  kind: DaBridgeKind.OnChainBridge,
  display: {
    name: 'Blob Stream',
    slug: 'blob-stream',
    description: 'Celestia with Blob Stream bridge on Ethereum.',
  },
  chain: ChainId.ETHEREUM,
  usedIn: [],
  contracts: {
    name: 'BlobStreamBridge',
    address: EthereumAddress('0x1234567890123456789012345678901234567890'),
  },
  permissions: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    exitWindow: DaExitWindowRisk.SecurityCouncil(30 * 24 * 60 * 60),
    accessibility: DaAccessibilityRisk.NotEnshrined,
  },
} satisfies DaBridge
