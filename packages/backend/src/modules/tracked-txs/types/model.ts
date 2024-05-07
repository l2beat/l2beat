import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  branded,
} from '@l2beat/shared-pure'
import { z } from 'zod'

import { TrackedTxUseWithId } from './TrackedTxsConfig'

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
  transaction_type: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
  receipt_gas_used: z.number(),
  gas_price: z.number(),
  calldata_gas_used: z.number(),
  data_length: z.number(),
})

export type TrackedTxFunctionCallResult = {
  type: 'functionCall'
  projectId: ProjectId
  use: TrackedTxUseWithId
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  toAddress: EthereumAddress
  input: string
  transactionType: 0 | 1 | 2 | 3
  receiptGasUsed: number
  gasPrice: number
  calldataGasUsed: number
  dataLength: number
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
  transaction_type: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
  receipt_gas_used: z.number(),
  gas_price: z.number(),
  calldata_gas_used: z.number(),
  data_length: z.number(),
})

export type TrackedTxTransferResult = {
  type: 'transfer'
  projectId: ProjectId
  use: TrackedTxUseWithId
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  fromAddress: EthereumAddress
  toAddress: EthereumAddress
  transactionType: 0 | 1 | 2 | 3
  receiptGasUsed: number
  gasPrice: number
  calldataGasUsed: number
  dataLength: number
}
