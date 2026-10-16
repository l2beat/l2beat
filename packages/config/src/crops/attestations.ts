import type { CropAttestation } from '@l2beat/shared'

/** The Safe whose attestations count. */
export interface CropAttester {
  address: string
  /** Where the search for its attestations starts: the block it was deployed in. */
  sinceBlock: number
}

/**
 * Where the CROPS attestations are read from: EAS on Ethereum. Only the
 * attester's attestations count, and the newest wins: of those under the
 * schema that are not revoked, the highest revision names the current reviewed
 * set. The attester is set here and in the crops-attester repo's config.
 */
export interface CropAttestationSource {
  network: string
  chainId: number
  /** EAS contract address. */
  eas: string
  /** easscan host, no trailing slash. */
  explorer: string
  schema: string
  schemaUid: string
  /** Null until the attester Safe exists: then nothing counts as attested. */
  attester: CropAttester | null
}

export const CROP_ATTESTATION_SOURCE: CropAttestationSource = {
  network: 'ethereum',
  chainId: 1,
  eas: '0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587',
  explorer: 'https://easscan.org',
  schema: 'string[] projectIds,uint64 reviewedAt,uint32 revision',
  schemaUid:
    '0xbe00b10abb2fbae864b99c6ace4e0e622d5f690f822466e167353c32534dc3fb',
  attester: null,
}

/** The `attestations` stamp the CROPS API and the CROPS pages carry. */
export interface CropsAttestationsMeta {
  network: string
  chainId: number
  eas: string
  schemaUid: string
  schema: string
  /** Null until the attester Safe exists. */
  attester: string | null
  /** The attester's current attestation, or null before it has attested. */
  current: {
    uid: string
    revision: number
    /** Unix seconds. */
    reviewedAt: number
    /** Sorted. */
    projectIds: string[]
    txHash: string
    explorerUrl: string
  } | null
}

export function getCropsAttestationsMeta(
  current: CropAttestation | undefined,
): CropsAttestationsMeta {
  const source = CROP_ATTESTATION_SOURCE
  return {
    network: source.network,
    chainId: source.chainId,
    eas: source.eas,
    schemaUid: source.schemaUid,
    schema: source.schema,
    attester: source.attester?.address ?? null,
    current: current
      ? {
          uid: current.uid,
          revision: current.revision,
          reviewedAt: current.reviewedAt,
          projectIds: [...current.projectIds].sort(),
          txHash: current.txHash,
          explorerUrl: `${source.explorer}/attestation/view/${current.uid}`,
        }
      : null,
  }
}
