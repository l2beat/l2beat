import {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
  getAttestationUrl,
  getCurrentCropAttestation,
} from '@l2beat/config'
import type { GardenAttestation } from '~/pages/garden/components/AttestationNotice'

export function getGardenAttestation(): GardenAttestation | undefined {
  const attestation = getCurrentCropAttestation(ATTESTATION_NETWORK)
  if (!attestation) {
    return undefined
  }
  return {
    revision: attestation.revision,
    reviewedAt: attestation.reviewedAt,
    projectCount: attestation.projectIds.length,
    explorerUrl: getAttestationUrl(
      ATTESTATION_NETWORKS[ATTESTATION_NETWORK],
      attestation.uid,
    ),
  }
}
