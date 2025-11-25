import type { TrackedTxId } from '@l2beat/shared'
import {
  EthereumAddress,
  type ProjectId,
  type TrackedTxsConfigSubtype,
  type TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type TrackedTxResult =
  | TrackedTxTransferResult
  | TrackedTxFunctionCallResult

export type BigQueryFunctionCallResult = v.infer<
  typeof BigQueryFunctionCallResult
>
export const BigQueryFunctionCallResult = v.object({
  transaction_hash: v.string(),
  transaction_type: v.number(),
  block_number: v.number(),
  block_timestamp: v
    .object({ value: v.string() })
    .transform((v) => UnixTime.fromDate(new Date(v.value))),
  to_address: v.string().transform(EthereumAddress),
  input: v.string(),
  gas_used: v.number(),
  gas_price: v.unknown().transform((v) => BigInt(v as string)),
  data_length: v.number(),
  non_zero_bytes: v.number(),
})

export type TrackedTxFunctionCallResult = {
  formula: 'functionCall'
  id: TrackedTxId
  projectId: ProjectId
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
  hash: string
  txType: number
  blockNumber: number
  blockTimestamp: UnixTime
  toAddress: EthereumAddress
  input: string
  gasUsed: number
  gasPrice: bigint
  calldataGasUsed: number
  dataLength: number
  blobGasUsed: bigint
  blobGasPrice: bigint
}

export type BigQueryTransferResult = v.infer<typeof BigQueryTransferResult>
export const BigQueryTransferResult = v.object({
  transaction_hash: v.string(),
  transaction_type: v.number(),
  block_number: v.number(),
  block_timestamp: v
    .object({ value: v.string() })
    .transform((v) => UnixTime.fromDate(new Date(v.value))),
  from_address: v.string().transform(EthereumAddress),
  to_address: v.string().transform(EthereumAddress),
  gas_used: v.number(),
  gas_price: v.unknown().transform((v) => BigInt(v as string)),
  data_length: v.number(),
  non_zero_bytes: v.number(),
})

export type TrackedTxTransferResult = {
  formula: 'transfer'
  projectId: ProjectId
  id: TrackedTxId
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
  hash: string
  txType: number
  blockNumber: number
  blockTimestamp: UnixTime
  fromAddress: EthereumAddress
  toAddress: EthereumAddress
  gasUsed: number
  gasPrice: bigint
  calldataGasUsed: number
  dataLength: number
  blobGasUsed: bigint
  blobGasPrice: bigint
}
