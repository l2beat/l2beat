import type { TrackedTxId } from '@l2beat/shared'
import {
  EthereumAddress,
  type ProjectId,
  type TrackedTxsConfigSubtype,
  type TrackedTxsConfigType,
  UnixTime,
  branded,
} from '@l2beat/shared-pure'
import { z } from 'zod'

export type TrackedTxResult =
  | TrackedTxTransferResult
  | TrackedTxFunctionCallResult

export type BigQueryFunctionCallResult = z.infer<
  typeof BigQueryFunctionCallResult
>
export const BigQueryFunctionCallResult = z.object({
  hash: z.string(),
  block_number: z.number(),
  block_timestamp: z
    .object({ value: z.string() })
    .transform((v) => UnixTime.fromDate(new Date(v.value))),
  to_address: branded(z.string(), EthereumAddress),
  input: z.string(),
  receipt_gas_used: z.number(),
  gas_price: z.coerce.bigint(),
  calldata_gas_used: z.number(),
  data_length: z.number(),
  receipt_blob_gas_used: z.number().nullable(),
  receipt_blob_gas_price: z.coerce.bigint().nullable(),
})

export type TrackedTxFunctionCallResult = {
  formula: 'functionCall'
  id: TrackedTxId
  projectId: ProjectId
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  toAddress: EthereumAddress
  input: string
  receiptGasUsed: number
  gasPrice: bigint
  calldataGasUsed: number
  dataLength: number
  receiptBlobGasUsed: number | null
  receiptBlobGasPrice: bigint | null
}

export type BigQueryTransferResult = z.infer<typeof BigQueryTransferResult>
export const BigQueryTransferResult = z.object({
  hash: z.string(),
  block_number: z.number(),
  block_timestamp: z
    .object({ value: z.string() })
    .transform((v) => UnixTime.fromDate(new Date(v.value))),
  from_address: branded(z.string(), EthereumAddress),
  to_address: branded(z.string(), EthereumAddress),
  receipt_gas_used: z.number(),
  gas_price: z.coerce.bigint(),
  calldata_gas_used: z.number(),
  data_length: z.number(),
  receipt_blob_gas_used: z.number().nullable(),
  receipt_blob_gas_price: z.coerce.bigint().nullable(),
})

export type TrackedTxTransferResult = {
  formula: 'transfer'
  projectId: ProjectId
  id: TrackedTxId
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  fromAddress: EthereumAddress
  toAddress: EthereumAddress
  receiptGasUsed: number
  gasPrice: bigint
  calldataGasUsed: number
  dataLength: number
  receiptBlobGasUsed: number | null
  receiptBlobGasPrice: bigint | null
}
