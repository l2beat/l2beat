import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { DaAccessabilityRisk } from '../../../types/DaAccessabilityRisk'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge } from '../../../types/DaBridge'
import { DaExitWindowRisk } from '../../../types/DaExitWindowRisk'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const blobStream = {
  type: 'OnChain',
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
    attestations: DaAttestationSecurityRisk.SIG_VERIFIED_ZK(true),
    exitWindow: DaExitWindowRisk.SECURITY_COUNCIL(30 * 24 * 60 * 60),
    accessability: DaAccessabilityRisk.NOT_ENSHRINED,
  },
} satisfies DaBridge
