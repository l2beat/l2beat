import type { CropAttestation } from '@l2beat/config'
import {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_UID,
  CROP_ATTESTATIONS,
} from '@l2beat/config'

/** The `attestations` stamp every CROPS API file carries, as crops-api writes it. */
export interface CropsAttestationsMeta {
  network: string
  chainId: number
  isTestnet: boolean
  eas: string
  schemaUid: string
  schema: string
  /** Null until the first attestation is published. */
  attester: string | null
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

/** Reads the committed ledger for the configured network, so no RPC call is needed. */
export function getAttestationsMeta(): CropsAttestationsMeta {
  const network = ATTESTATION_NETWORKS[ATTESTATION_NETWORK]
  const ledger = CROP_ATTESTATIONS[ATTESTATION_NETWORK]
  const current = ledger?.live.find(isCurrentSchema)
  return {
    network: network.name,
    chainId: network.chainId,
    isTestnet: network.isTestnet,
    eas: network.eas,
    schemaUid: ATTESTATION_SCHEMA_UID,
    schema: ATTESTATION_SCHEMA,
    attester: ledger?.attester ?? null,
    current: current
      ? {
          uid: current.uid,
          revision: current.revision,
          reviewedAt: current.reviewedAt,
          projectIds: current.projectIds,
          txHash: current.txHash,
          explorerUrl: `${network.explorer}/attestation/view/${current.uid}`,
        }
      : null,
  }
}

/** Live and under the current schema. Anything else in `live` awaits revocation by l2b. */
function isCurrentSchema(attestation: CropAttestation): boolean {
  return (
    attestation.schema.toLowerCase() === ATTESTATION_SCHEMA_UID.toLowerCase()
  )
}
