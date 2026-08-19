// Ethereum Attestation Service constants for the crop attestations.
//
// Dependency-free on purpose - this file is deep-imported by the frontend, so
// the schema UID is hardcoded rather than computed. `l2b crops-schema` and the
// unit test in packages/l2b recompute it from ATTESTATION_SCHEMA and fail if the
// two ever disagree.

/**
 * The schema registered in the EAS SchemaRegistry.
 *
 * One attestation covers the whole reviewed set: the project ids we stand
 * behind, when we last reviewed them, and which revision of the set this is.
 * Nothing else. A consumer reads it once and then asks the API about each id -
 * ratings, the reasoning behind each crop, and the tooltip copy all live there,
 * where they can be corrected without a transaction.
 *
 * That is deliberate. Ratings move as protocols change; membership of the set
 * moves far less. Attesting only the membership means the onchain record stays
 * true for longer, and the one claim it does make - "we have reviewed these" -
 * is the claim a wallet or a badge actually needs.
 *
 * Revocable, because the set changes: adding or removing a project revokes this
 * attestation and issues the next revision.
 *
 * Nothing here names L2BEAT, and nothing may be added that does while the
 * attestations live on a testnet - see the anonymity guard in packages/l2b.
 */
export const ATTESTATION_SCHEMA = [
  'string[] projectIds',
  'uint64 reviewedAt',
  'uint32 revision',
].join(',')

/** No resolver contract - we register the schema and nothing else. */
export const ATTESTATION_SCHEMA_RESOLVER =
  '0x0000000000000000000000000000000000000000'

/** The attested set changes, so attestations must be revocable. */
export const ATTESTATION_SCHEMA_REVOCABLE = true

/**
 * keccak256(abi.encodePacked(schema, resolver, revocable)), as SchemaRegistry
 * computes it. Identical on every network, since the inputs are.
 */
export const ATTESTATION_SCHEMA_UID =
  '0xbe00b10abb2fbae864b99c6ace4e0e622d5f690f822466e167353c32534dc3fb'

export type AttestationNetwork = 'sepolia' | 'ethereum'

export interface AttestationNetworkConfig {
  name: AttestationNetwork
  chainId: number
  /** The canonical EAS contract. */
  eas: string
  /** The canonical SchemaRegistry contract. */
  schemaRegistry: string
  /** Explorer base url, without a trailing slash. */
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

/**
 * Where attestations are published today. Testnet until the framework is ready
 * to make production claims onchain; moving to mainnet is a change here plus a
 * fresh run of `l2b crops-attest`.
 */
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
