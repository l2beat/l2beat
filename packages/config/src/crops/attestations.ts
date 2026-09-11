import data from './attestationData.json'
import {
  ATTESTATION_SCHEMA_UID,
  type AttestationNetwork,
  type HexString,
} from './eas'

export interface CropAttestation {
  uid: HexString
  /** Recorded because EAS only accepts a revocation naming the original schema. */
  schema: HexString
  /** Bumped every time the attested set changes. Starts at 1. */
  revision: number
  reviewedAt: number
  /** Sorted. */
  projectIds: string[]
  txHash: HexString
  block: number
}

export interface RevokedCropAttestation {
  uid: HexString
  schema: HexString
  revision: number
  projectIds: string[]
  revokedTxHash: HexString
  revokedBlock: number
}

export interface CropAttestationLedger {
  network: AttestationNetwork
  attester: HexString
  /** Block of the earliest attestation - the default start for `--scan`. */
  firstBlock: number
  /**
   * Steady state is exactly one. More than one means an interrupted run or a
   * schema change; `l2b crops-attest` revokes the extras on its next run.
   */
  live: CropAttestation[]
  revoked: RevokedCropAttestation[]
}

export type CropAttestationLedgers = Partial<
  Record<AttestationNetwork, CropAttestationLedger>
>

/**
 * A cache of onchain state written by `l2b crops-attest --execute`, committed
 * so the API needs no RPC call. JSON cannot carry the hex and network literal
 * types, so it is asserted once here; `l2b crops-verify` checks it against
 * the chain.
 */
export const CROP_ATTESTATIONS = data as CropAttestationLedgers

/** Live and under the current schema. Anything else in `live` awaits revocation. */
export function getCurrentCropAttestation(
  network: AttestationNetwork,
): CropAttestation | undefined {
  return CROP_ATTESTATIONS[network]?.live.find(
    (x) => x.schema.toLowerCase() === ATTESTATION_SCHEMA_UID.toLowerCase(),
  )
}
