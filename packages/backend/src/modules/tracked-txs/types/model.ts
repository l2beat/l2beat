import type { TrackedTxId } from '@l2beat/shared'
import {
  EthereumAddress,
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type TrackedTxResult =
  | TrackedTxTransferResult
  | TrackedTxFunctionCallResult

export type TrackedTxLivenessResult = Extract<
  TrackedTxResult,
  { type: 'liveness' }
>

export type TrackedTxCostsResult = Extract<TrackedTxResult, { type: 'l2costs' }>

type TrackedTxFeatureResult =
  | { type: 'liveness'; eventId: string }
  | { type: 'l2costs' }

export type DuneFunctionCallResult = v.infer<typeof DuneFunctionCallResult>
export const DuneFunctionCallResult = v.object({
  hash: v.string(),
  to: v.string().transform(EthereumAddress),
  block_number: v.number(),
  block_time: v.string().transform((v) => UnixTime.fromDate(new Date(v))),
  gas_used: v.number(),
  gas_price: v.unknown().transform((v) => BigInt(v as string)),
  blob_versioned_hashes: v.union([v.array(v.string()), v.null()]),
  data_length: v.number(),
  non_zero_bytes: v.number(),
  input: v.string(),
})

export type TrackedTxFunctionCallResult = TrackedTxFeatureResult & {
  formula: 'functionCall'
  id: TrackedTxId
  projectId: ProjectId
  subtype: TrackedTxsConfigSubtype
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  toAddress: EthereumAddress
  input: string
  gasUsed: number
  gasPrice: bigint
  calldataGasUsed: number
  dataLength: number
  blobVersionedHashes: string[] | null
}

export type DuneTransferResult = v.infer<typeof DuneTransferResult>
export const DuneTransferResult = v.object({
  hash: v.string(),
  from: v.string().transform(EthereumAddress),
  to: v.string().transform(EthereumAddress),
  block_number: v.number(),
  block_time: v.string().transform((v) => UnixTime.fromDate(new Date(v))),
  gas_used: v.number(),
  gas_price: v.unknown().transform((v: unknown) => BigInt(v as string)),
  blob_versioned_hashes: v.union([v.array(v.string()), v.null()]),
  data_length: v.number(),
  non_zero_bytes: v.number(),
})

export type TrackedTxTransferResult = TrackedTxFeatureResult & {
  formula: 'transfer'
  projectId: ProjectId
  id: TrackedTxId
  subtype: TrackedTxsConfigSubtype
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  fromAddress: EthereumAddress
  toAddress: EthereumAddress
  gasUsed: number
  gasPrice: bigint
  calldataGasUsed: number
  dataLength: number
  blobVersionedHashes: string[] | null
}
