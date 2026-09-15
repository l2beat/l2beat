import type { Address, Hex } from 'viem'

// The EAS deployment l2b attests on. Config's ledger repeats what readers
// need (network, schema, uid); this is where those values are decided.

/**
 * One attestation covers the whole reviewed set - the project ids, when they
 * were reviewed, and the revision. Ratings are deliberately not attested: they
 * change as protocols change, and the API serves them without a transaction.
 * While the attestations live on a testnet nothing here may name L2BEAT - see
 * anonymity.ts.
 */
export const ATTESTATION_SCHEMA =
  'string[] projectIds,uint64 reviewedAt,uint32 revision'

export const ATTESTATION_SCHEMA_RESOLVER: Address =
  '0x0000000000000000000000000000000000000000'

export const ATTESTATION_SCHEMA_REVOCABLE = true

/** keccak256(abi.encodePacked(schema, resolver, revocable)), as SchemaRegistry computes it. Pinned by crops.test.ts. */
export const ATTESTATION_SCHEMA_UID: Hex =
  '0xbe00b10abb2fbae864b99c6ace4e0e622d5f690f822466e167353c32534dc3fb'

export const ATTESTATION_NETWORK_NAMES = ['sepolia', 'ethereum'] as const
export type AttestationNetwork = (typeof ATTESTATION_NETWORK_NAMES)[number]

export interface AttestationNetworkConfig {
  name: AttestationNetwork
  chainId: number
  eas: Address
  schemaRegistry: Address
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
