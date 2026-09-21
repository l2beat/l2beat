import {
  BigNumber,
  Contract,
  constants,
  providers,
  utils,
  Wallet,
} from 'ethers'
import {
  type Address,
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_RESOLVER,
  ATTESTATION_SCHEMA_REVOCABLE,
  ATTESTATION_SCHEMA_UID,
  type AttestationNetworkConfig,
  type Hex,
} from './easConfig'

export const EAS_ABI = [
  'function multiAttest(tuple(bytes32 schema, tuple(address recipient, uint64 expirationTime, bool revocable, bytes32 refUID, bytes data, uint256 value)[] data)[] multiRequests) payable returns (bytes32[])',
  'function multiRevoke(tuple(bytes32 schema, tuple(bytes32 uid, uint256 value)[] data)[] multiRequests) payable',
  'function getAttestation(bytes32 uid) view returns (tuple(bytes32 uid, bytes32 schema, uint64 time, uint64 expirationTime, uint64 revocationTime, bytes32 refUID, address recipient, address attester, bool revocable, bytes data))',
  'event Attested(address indexed recipient, address indexed attester, bytes32 uid, bytes32 indexed schemaUID)',
]

export const SCHEMA_REGISTRY_ABI = [
  'function register(string schema, address resolver, bool revocable) returns (bytes32)',
  'function getSchema(bytes32 uid) view returns (tuple(bytes32 uid, address resolver, bool revocable, string schema))',
]

/** Parsed from the one schema string config registers, so the codec cannot disagree with it. */
export const ATTESTATION_PARAM_TYPES = ATTESTATION_SCHEMA.split(',').map(
  (param) => param.trim().split(' ')[0],
)

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
  return utils.defaultAbiCoder.encode(ATTESTATION_PARAM_TYPES, [
    payload.projectIds,
    payload.reviewedAt,
    payload.revision,
  ]) as Hex
}

export function decodePayload(data: Hex): CropPayload {
  const [projectIds, reviewedAt, revision] = utils.defaultAbiCoder.decode(
    ATTESTATION_PARAM_TYPES,
    data,
  )
  return {
    projectIds: [...projectIds],
    reviewedAt: BigNumber.from(reviewedAt).toNumber(),
    revision: BigNumber.from(revision).toNumber(),
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
 * Given the chain id, ethers refuses every call once the rpc reports a
 * different network, so a wrong --rpc-url cannot write to the wrong chain.
 */
export function createReader(
  network: AttestationNetworkConfig,
  rpcUrl?: string,
): providers.JsonRpcProvider {
  return new providers.JsonRpcProvider(
    rpcUrl ?? network.publicRpc,
    network.chainId,
  )
}

/** Every write is gas-estimated against the node first, which reverts before anything is sent. */
export function createSigner(
  network: AttestationNetworkConfig,
  privateKey: Hex,
  rpcUrl?: string,
): Signer {
  return new Wallet(privateKey, createReader(network, rpcUrl))
}

export type Signer = Wallet

export async function isSchemaRegistered(
  reader: providers.JsonRpcProvider,
  network: AttestationNetworkConfig,
): Promise<boolean> {
  const registry = new Contract(
    network.schemaRegistry,
    SCHEMA_REGISTRY_ABI,
    reader,
  )
  const record = await registry.getSchema(ATTESTATION_SCHEMA_UID)
  return record.uid !== constants.HashZero
}

export async function registerSchema(
  signer: Signer,
  network: AttestationNetworkConfig,
): Promise<Hex> {
  const registry = new Contract(
    network.schemaRegistry,
    SCHEMA_REGISTRY_ABI,
    signer,
  )
  const tx = await registry.register(
    ATTESTATION_SCHEMA,
    ATTESTATION_SCHEMA_RESOLVER,
    ATTESTATION_SCHEMA_REVOCABLE,
  )
  return tx.hash
}

export async function getAttestation(
  reader: providers.JsonRpcProvider,
  network: AttestationNetworkConfig,
  uid: Hex,
): Promise<OnchainAttestation | undefined> {
  const eas = new Contract(network.eas, EAS_ABI, reader)
  const result = await eas.getAttestation(uid)
  if (result.uid === constants.HashZero) {
    return undefined
  }
  return {
    uid: result.uid,
    schema: result.schema,
    attester: result.attester,
    time: BigNumber.from(result.time).toNumber(),
    revocationTime: BigNumber.from(result.revocationTime).toNumber(),
    refUID: result.refUID,
    data: result.data,
  }
}

/** By uid; a uid EAS does not know is simply absent. */
export async function getAttestations(
  reader: providers.JsonRpcProvider,
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

interface MultiAttestationRequest {
  schema: Hex
  data: {
    recipient: Address
    expirationTime: number
    revocable: boolean
    refUID: Hex
    data: Hex
    value: number
  }[]
}

interface MultiRevocationRequest {
  schema: Hex
  data: { uid: Hex; value: number }[]
}

// No recipient (the subject is a protocol, not an account) and no expiry
// (revocation is the only way an attestation stops being valid).
function multiAttestArgs(
  attestations: NewAttestation[],
): [MultiAttestationRequest[]] {
  return [
    [
      {
        schema: ATTESTATION_SCHEMA_UID,
        data: attestations.map((attestation) => ({
          recipient: constants.AddressZero as Address,
          expirationTime: 0,
          revocable: true,
          refUID: attestation.refUID,
          data: attestation.data,
          value: 0,
        })),
      },
    ],
  ]
}

/** EAS groups revocations by schema. */
export function multiRevokeArgs(
  revocations: Revocation[],
): [MultiRevocationRequest[]] {
  const bySchema = new Map<Hex, Hex[]>()
  for (const revocation of revocations) {
    const uids = bySchema.get(revocation.schema) ?? []
    uids.push(revocation.uid)
    bySchema.set(revocation.schema, uids)
  }
  return [
    [...bySchema].map(([schema, uids]) => ({
      schema,
      data: uids.map((uid) => ({ uid, value: 0 })),
    })),
  ]
}

export async function multiAttest(
  signer: Signer,
  network: AttestationNetworkConfig,
  attestations: NewAttestation[],
): Promise<Hex> {
  const eas = new Contract(network.eas, EAS_ABI, signer)
  const tx = await eas.multiAttest(...multiAttestArgs(attestations))
  return tx.hash
}

export async function multiRevoke(
  signer: Signer,
  network: AttestationNetworkConfig,
  revocations: Revocation[],
): Promise<Hex> {
  const eas = new Contract(network.eas, EAS_ABI, signer)
  const tx = await eas.multiRevoke(...multiRevokeArgs(revocations))
  return tx.hash
}

/** EAS emits one Attested event per attestation, in submission order. */
export function readAttestedUids(logs: providers.Log[]): Hex[] {
  const eas = new utils.Interface(EAS_ABI)
  const attested = eas.getEventTopic('Attested')
  return logs
    .filter((log) => log.topics[0] === attested)
    .map((log) => eas.parseLog(log).args.uid)
}
