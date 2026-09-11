import { CROPS } from '@l2beat/config'
import type { CropsAttestationsMeta } from '../schemas'

// Copied from the frontend until the garden helpers move into config.

const { getCropAttestationLedger, getCurrentCropAttestation } =
  CROPS.attestations
const {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_UID,
  getAttestationUrl,
} = CROPS.eas

/** Reads the committed ledger for the configured network, so no RPC call is needed. */
export function getAttestationsMeta(): CropsAttestationsMeta {
  const network = ATTESTATION_NETWORKS[ATTESTATION_NETWORK]
  const ledger = getCropAttestationLedger(ATTESTATION_NETWORK)
  const current = getCurrentCropAttestation(ATTESTATION_NETWORK)
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
          explorerUrl: getAttestationUrl(network, current.uid),
        }
      : null,
  }
}
