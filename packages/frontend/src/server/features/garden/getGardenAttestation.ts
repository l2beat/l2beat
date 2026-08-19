import { getCurrentCropAttestation } from '@l2beat/config/build/crops/attestations'
import {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
  getAttestationUrl,
} from '@l2beat/config/build/crops/eas'
import type { GardenAttestation } from '~/pages/garden/components/AttestationNotice'

/**
 * The one attestation that names the whole garden. Read from the committed
 * ledger rather than over RPC: `l2b crops-verify` is what keeps the two
 * honest, so the page does not need a network call to render a link.
 */
export function getGardenAttestation(): GardenAttestation | undefined {
  const attestation = getCurrentCropAttestation(ATTESTATION_NETWORK)
  if (!attestation) {
    return undefined
  }
  const network = ATTESTATION_NETWORKS[ATTESTATION_NETWORK]
  return {
    network: network.name,
    isTestnet: network.isTestnet,
    uid: attestation.uid,
    revision: attestation.revision,
    reviewedAt: attestation.reviewedAt,
    projectCount: attestation.projectIds.length,
    explorerUrl: getAttestationUrl(network, attestation.uid),
  }
}
