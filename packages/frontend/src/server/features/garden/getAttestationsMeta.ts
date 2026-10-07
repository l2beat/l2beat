import { CROP_ATTESTATIONS } from '@l2beat/config'

/** The `attestations` stamp every CROPS API file carries, as crops-api writes it. */
export interface CropsAttestationsMeta {
  network: string
  chainId: number
  isTestnet: boolean
  eas: string
  schemaUid: string
  schema: string
  attester: string
  /** The live attestation naming the reviewed set, or null. */
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

/** Reads the committed ledger, so no RPC call is needed. */
export function getAttestationsMeta(): CropsAttestationsMeta {
  const ledger = CROP_ATTESTATIONS
  // Anything live under another schema awaits revocation by l2b. Case-insensitive: EAS returns uids in lowercase.
  const current = ledger.live.find(
    (x) => x.schema.toLowerCase() === ledger.schemaUid.toLowerCase(),
  )
  return {
    network: ledger.network,
    chainId: ledger.chainId,
    isTestnet: ledger.isTestnet,
    eas: ledger.eas,
    schemaUid: ledger.schemaUid,
    schema: ledger.schema,
    attester: ledger.attester,
    current: current
      ? {
          uid: current.uid,
          revision: current.revision,
          reviewedAt: current.reviewedAt,
          projectIds: current.projectIds,
          txHash: current.txHash,
          explorerUrl: `${ledger.explorer}/attestation/view/${current.uid}`,
        }
      : null,
  }
}
