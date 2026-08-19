import { CROP_ATTESTATION_DATA } from './attestationData'
import type { AttestationNetwork } from './eas'

export interface CropAttestation {
  projectId: string
  /** EAS attestation uid. Live (non-revoked) as of the last verify. */
  uid: string
  /** Bumped every time the evaluation changes. Starts at 1. */
  revision: number
  reviewedAt: number
  /** keccak256 of serializeCanonicalCrops(...) for this evaluation. */
  evaluationHash: string
  txHash: string
  block: number
}

export interface RevokedCropAttestation {
  projectId: string
  uid: string
  revision: number
  revokedTxHash: string
  revokedBlock: number
}

export interface CropAttestationLedger {
  network: AttestationNetwork
  /** The EOA that signed these attestations. */
  attester: string
  /** Block of the earliest attestation - the default start for `--scan`. */
  firstBlock: number
  live: CropAttestation[]
  revoked: RevokedCropAttestation[]
}

export const CROP_ATTESTATIONS: Partial<
  Record<AttestationNetwork, CropAttestationLedger>
> = CROP_ATTESTATION_DATA

export function getCropAttestationLedger(
  network: AttestationNetwork,
): CropAttestationLedger | undefined {
  return CROP_ATTESTATIONS[network]
}

export function getCropAttestation(
  network: AttestationNetwork,
  projectId: string,
): CropAttestation | undefined {
  return CROP_ATTESTATIONS[network]?.live.find((x) => x.projectId === projectId)
}
