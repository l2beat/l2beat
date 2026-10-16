import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { CallParameters, EVMLog } from '../../clients/rpc/types'
import type { LogsTopicFilter } from '../../clients/types'

/** Where the attestations are read from. */
export interface CropAttestationSourceParams {
  eas: string
  /** The EAS schema definition, e.g. `string[] projectIds,uint64 reviewedAt,uint32 revision`. */
  schema: string
  schemaUid: string
  attester: string
  startBlock: number
}

export interface CropAttestation {
  uid: string
  revision: number
  /** Unix seconds. */
  reviewedAt: number
  /** As attested, which the attester keeps sorted. */
  projectIds: string[]
  txHash: string
  blockNumber: number
}

export interface CropAttestationRpc {
  getLatestBlockNumber(): Promise<number>
  getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: LogsTopicFilter,
  ): Promise<EVMLog[]>
  call(params: CallParameters, blockNumber: number | 'latest'): Promise<Bytes>
}

const EAS = new utils.Interface([
  'event Attested(address indexed recipient, address indexed attester, bytes32 uid, bytes32 indexed schemaUID)',
  'function getAttestation(bytes32 uid) view returns (tuple(bytes32 uid, bytes32 schema, uint64 time, uint64 expirationTime, uint64 revocationTime, bytes32 refUID, address recipient, address attester, bool revocable, bytes data))',
])

/**
 * The attester's current attestation, or undefined when it has none. The
 * newest wins: of its attestations under the schema that are not revoked, the
 * one with the highest revision names the current set. EAS does not enforce
 * this, so every reader has to apply the same rule.
 */
export async function readCurrentCropAttestation(
  rpc: CropAttestationRpc,
  source: CropAttestationSourceParams,
): Promise<CropAttestation | undefined> {
  const block = await rpc.getLatestBlockNumber()
  const logs = await rpc.getLogs(
    source.startBlock,
    block,
    [source.eas],
    [
      EAS.getEventTopic('Attested'),
      null,
      utils.hexZeroPad(source.attester, 32).toLowerCase(),
      source.schemaUid.toLowerCase(),
    ],
  )
  const payloadTypes = source.schema
    .split(',')
    .map((param) => param.trim().split(' ')[0])

  const attestations: CropAttestation[] = []
  for (const log of logs) {
    const [uid] = utils.defaultAbiCoder.decode(['bytes32'], log.data)
    const raw = await rpc.call(
      {
        to: EthereumAddress(source.eas),
        input: Bytes.fromHex(EAS.encodeFunctionData('getAttestation', [uid])),
      },
      block,
    )
    const [record] = EAS.decodeFunctionResult('getAttestation', raw.toString())
    // The log filter is only a hint: the record itself must say who and under what.
    if (
      !sameHex(record.attester, source.attester) ||
      !sameHex(record.schema, source.schemaUid) ||
      !record.revocationTime.isZero()
    ) {
      continue
    }
    const payload = decodePayload(payloadTypes, record.data)
    if (payload) {
      attestations.push({
        uid: record.uid,
        ...payload,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      })
    }
  }
  return pickCurrentCropAttestation(attestations)
}

/** The highest revision wins; the later one breaks a tie. */
export function pickCurrentCropAttestation(
  attestations: CropAttestation[],
): CropAttestation | undefined {
  return attestations.reduce<CropAttestation | undefined>(
    (best, a) =>
      !best ||
      a.revision > best.revision ||
      (a.revision === best.revision && a.blockNumber > best.blockNumber)
        ? a
        : best,
    undefined,
  )
}

function decodePayload(
  types: string[],
  data: string,
): Pick<CropAttestation, 'projectIds' | 'reviewedAt' | 'revision'> | undefined {
  try {
    const [projectIds, reviewedAt, revision] = utils.defaultAbiCoder.decode(
      types,
      data,
    )
    return {
      projectIds: [...projectIds],
      reviewedAt: Number(reviewedAt),
      revision: Number(revision),
    }
  } catch {
    return undefined
  }
}

function sameHex(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}
