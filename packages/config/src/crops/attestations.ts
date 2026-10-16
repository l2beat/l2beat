import type { CropAttestation } from '@l2beat/shared'

/**
 * Where the CROPS attestations are read from. Only the attester's attestations
 * count, and the newest wins: of those under the schema that are not revoked,
 * the highest revision names the current reviewed set. Changing the attester
 * or the network happens here and in the crops-attester repo's config.
 */
export interface CropAttestationSource {
  /** EAS network name, e.g. sepolia. */
  network: string
  chainId: number
  isTestnet: boolean
  /** EAS contract address. */
  eas: string
  /** easscan host for the network, no trailing slash. */
  explorer: string
  schema: string
  schemaUid: string
  /** The Safe whose attestations count. */
  attester: string
  /** Where the search for its attestations starts: the attester's deployment. */
  startBlock: number
}

export const CROP_ATTESTATION_SOURCE: CropAttestationSource = {
  network: 'sepolia',
  chainId: 11155111,
  isTestnet: true,
  eas: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
  explorer: 'https://sepolia.easscan.org',
  schema: 'string[] projectIds,uint64 reviewedAt,uint32 revision',
  schemaUid:
    '0xbe00b10abb2fbae864b99c6ace4e0e622d5f690f822466e167353c32534dc3fb',
  attester: '0x19BEC50A4e61B0e1540C37cEB3F62f56AAfb74DB',
  startBlock: 11920203,
}

/** The `attestations` stamp the CROPS API and the CROPS pages carry. */
export interface CropsAttestationsMeta {
  network: string
  chainId: number
  isTestnet: boolean
  eas: string
  schemaUid: string
  schema: string
  attester: string
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
    isTestnet: source.isTestnet,
    eas: source.eas,
    schemaUid: source.schemaUid,
    schema: source.schema,
    attester: source.attester,
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
