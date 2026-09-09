// Deep-imported by the frontend, so kept dependency-free: the schema uid is
// hardcoded here and recomputed by the l2b tests, which fail if it drifts.

/**
 * One attestation covers the whole reviewed set - the project ids, when they
 * were reviewed, and the revision. Ratings are deliberately not attested: they
 * change as protocols change, and the API serves them without a transaction.
 * While the attestations live on a testnet nothing here may name L2BEAT - see
 * the anonymity guard in packages/l2b.
 */
export const ATTESTATION_SCHEMA = [
  'string[] projectIds',
  'uint64 reviewedAt',
  'uint32 revision',
].join(',')

export const ATTESTATION_SCHEMA_RESOLVER =
  '0x0000000000000000000000000000000000000000'

export const ATTESTATION_SCHEMA_REVOCABLE = true

/** keccak256(abi.encodePacked(schema, resolver, revocable)), as SchemaRegistry computes it. */
export const ATTESTATION_SCHEMA_UID =
  '0xbe00b10abb2fbae864b99c6ace4e0e622d5f690f822466e167353c32534dc3fb'

export type AttestationNetwork = 'sepolia' | 'ethereum'

export interface AttestationNetworkConfig {
  name: AttestationNetwork
  chainId: number
  eas: string
  schemaRegistry: string
  explorer: string
  isTestnet: boolean
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

export function getAttestationNetwork(
  name: string,
): AttestationNetworkConfig | undefined {
  return ATTESTATION_NETWORKS[name as AttestationNetwork]
}

export function getAttestationUrl(
  network: AttestationNetworkConfig,
  uid: string,
): string {
  return `${network.explorer}/attestation/view/${uid}`
}

export function getSchemaUrl(network: AttestationNetworkConfig): string {
  return `${network.explorer}/schema/view/${ATTESTATION_SCHEMA_UID}`
}
