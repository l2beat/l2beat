import { CROP_ATTESTATION_DATA } from './attestationData'
import { ATTESTATION_SCHEMA_UID, type AttestationNetwork } from './eas'

export interface CropAttestation {
  /** EAS attestation uid. Live (non-revoked) as of the last verify. */
  uid: string
  /**
   * The schema it was attested under. Recorded rather than assumed: EAS checks
   * it on revocation, so an attestation from a superseded schema can only be
   * cleaned up if we remember which schema that was.
   */
  schema: string
  /** Bumped every time the attested set changes. Starts at 1. */
  revision: number
  reviewedAt: number
  /** The project ids this attestation covers, sorted. */
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
  /** The EOA that signed these attestations. */
  attester: string
  /** Block of the earliest attestation - the default start for `--scan`. */
  firstBlock: number
  /**
   * Every attestation we have made that is still live onchain. Steady state is
   * exactly one - the current set. More than one means a run was interrupted,
   * or a schema change has not been cleaned up yet; `l2b crops-attest` revokes
   * the extras on its next run.
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

/**
 * The attestation that speaks for the set right now: live, and made under the
 * schema we currently register. Anything else in `live` is debt awaiting a
 * revocation, not a claim we stand behind.
 */
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
