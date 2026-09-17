import data from './attestationData.json'

/** Typed so viem's `Hex` and `Address` accept these values without a cast. */
type HexString = `0x${string}`

export interface CropAttestation {
  uid: HexString
  /** Recorded because EAS only accepts a revocation naming the original schema. */
  schema: HexString
  /** Bumped every time the attested set changes. Starts at 1. */
  revision: number
  reviewedAt: number
  /** Sorted. */
  projectIds: string[]
  txHash: HexString
  block: number
}

export interface RevokedCropAttestation {
  uid: HexString
  schema: HexString
  revision: number
  projectIds: string[]
  revokedTxHash: HexString
  revokedBlock: number
}

/**
 * Where the crop attestations live and what is live there. Describes its own
 * network and schema so readers need nothing but this file.
 */
export interface CropAttestationLedger {
  /** EAS network name, e.g. sepolia. */
  network: string
  chainId: number
  isTestnet: boolean
  /** EAS contract address. */
  eas: HexString
  /** easscan host for the network, no trailing slash. */
  explorer: string
  /** The schema string and its uid as registered. Entries carry the uid they were attested under. */
  schema: string
  schemaUid: HexString
  /** The Safe that attests. Every write is executed by its owners. */
  attester: HexString
  /**
   * Steady state is exactly one. More than one means an interrupted run or a
   * schema change; `l2b crops-attest` plans the revocation of the extras.
   */
  live: CropAttestation[]
  revoked: RevokedCropAttestation[]
}

/**
 * A cache of onchain state written by `l2b crops-record`, committed so the
 * API needs no RPC call. JSON cannot carry the hex literal types, so it is
 * asserted once here; `l2b crops-verify` checks it against the chain.
 */
export const CROP_ATTESTATIONS = data as CropAttestationLedger
