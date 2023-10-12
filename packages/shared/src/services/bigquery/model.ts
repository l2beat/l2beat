import { branded, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

export type BigQueryMethodsResult = z.infer<typeof BigQueryMethodsResult>
export const BigQueryMethodsResult = z
  .object({
    transaction_hash: z.string(),
    block_number: z.number(),
    block_timestamp: z
      .object({ value: z.string() })
      .transform((v) => UnixTime.fromDate(new Date(v.value))),
    to_address: branded(z.string(), EthereumAddress),
    input: z.string(),
  })
  .array()

export type BigQueryTransfersResult = z.infer<typeof BigQueryTransfersResult>
export const BigQueryTransfersResult = z
  .object({
    transaction_hash: z.string(),
    block_number: z.number(),
    block_timestamp: z
      .object({ value: z.string() })
      .transform((v) => UnixTime.fromDate(new Date(v.value))),
    from_address: branded(z.string(), EthereumAddress),
    to_address: branded(z.string(), EthereumAddress),
  })
  .array()
