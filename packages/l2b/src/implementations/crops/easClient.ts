import type { AttestationNetworkConfig } from '@l2beat/config/build/crops/eas'
import {
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
} from '@l2beat/config/build/crops/eas'
import {
  type Address,
  createPublicClient,
  createWalletClient,
  type Hex,
  http,
  type Log,
  type PublicClient,
  parseAbi,
  parseAbiItem,
  parseEventLogs,
  type WalletClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

export const EAS_ABI = parseAbi([
  'struct AttestationRequestData { address recipient; uint64 expirationTime; bool revocable; bytes32 refUID; bytes data; uint256 value; }',
  'struct MultiAttestationRequest { bytes32 schema; AttestationRequestData[] data; }',
  'struct RevocationRequestData { bytes32 uid; uint256 value; }',
  'struct MultiRevocationRequest { bytes32 schema; RevocationRequestData[] data; }',
  'struct Attestation { bytes32 uid; bytes32 schema; uint64 time; uint64 expirationTime; uint64 revocationTime; bytes32 refUID; address recipient; address attester; bool revocable; bytes data; }',
  'function multiAttest(MultiAttestationRequest[] multiRequests) payable returns (bytes32[])',
  'function multiRevoke(MultiRevocationRequest[] multiRequests) payable',
  'function getAttestation(bytes32 uid) view returns (Attestation)',
  'event Attested(address indexed recipient, address indexed attester, bytes32 uid, bytes32 indexed schemaUID)',
])

export const ATTESTED_EVENT = parseAbiItem(
  'event Attested(address indexed recipient, address indexed attester, bytes32 uid, bytes32 indexed schemaUID)',
)

export const SCHEMA_REGISTRY_ABI = parseAbi([
  'struct SchemaRecord { bytes32 uid; address resolver; bool revocable; string schema; }',
  'function register(string schema, address resolver, bool revocable) returns (bytes32)',
  'function getSchema(bytes32 uid) view returns (SchemaRecord)',
])

export interface OnchainAttestation {
  uid: Hex
  schema: Hex
  attester: Address
  time: number
  revocationTime: number
  refUID: Hex
  data: Hex
}

export function createReader(rpcUrl: string): PublicClient {
  return createPublicClient({ transport: http(rpcUrl) })
}

/**
 * The signer. The key never comes from a flag - it would end up in shell
 * history - and while attesting on a testnet this should be a throwaway EOA
 * funded from a faucet, never an address associated with L2BEAT.
 */
export function hasAttesterKey(): boolean {
  return !!process.env.L2B_CROPS_PRIVATE_KEY
}

export function createSigner(rpcUrl: string): WalletClient {
  const key = process.env.L2B_CROPS_PRIVATE_KEY
  if (!key) {
    throw new Error(
      'L2B_CROPS_PRIVATE_KEY is not set. Export the attester key in the environment; it is deliberately not a command line flag.',
    )
  }
  return createWalletClient({
    account: privateKeyToAccount(
      (key.startsWith('0x') ? key : `0x${key}`) as Hex,
    ),
    transport: http(rpcUrl),
  })
}

export async function isSchemaRegistered(
  reader: PublicClient,
  network: AttestationNetworkConfig,
): Promise<boolean> {
  const record = await reader.readContract({
    address: network.schemaRegistry as Address,
    abi: SCHEMA_REGISTRY_ABI,
    functionName: 'getSchema',
    args: [ATTESTATION_SCHEMA_UID as Hex],
  })
  return record.uid !== `0x${'0'.repeat(64)}`
}

export async function registerSchema(
  signer: WalletClient,
  network: AttestationNetworkConfig,
): Promise<Hex> {
  return await signer.writeContract({
    chain: null,
    account: signer.account ?? null,
    address: network.schemaRegistry as Address,
    abi: SCHEMA_REGISTRY_ABI,
    functionName: 'register',
    args: [
      ATTESTATION_SCHEMA,
      ATTESTATION_SCHEMA_RESOLVER as Address,
      ATTESTATION_SCHEMA_REVOCABLE,
    ],
  })
}

export async function getAttestation(
  reader: PublicClient,
  network: AttestationNetworkConfig,
  uid: Hex,
): Promise<OnchainAttestation | undefined> {
  const result = await reader.readContract({
    address: network.eas as Address,
    abi: EAS_ABI,
    functionName: 'getAttestation',
    args: [uid],
  })
  if (result.uid === `0x${'0'.repeat(64)}`) {
    return undefined
  }
  return {
    uid: result.uid,
    schema: result.schema,
    attester: result.attester,
    time: Number(result.time),
    revocationTime: Number(result.revocationTime),
    refUID: result.refUID,
    data: result.data,
  }
}

export interface NewAttestation {
  refUID: Hex
  data: Hex
}

/**
 * EAS checks the schema a revocation request names against the attestation's
 * own schema, so a uid attested under an earlier schema can only be revoked by
 * naming that schema. Carrying it here is what makes a schema change a
 * migration we can run rather than a set of orphans onchain.
 */
export interface Revocation {
  uid: Hex
  schema: Hex
}

export const ZERO_UID = `0x${'0'.repeat(64)}` as Hex
export const ZERO_ADDRESS =
  '0x0000000000000000000000000000000000000000' as Address

/**
 * recipient is the zero address because the subject is a protocol rather than an
 * account, and expirationTime is zero because revocation is the only way an
 * attestation stops being valid.
 */
function multiAttestArgs(attestations: NewAttestation[]) {
  return [
    [
      {
        schema: ATTESTATION_SCHEMA_UID as Hex,
        data: attestations.map((attestation) => ({
          recipient: ZERO_ADDRESS,
          expirationTime: 0n,
          revocable: true,
          refUID: attestation.refUID,
          data: attestation.data,
          value: 0n,
        })),
      },
    ],
  ] as const
}

/** One request per schema, since EAS groups revocations by schema. */
function multiRevokeArgs(revocations: Revocation[]) {
  const bySchema = new Map<Hex, Hex[]>()
  for (const revocation of revocations) {
    const uids = bySchema.get(revocation.schema) ?? []
    uids.push(revocation.uid)
    bySchema.set(revocation.schema, uids)
  }
  return [
    [...bySchema].map(([schema, uids]) => ({
      schema,
      data: uids.map((uid) => ({ uid, value: 0n })),
    })),
  ] as const
}

/** One transaction for every project. */
export async function multiAttest(
  signer: WalletClient,
  network: AttestationNetworkConfig,
  attestations: NewAttestation[],
): Promise<Hex> {
  return await signer.writeContract({
    chain: null,
    account: signer.account ?? null,
    address: network.eas as Address,
    abi: EAS_ABI,
    functionName: 'multiAttest',
    args: multiAttestArgs(attestations),
  })
}

export async function multiRevoke(
  signer: WalletClient,
  network: AttestationNetworkConfig,
  revocations: Revocation[],
): Promise<Hex> {
  return await signer.writeContract({
    chain: null,
    account: signer.account ?? null,
    address: network.eas as Address,
    abi: EAS_ABI,
    functionName: 'multiRevoke',
    args: multiRevokeArgs(revocations),
  })
}

export async function estimateGas(
  reader: PublicClient,
  network: AttestationNetworkConfig,
  account: Address,
  work: { attestations: NewAttestation[]; revoke: Revocation[] },
): Promise<bigint> {
  let total = 0n
  if (work.revoke.length > 0) {
    total += await reader.estimateContractGas({
      account,
      address: network.eas as Address,
      abi: EAS_ABI,
      functionName: 'multiRevoke',
      args: multiRevokeArgs(work.revoke),
    })
  }
  if (work.attestations.length > 0) {
    total += await reader.estimateContractGas({
      account,
      address: network.eas as Address,
      abi: EAS_ABI,
      functionName: 'multiAttest',
      args: multiAttestArgs(work.attestations),
    })
  }
  return total
}

/**
 * EAS emits one Attested event per attestation, in the order they were
 * submitted, so the receipt is enough to recover the new uids without a
 * follow-up query.
 */
export function readAttestedUids(logs: Log[]): Hex[] {
  return parseEventLogs({ abi: EAS_ABI, eventName: 'Attested', logs }).map(
    (log) => log.args.uid,
  )
}

/**
 * Full reconciliation without an external indexer: attester and schemaUID are
 * both indexed on Attested, so eth_getLogs is enough.
 */
export async function scanAttestedUids(
  reader: PublicClient,
  network: AttestationNetworkConfig,
  attester: Address,
  fromBlock: bigint,
): Promise<Hex[]> {
  const logs = await reader.getLogs({
    address: network.eas as Address,
    event: ATTESTED_EVENT,
    args: { attester, schemaUID: ATTESTATION_SCHEMA_UID as Hex },
    fromBlock,
    toBlock: 'latest',
  })
  return logs.map((log) => log.args.uid).filter((uid): uid is Hex => !!uid)
}
