import { getCurrentCropAttestation } from '@l2beat/config/build/crops/attestations'
import {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
  getAttestationUrl,
} from '@l2beat/config/build/crops/eas'
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
