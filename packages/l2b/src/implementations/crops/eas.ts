import {
  type Address,
  type Chain,
  createPublicClient,
  createWalletClient,
  decodeAbiParameters,
  encodeAbiParameters,
  type Hex,
  http,
  type Log,
  type PublicClient,
  parseAbi,
  parseAbiParameters,
  parseEventLogs,
  publicActions,
  zeroAddress,
  zeroHash,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet, sepolia } from 'viem/chains'
import {
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
  type AttestationNetwork,
  type AttestationNetworkConfig,
} from './easConfig'

const CHAINS: Record<AttestationNetwork, Chain> = { sepolia, ethereum: mainnet }

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

export const SCHEMA_REGISTRY_ABI = parseAbi([
  'struct SchemaRecord { bytes32 uid; address resolver; bool revocable; string schema; }',
  'function register(string schema, address resolver, bool revocable) returns (bytes32)',
  'function getSchema(bytes32 uid) view returns (SchemaRecord)',
])

/** Parsed from the one schema string config registers, so the codec cannot disagree with it. */
export const ATTESTATION_PARAMS = parseAbiParameters(ATTESTATION_SCHEMA)

/** Case-insensitive: EAS returns uids in lowercase, config may not. */
export function isCurrentSchema(schema: string): boolean {
  return schema.toLowerCase() === ATTESTATION_SCHEMA_UID.toLowerCase()
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

export interface CropPayload {
  /** Sorted. */
  projectIds: string[]
  reviewedAt: number
  revision: number
}

export function encodePayload(payload: CropPayload): Hex {
  return encodeAbiParameters(ATTESTATION_PARAMS, [
    payload.projectIds,
    BigInt(payload.reviewedAt),
    payload.revision,
  ])
}

export function decodePayload(data: Hex): CropPayload {
  const [projectIds, reviewedAt, revision] = decodeAbiParameters(
    ATTESTATION_PARAMS,
    data,
  )
  return {
    projectIds: [...projectIds],
    reviewedAt: Number(reviewedAt),
    revision: Number(revision),
  }
}

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

/**
 * With the chain object viem supplies a public rpc when none is given and
 * checks the rpc's chain id before every write.
 */
export function createReader(
  network: AttestationNetworkConfig,
  rpcUrl?: string,
): PublicClient {
  return createPublicClient({
    chain: CHAINS[network.name],
    transport: http(rpcUrl),
  })
}

/** Signs and simulates: every write is dry-run against the node before it is sent. */
export function createSigner(
  network: AttestationNetworkConfig,
  privateKey: Hex,
  rpcUrl?: string,
) {
  return createWalletClient({
    chain: CHAINS[network.name],
    account: privateKeyToAccount(privateKey),
    transport: http(rpcUrl),
  }).extend(publicActions)
}

export type Signer = ReturnType<typeof createSigner>

export async function isSchemaRegistered(
  reader: PublicClient,
  network: AttestationNetworkConfig,
): Promise<boolean> {
  const record = await reader.readContract({
    address: network.schemaRegistry,
    abi: SCHEMA_REGISTRY_ABI,
    functionName: 'getSchema',
    args: [ATTESTATION_SCHEMA_UID],
  })
  return record.uid !== zeroHash
}

export async function registerSchema(
  signer: Signer,
  network: AttestationNetworkConfig,
): Promise<Hex> {
  const { request } = await signer.simulateContract({
    address: network.schemaRegistry,
    abi: SCHEMA_REGISTRY_ABI,
    functionName: 'register',
    args: [
      ATTESTATION_SCHEMA,
      ATTESTATION_SCHEMA_RESOLVER,
      ATTESTATION_SCHEMA_REVOCABLE,
    ],
  })
  return await signer.writeContract(request)
}

export async function getAttestation(
  reader: PublicClient,
  network: AttestationNetworkConfig,
  uid: Hex,
): Promise<OnchainAttestation | undefined> {
  const result = await reader.readContract({
    address: network.eas,
    abi: EAS_ABI,
    functionName: 'getAttestation',
    args: [uid],
  })
  if (result.uid === zeroHash) {
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

/** By uid; a uid EAS does not know is simply absent. */
export async function getAttestations(
  reader: PublicClient,
  network: AttestationNetworkConfig,
  uids: Hex[],
): Promise<Map<Hex, OnchainAttestation>> {
  const found = new Map<Hex, OnchainAttestation>()
  for (const uid of uids) {
    const attestation = await getAttestation(reader, network, uid)
    if (attestation) {
      found.set(uid, attestation)
    }
  }
  return found
}

// No recipient (the subject is a protocol, not an account) and no expiry
// (revocation is the only way an attestation stops being valid).
function multiAttestArgs(attestations: NewAttestation[]) {
  return [
    [
      {
        schema: ATTESTATION_SCHEMA_UID,
        data: attestations.map((attestation) => ({
          recipient: zeroAddress,
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

/** EAS groups revocations by schema. */
export function multiRevokeArgs(revocations: Revocation[]) {
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
  signer: Signer,
  network: AttestationNetworkConfig,
  attestations: NewAttestation[],
): Promise<Hex> {
  const { request } = await signer.simulateContract({
    address: network.eas,
    abi: EAS_ABI,
    functionName: 'multiAttest',
    args: multiAttestArgs(attestations),
  })
  return await signer.writeContract(request)
}

export async function multiRevoke(
  signer: Signer,
  network: AttestationNetworkConfig,
  revocations: Revocation[],
): Promise<Hex> {
  const { request } = await signer.simulateContract({
    address: network.eas,
    abi: EAS_ABI,
    functionName: 'multiRevoke',
    args: multiRevokeArgs(revocations),
  })
  return await signer.writeContract(request)
}

/** EAS emits one Attested event per attestation, in submission order. */
export function readAttestedUids(logs: Log[]): Hex[] {
  return parseEventLogs({ abi: EAS_ABI, eventName: 'Attested', logs }).map(
    (log) => log.args.uid,
  )
}
