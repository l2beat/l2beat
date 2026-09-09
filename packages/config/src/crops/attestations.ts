import { CROP_ATTESTATION_DATA } from './attestationData'
import { ATTESTATION_SCHEMA_UID, type AttestationNetwork } from './eas'

export interface CropAttestation {
  uid: string
  /** Recorded because EAS only accepts a revocation naming the original schema. */
  schema: string
  /** Bumped every time the attested set changes. Starts at 1. */
  revision: number
  reviewedAt: number
  /** Sorted. */
  projectIds: string[]
  txHash: string
  block: number
}

export interface RevokedCropAttestation {
  uid: string
  schema: string
  revision: number
  projectIds: string[]
  revokedTxHash: string
  revokedBlock: number
}

export interface CropAttestationLedger {
  network: AttestationNetwork
  attester: string
  /** Block of the earliest attestation - the default start for `--scan`. */
  firstBlock: number
  /**
   * Steady state is exactly one. More than one means an interrupted run or a
   * schema change; `l2b crops-attest` revokes the extras on its next run.
   */
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

/** Live and under the current schema. Anything else in `live` awaits revocation. */
export function getCurrentCropAttestation(
  network: AttestationNetwork,
): CropAttestation | undefined {
  return CROP_ATTESTATIONS[network]?.live.find(
    (x) => x.schema.toLowerCase() === ATTESTATION_SCHEMA_UID.toLowerCase(),
  )
}

export function isProjectAttested(
  network: AttestationNetwork,
  projectId: string,
): boolean {
  return !!getCurrentCropAttestation(network)?.projectIds.includes(projectId)
}
