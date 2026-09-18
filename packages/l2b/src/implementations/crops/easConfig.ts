import type { Address, Hex } from 'viem'
import config from './crops.config.json'

// Where l2b attests and as whom. Every value comes from crops.config.json so
// there is one file to edit and one file to read; this module only gives it
// types and names. Config's ledger repeats what readers of the API need
// (network, schema, uid); this is where those values are decided.

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

/**
 * One attestation covers the whole garden set - the project ids, when they
 * were reviewed, and the revision. Ratings are deliberately not attested: they
 * change as protocols change, and the API serves them without a transaction.
 * While the attestations live on a testnet nothing here may name L2BEAT - see
 * anonymity.ts.
 */
const SCHEMA_DEFINITION =
  'string[] projectIds,uint64 reviewedAt,uint32 revision' as const

/**
 * Spelled out here, not read from the config file, because viem derives the
 * payload's TypeScript types from this literal and a value read from JSON is
 * only `string`. The config file carries it too, as the thing a reader looks
 * up, and the check below refuses to load if the two ever disagree.
 */
export const ATTESTATION_SCHEMA = SCHEMA_DEFINITION

if (config.schema.definition !== SCHEMA_DEFINITION) {
  throw new Error(
    `crops.config.json says the schema is "${config.schema.definition}" but the codec is built for "${SCHEMA_DEFINITION}". Change both, and re-register the schema: a different string is a different schema uid.`,
  )
}

export const ATTESTATION_SCHEMA_RESOLVER = config.schema.resolver as Address

export const ATTESTATION_SCHEMA_REVOCABLE: boolean = config.schema.revocable

/** keccak256(abi.encodePacked(schema, resolver, revocable)), as SchemaRegistry computes it. Pinned by crops.test.ts. */
export const ATTESTATION_SCHEMA_UID = config.schema.uid as Hex

export const ATTESTATION_NETWORKS: Record<
  AttestationNetwork,
  AttestationNetworkConfig
> = Object.fromEntries(
  ATTESTATION_NETWORK_NAMES.map((name) => [
    name,
    {
      name,
      ...config.networks[name],
      eas: config.networks[name].eas as Address,
      schemaRegistry: config.networks[name].schemaRegistry as Address,
    },
  ]),
) as Record<AttestationNetwork, AttestationNetworkConfig>

/** Moving to mainnet is a change to crops.config.json plus a fresh run of `l2b crops-attest`. */
export const ATTESTATION_NETWORK = config.network as AttestationNetwork

/**
 * The Safe that attests. Every write is built as calldata for this address and
 * executed by its owners through the Safe UI: l2b holds no key and sends no
 * transaction.
 *
 * The Safe is the `attester` EAS records, so changing it orphans every
 * attestation the previous one made - EAS only lets the original attester
 * revoke. See README.md.
 */
export const ATTESTATION_SAFE = (config.safe || undefined) as
  | Address
  | undefined

/** The default rpc; viem's public fallback does not serve every network. */
export const ATTESTATION_RPC_URL: string | undefined =
  config.rpcUrl || undefined
