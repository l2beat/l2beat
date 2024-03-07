import { branded, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

export type ParsedBigQueryResult =
  | ParsedBigQueryTransferResult
  | ParsedBigQueryFunctionCallResult

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
  gas_price: z.number(),
  receipt_gas_used: z.number(),
  input: z.string(),
})

export type ParsedBigQueryFunctionCallResult = {
  type: 'functionCall'
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  toAddress: EthereumAddress
  gasPrice: number
  gasUsed: number
  input: string
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
  gas_price: z.number(),
  receipt_gas_used: z.number(),
})

export type ParsedBigQueryTransferResult = {
  type: 'transfer'
  hash: string
  blockNumber: number
  blockTimestamp: UnixTime
  fromAddress: EthereumAddress
  toAddress: EthereumAddress
  gasPrice: number
  gasUsed: number
}
