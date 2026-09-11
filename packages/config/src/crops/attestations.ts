import type {
  AttestationNetwork,
  AttestationNetworkConfig,
  CropAttestation,
  CropAttestationLedgers,
  CropAttestationSchema,
  CropAttestations,
} from '../types'
import ledgers from './attestationData.json'

/**
 * One attestation covers the whole reviewed set - the project ids, when they
 * were reviewed, and the revision. Ratings are deliberately not attested: they
 * change as protocols change, and the API serves them without a transaction.
 * While the attestations live on a testnet nothing here may name L2BEAT - see
 * the anonymity guard in packages/l2b.
 */
export const ATTESTATION_SCHEMA: CropAttestationSchema = {
  definition: [
    'string[] projectIds',
    'uint64 reviewedAt',
    'uint32 revision',
  ].join(','),
  resolver: '0x0000000000000000000000000000000000000000',
  revocable: true,
  // Hardcoded; attestations.test.ts recomputes it and fails if it drifts.
  uid: '0xbe00b10abb2fbae864b99c6ace4e0e622d5f690f822466e167353c32534dc3fb',
}

export const ATTESTATION_NETWORKS: Record<
  AttestationNetwork,
  AttestationNetworkConfig
> = {
  sepolia: {
    name: 'sepolia',
    chainId: 11155111,
    eas: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
    schemaRegistry: '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0',
    explorer: 'https://sepolia.easscan.org',
    isTestnet: true,
  },
  ethereum: {
    name: 'ethereum',
    chainId: 1,
    eas: '0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587',
    schemaRegistry: '0xA7b39296258348C78294F95B872b282326A97BDF',
    explorer: 'https://easscan.org',
    isTestnet: false,
  },
}

/** Moving to mainnet is a change here plus a fresh run of `l2b crops-attest`. */
export const ATTESTATION_NETWORK: AttestationNetwork = 'sepolia'

/**
 * Written by `l2b crops-attest --execute`. JSON cannot carry the hex and
 * network literal types, so it is asserted once here.
 */
export const CROP_ATTESTATIONS = ledgers as CropAttestationLedgers

/** What the build stores, so no reader needs the constants above. */
export function getCropAttestations(
  ledgers = CROP_ATTESTATIONS,
): CropAttestations {
  return {
    network: ATTESTATION_NETWORK,
    schema: ATTESTATION_SCHEMA,
    networks: ATTESTATION_NETWORKS,
    ledgers,
    current: getCurrentCropAttestation(ledgers, ATTESTATION_NETWORK),
  }
}

/** Live and under the current schema. Anything else in `live` awaits revocation. */
function getCurrentCropAttestation(
  ledgers: CropAttestationLedgers,
  network: AttestationNetwork,
): CropAttestation | undefined {
  return ledgers[network]?.live.find(
    (x) => x.schema.toLowerCase() === ATTESTATION_SCHEMA.uid.toLowerCase(),
  )
}
