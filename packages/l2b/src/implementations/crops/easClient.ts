import type {
  AttestationNetworkConfig,
  CropAttestationSchema,
} from '@l2beat/config'
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

/** The contracts of one network and the schema the set is attested under. */
export interface EasTarget {
  network: AttestationNetworkConfig
  schema: CropAttestationSchema
}

export const ZERO_UID: Hex = `0x${'0'.repeat(64)}`
export const ZERO_ADDRESS: Address =
  '0x0000000000000000000000000000000000000000'

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

export interface NewAttestation {
  refUID: Hex
  data: Hex
}

/** EAS only accepts a revocation naming the schema the uid was attested under. */
export interface Revocation {
  uid: Hex
  schema: Hex
}

export function getAttestationUrl(
  network: AttestationNetworkConfig,
  uid: string,
): string {
  return `${network.explorer}/attestation/view/${uid}`
}

export function getSchemaUrl(target: EasTarget): string {
  return `${target.network.explorer}/schema/view/${target.schema.uid}`
}

export function createReader(rpcUrl: string): PublicClient {
  return createPublicClient({ transport: http(rpcUrl) })
}

// The key never comes from a flag, which would land it in shell history. On a
// testnet it should be a throwaway EOA with no link to L2BEAT.
export function createSigner(rpcUrl: string): WalletClient {
  const key = process.env.L2B_CROPS_PRIVATE_KEY
  if (!key) {
    throw new Error(
      'L2B_CROPS_PRIVATE_KEY is not set. Export the attester key in the shell you run this from - it is deliberately not a command line flag, so it never lands in shell history.',
    )
  }
  return createWalletClient({
    account: privateKeyToAccount(
      key.startsWith('0x') ? (key as Hex) : `0x${key}`,
    ),
    transport: http(rpcUrl),
  })
}

export async function isSchemaRegistered(
  reader: PublicClient,
  target: EasTarget,
): Promise<boolean> {
  const record = await reader.readContract({
    address: target.network.schemaRegistry,
    abi: SCHEMA_REGISTRY_ABI,
    functionName: 'getSchema',
    args: [target.schema.uid],
  })
  return record.uid !== ZERO_UID
}

export async function registerSchema(
  signer: WalletClient,
  target: EasTarget,
): Promise<Hex> {
  return await signer.writeContract({
    chain: null,
    account: signer.account ?? null,
    address: target.network.schemaRegistry,
    abi: SCHEMA_REGISTRY_ABI,
    functionName: 'register',
    args: [
      target.schema.definition,
      target.schema.resolver,
      target.schema.revocable,
    ],
  })
}

export async function getAttestation(
  reader: PublicClient,
  target: EasTarget,
  uid: Hex,
): Promise<OnchainAttestation | undefined> {
  const result = await reader.readContract({
    address: target.network.eas,
    abi: EAS_ABI,
    functionName: 'getAttestation',
    args: [uid],
  })
  if (result.uid === ZERO_UID) {
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

// No recipient (the subject is a protocol, not an account) and no expiry
// (revocation is the only way an attestation stops being valid).
function multiAttestArgs(schemaUid: Hex, attestations: NewAttestation[]) {
  return [
    [
      {
        schema: schemaUid,
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

// EAS groups revocations by schema.
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

export async function multiAttest(
  signer: WalletClient,
  target: EasTarget,
  attestations: NewAttestation[],
): Promise<Hex> {
  return await signer.writeContract({
    chain: null,
    account: signer.account ?? null,
    address: target.network.eas,
    abi: EAS_ABI,
    functionName: 'multiAttest',
    args: multiAttestArgs(target.schema.uid, attestations),
  })
}

export async function multiRevoke(
  signer: WalletClient,
  target: EasTarget,
  revocations: Revocation[],
): Promise<Hex> {
  return await signer.writeContract({
    chain: null,
    account: signer.account ?? null,
    address: target.network.eas,
    abi: EAS_ABI,
    functionName: 'multiRevoke',
    args: multiRevokeArgs(revocations),
  })
}

export async function estimateGas(
  reader: PublicClient,
  target: EasTarget,
  account: Address,
  work: { attestations: NewAttestation[]; revoke: Revocation[] },
): Promise<bigint> {
  let total = 0n
  if (work.revoke.length > 0) {
    total += await reader.estimateContractGas({
      account,
      address: target.network.eas,
      abi: EAS_ABI,
      functionName: 'multiRevoke',
      args: multiRevokeArgs(work.revoke),
    })
  }
  if (work.attestations.length > 0) {
    total += await reader.estimateContractGas({
      account,
      address: target.network.eas,
      abi: EAS_ABI,
      functionName: 'multiAttest',
      args: multiAttestArgs(target.schema.uid, work.attestations),
    })
  }
  return total
}

/** EAS emits one Attested event per attestation, in submission order. */
export function readAttestedUids(logs: Log[]): Hex[] {
  return parseEventLogs({ abi: EAS_ABI, eventName: 'Attested', logs }).map(
    (log) => log.args.uid,
  )
}

/** attester and schemaUID are both indexed on Attested, so eth_getLogs is enough. */
export async function scanAttestedUids(
  reader: PublicClient,
  target: EasTarget,
  attester: Address,
  fromBlock: bigint,
): Promise<Hex[]> {
  const logs = await reader.getLogs({
    address: target.network.eas,
    event: ATTESTED_EVENT,
    args: { attester, schemaUID: target.schema.uid },
    fromBlock,
    toBlock: 'latest',
  })
  return logs.map((log) => log.args.uid).filter((uid): uid is Hex => !!uid)
}
